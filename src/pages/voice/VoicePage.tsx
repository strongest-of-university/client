import { type FormEvent, useEffect, useRef, useState } from "react";
import { FiMic, FiSquare, FiSend } from "react-icons/fi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getErrorMessage } from "../../api/client";
import { sendVoiceAudio, sendVoiceText, type VoiceContext, type VoiceResponse } from "../../api/voice";
import type { TravelProduct } from "../../api/services";
import { useBookingDraft } from "../../contexts/booking/bookingDraftContext";
import { needsConditionChange } from "./retryConditions";
import { readVoiceConversation, writeVoiceConversation, VOICE_SESSION_KEY, type Message, type VoiceConversation } from "./voiceSession";
import * as S from "./VoicePage.styles";

const suggestions = [
  { field: "theme", label: "골프" }, { field: "theme", label: "허니문" },
  { field: "theme", label: "힐링" }, { field: "theme", label: "트레킹" },
  { field: "numberOfPeople", label: "2명" }, { field: "numberOfPeople", label: "4명" },
  { field: "tourLevel", label: "클래식" }, { field: "tourLevel", label: "그랜드" }, { field: "tourLevel", label: "프리미엄" },
  { field: "selectedHotel", label: "3성급 호텔" }, { field: "selectedHotel", label: "4성급 호텔" }, { field: "selectedHotel", label: "5성급 호텔" },
  { field: "selectedTransportation", label: "2인 전용 고급차량" }, { field: "selectedTransportation", label: "10인 승합 고급차량" },
  { field: "selectedMeal", label: "도시락" }, { field: "selectedMeal", label: "현지식 레스토랑" }, { field: "selectedMeal", label: "스테이크와 샴페인" },
  { field: "selectedDrink", label: "음료 없음" }, { field: "selectedDrink", label: "커피" }, { field: "selectedDrink", label: "샴페인" },
] as const;

function questionField(question: string): typeof suggestions[number]["field"] | null {
  if (/테마|허니문|힐링|트레킹|골프/.test(question)) return "theme";
  if (/인원|몇\s*명|몇\s*분|몇\s*사람/.test(question)) return "numberOfPeople";
  if (/음료|커피|샴페인/.test(question)) return "selectedDrink";
  if (/식사|식단|레스토랑|도시락/.test(question)) return "selectedMeal";
  if (/교통|차량|이동/.test(question)) return "selectedTransportation";
  if (/호텔|숙소/.test(question)) return "selectedHotel";
  if (/등급|클래식|그랜드|프리미엄/.test(question)) return "tourLevel";
  return null;
}

const productThemeLabels = {
  GOLF: "골프 챌린지 투어",
  HONEYMOON: "허니문 낭만 투어",
  HEALING: "효도 힐링 투어",
  TREKKING: "아웃도어 트레킹 투어",
} as const;
const productStatusLabels: Record<TravelProduct["status"], string> = {
  RECRUITING: "모집 중", CONFIRMED: "출발 확정", CLOSED: "모집 마감",
  IN_PROGRESS: "여행 중", COMPLETED: "여행 완료", CANCELLED: "판매 취소",
};

const initialMessage: Message = { role: "assistant", text: "안녕하세요! 어떤 여행을 원하시나요? 테마, 출발일, 인원 등을 말씀하거나 입력해 주세요." };

export default function VoicePage() {
  const { saveBookingDraft } = useBookingDraft();
  const [conversation, setConversation] = useState<VoiceConversation>(() =>
    readVoiceConversation(window.sessionStorage) ?? { messages: [initialMessage], context: { draft: {} }, products: [], needsRetry: false },
  );
  const { messages, context, products, needsRetry } = conversation;
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [starting, setStarting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [audio, setAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const [retryDate, setRetryDate] = useState("");
  const [retryPeople, setRetryPeople] = useState("");
  const [otherDateOpen, setOtherDateOpen] = useState(false);
  const [otherDate, setOtherDate] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const mounted = useRef(true);
  const requestLock = useRef(false);
  const recordingTimer = useRef<number | undefined>(undefined);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastWord = text.match(/\S+$/)?.[0] ?? "";
  const currentQuestion = context.lastQuestion ?? "";
  const suggestedField = currentQuestion ? questionField(currentQuestion) : messages.length === 1 ? "theme" : null;
  const themeLabels = { GOLF: "골프", HONEYMOON: "허니문", HEALING: "힐링", TREKKING: "트레킹" };
  const excludedTheme = /이외|다른|외에/.test(currentQuestion) && context.draft.theme
    ? themeLabels[context.draft.theme]
    : undefined;
  const matchedSuggestions = lastWord
    ? suggestions.filter((item) => item.label.includes(lastWord) && item.label !== lastWord)
    : suggestions.filter((item) => item.field === suggestedField && item.label !== excludedTheme);
  const visibleSuggestions = needsRetry && !lastWord ? [] : matchedSuggestions.slice(0, 8);

  function completeSuggestion(label: string) {
    setText((current) => {
      const word = current.match(/\S+$/)?.[0] ?? "";
      const prefix = word && label.includes(word) ? current.slice(0, -word.length) : current;
      return `${prefix}${prefix && !/\s$/.test(prefix) ? " " : ""}${label} `;
    });
    inputRef.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      window.clearTimeout(recordingTimer.current);
      if (recorder.current && recorder.current.state !== "inactive") recorder.current.stop();
      stream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);
  useEffect(() => {
    const container = messagesRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, busy]);

  async function startRecording() {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("이 브라우저에서는 녹음을 사용할 수 없습니다. HTTPS 또는 localhost의 최신 브라우저에서 다시 시도해 주세요.");
      return;
    }
    setStarting(true);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) { media.getTracks().forEach((track) => track.stop()); return; }
      stream.current = media;
      const next = new MediaRecorder(media);
      recorder.current = next;
      const chunks: Blob[] = [];
      next.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      next.onstop = () => {
        window.clearTimeout(recordingTimer.current);
        media.getTracks().forEach((track) => track.stop());
        if (!mounted.current) return;
        setRecording(false);
        const result = new Blob(chunks, { type: next.mimeType });
        if (result.size > 25_000_000) setError("녹음 파일이 너무 큽니다. 짧게 다시 녹음해 주세요.");
        else if (result.size) { setAudio(result); setAudioUrl(URL.createObjectURL(result)); }
        else setError("녹음된 소리가 없습니다. 다시 시도해 주세요.");
      };
      next.onerror = () => { if (mounted.current) setError("녹음 중 문제가 발생했습니다. 다시 시도해 주세요."); };
      next.start();
      setAudio(null);
      setAudioUrl("");
      setRecording(true);
      recordingTimer.current = window.setTimeout(() => { if (next.state === "recording") next.stop(); }, 120_000);
    } catch {
      stream.current?.getTracks().forEach((track) => track.stop());
      if (mounted.current) setError("마이크를 사용할 수 없습니다. 브라우저의 마이크 권한을 확인해 주세요.");
    } finally { if (mounted.current) setStarting(false); }
  }

  async function submit(input: { text: string } | { audio: Blob }, nextContext: VoiceContext = context) {
    if (requestLock.current) return;
    requestLock.current = true;
    setBusy(true);
    setError("");
    try {
      const response: VoiceResponse = "text" in input
        ? await sendVoiceText(input.text, nextContext)
        : await sendVoiceAudio(input.audio, nextContext);
      if (!response || !response.draft || typeof response.draft !== "object") throw new Error("서버 응답을 확인할 수 없습니다. 다시 시도해 주세요.");
      const retry = needsConditionChange(response);
      const userText = "text" in input ? input.text : response.transcript?.trim() || "음성 메시지";
      const reply = [response.productMessage, ...(response.validationMessages ?? []), retry ? null : response.followUpQuestion].filter(Boolean).join("\n") || (retry ? "예약 가능한 자리가 부족합니다. 날짜나 인원을 변경해 주세요." : "말씀해 주신 여행 조건을 확인했어요. 아래 상품을 확인하거나 추가 조건을 말씀해 주세요.");
      const nextConversation: VoiceConversation = {
        messages: [...messages, { role: "user", text: userText }, { role: "assistant", text: reply }],
        context: { draft: response.draft, lastQuestion: retry ? null : response.followUpQuestion ?? null },
        products: response.products ?? [],
        needsRetry: retry,
      };
      writeVoiceConversation(window.sessionStorage, nextConversation);
      setConversation(nextConversation);
      setRetryDate("");
      setRetryPeople("");
      setOtherDateOpen(false);
      setOtherDate("");
      if ("text" in input) setText("");
      else { setAudio(null); setAudioUrl(""); }
    } catch (caught) { setError(getErrorMessage(caught)); }
    finally { requestLock.current = false; if (mounted.current) setBusy(false); }
  }

  function retrySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || recording || starting) return;
    const people = retryPeople ? Number(retryPeople) : undefined;
    if (!retryDate && people === undefined) {
      setError("변경할 날짜나 인원을 선택해 주세요.");
      return;
    }
    if (people !== undefined && (!Number.isInteger(people) || people < 1 || people > 10)) {
      setError("인원은 1명부터 10명까지 선택해 주세요.");
      return;
    }
    const draft = { ...context.draft };
    const changes: string[] = [];
    if (retryDate) {
      // Let the voice API interpret the selected date range, rather than guessing
      // whether its departureBefore boundary is inclusive.
      draft.departureFrom = null;
      draft.departureBefore = null;
      const [year, month, day] = retryDate.split("-");
      changes.push(`출발 날짜를 ${year}년 ${Number(month)}월 ${Number(day)}일로 변경`);
    }
    if (people !== undefined) {
      draft.numberOfPeople = people;
      changes.push(`인원을 ${people}명으로 변경`);
    }
    void submit({ text: `${changes.join(", ")}해 주세요.` }, { draft, lastQuestion: null });
  }

  function searchOtherDate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!otherDate || busy || recording || starting) return;
    const [year, month, day] = otherDate.split("-");
    const draft = { ...context.draft, departureFrom: null, departureBefore: null };
    void submit({ text: `${year}년 ${Number(month)}월 ${Number(day)}일 출발하는 다른 일정을 찾아주세요.` }, { draft, lastQuestion: null });
  }

  function submitText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = text.trim();
    if (value && !busy && !recording && !starting) void submit({ text: value });
  }
  function startNewConversation() {
    window.sessionStorage.removeItem(VOICE_SESSION_KEY);
    setConversation({ messages: [initialMessage], context: { draft: {} }, products: [], needsRetry: false });
    setText("");
    setAudio(null);
    setAudioUrl("");
    setRetryDate("");
    setRetryPeople("");
    setOtherDateOpen(false);
    setOtherDate("");
    setError("");
  }

  function selectProduct(product: TravelProduct) {
    saveBookingDraft(product.travelProductId, context.draft);
    window.location.assign("/booking");
  }

  return (
    <S.Page>
      <Header currentPage="reservation" />
      <S.Main>
        <S.BackLink href="/">← 홈으로</S.BackLink>
        <S.Heading>음성으로 여행 예약하기</S.Heading>
        <S.Description>말하거나 입력하면서 나에게 맞는 여행을 찾아보세요.</S.Description>
        <S.Chat aria-label="여행 예약 대화">
          <S.ChatHeader>
            <div><strong>여행 예약 도우미</strong><span>음성과 채팅으로 이어서 대화할 수 있어요</span></div>
            <button type="button" onClick={startNewConversation} disabled={busy || recording || starting}>새 대화</button>
          </S.ChatHeader>
          <S.Messages ref={messagesRef} aria-live="polite" aria-relevant="additions text">
            {messages.map((item, index) => <S.MessageRow key={index} $user={item.role === "user"}><S.Bubble $user={item.role === "user"}><small>{item.role === "user" ? "나" : "예약 도우미"}</small><p>{item.text}</p></S.Bubble></S.MessageRow>)}
            {busy && <S.Waiting>여행 조건을 확인하고 있어요…</S.Waiting>}
          </S.Messages>
          {needsRetry && <S.RetryForm onSubmit={retrySearch}>
            <div><h2>날짜나 인원을 변경해 보세요</h2><p>바꾸고 싶은 항목만 선택한 뒤 다시 조회할 수 있어요.</p></div>
            <S.RetryFields>
              <label htmlFor="retry-date">출발 날짜<input id="retry-date" type="date" value={retryDate} onChange={(event) => setRetryDate(event.target.value)} disabled={busy || recording || starting} /></label>
              <label htmlFor="retry-people">신청 인원<input id="retry-people" type="number" min="1" max="10" step="1" placeholder={context.draft.numberOfPeople ? `현재 ${context.draft.numberOfPeople}명` : "1~10명"} value={retryPeople} onChange={(event) => setRetryPeople(event.target.value)} disabled={busy || recording || starting} /></label>
              <button type="submit" disabled={busy || recording || starting}>{busy ? "조회 중…" : "다시 조회"}</button>
            </S.RetryFields>
          </S.RetryForm>}
          {products.length > 0 && (
            <S.Products>
              <h2>추천 여행 일정</h2>
              <S.ProductPrompt>아래 일정으로 예약하시겠어요? 다른 출발 날짜도 찾아볼 수 있어요.</S.ProductPrompt>
              <S.ProductList role="region" aria-label="추천 여행 일정 목록" tabIndex={0}>
              {products.map((product) => {
                const theme = product.theme ?? context.draft.theme;
                const unavailable = !["RECRUITING", "CONFIRMED"].includes(product.status) || !Number.isFinite(product.remainingCapacity) || product.remainingCapacity <= 0;
                const insufficient = context.draft.numberOfPeople != null && context.draft.numberOfPeople > product.remainingCapacity;
                return (
                  <S.Product key={product.travelProductId}>
                    <S.ProductInfo>
                      <S.ProductTitle><strong>{theme ? productThemeLabels[theme] : "여행 상품"}</strong><span>{productStatusLabels[product.status] ?? "상태 확인 필요"}</span></S.ProductTitle>
                      <S.ProductDates>{product.departureDate.slice(0, 10)} 출발 · {product.returnDate.slice(0, 10)} 도착</S.ProductDates>
                      <S.ProductCapacity>신청 {product.currentParticipants}명 / 정원 {product.capacity}명 · 잔여 {product.remainingCapacity}석</S.ProductCapacity>
                    </S.ProductInfo>
                    <button type="button" disabled={busy || recording || starting || unavailable || insufficient} onClick={() => selectProduct(product)}>{unavailable ? "예약 불가" : insufficient ? "잔여 인원 부족" : "이 일정으로 예약"}</button>
                  </S.Product>
                );
              })}
              </S.ProductList>
              {!otherDateOpen ? (
                <S.OtherDateButton type="button" disabled={busy || recording || starting} onClick={() => setOtherDateOpen(true)}>다른 날짜로 찾아보기</S.OtherDateButton>
              ) : (
                <S.OtherDateForm onSubmit={searchOtherDate}>
                  <label htmlFor="other-date">원하는 출발 날짜<input id="other-date" type="date" value={otherDate} onChange={(event) => setOtherDate(event.target.value)} required disabled={busy || recording || starting} /></label>
                  <button type="submit" disabled={busy || recording || starting || !otherDate}>일정 찾아보기</button>
                  <button type="button" disabled={busy} onClick={() => setOtherDateOpen(false)}>닫기</button>
                </S.OtherDateForm>
              )}
            </S.Products>
          )}
          {audio && audioUrl && (
            <S.AudioArea aria-label="녹음 확인">
              <S.AudioHeading>
                <S.AudioIcon aria-hidden="true"><FiMic /></S.AudioIcon>
                <div><strong>녹음이 완료되었어요</strong><span>내용을 확인한 뒤 전송해 주세요.</span></div>
              </S.AudioHeading>
              <S.AudioControls>
                <audio controls src={audioUrl} aria-label="녹음 내용 재생">이 브라우저에서는 녹음을 재생할 수 없습니다.</audio>
                <S.AudioActions>
                  <S.AudioDiscard type="button" disabled={busy} onClick={() => { setAudio(null); setAudioUrl(""); }}>지우기</S.AudioDiscard>
                  <S.AudioSend type="button" disabled={busy} onClick={() => void submit({ audio })}>{busy ? "전송 중…" : "음성 전송"} <FiSend aria-hidden="true" /></S.AudioSend>
                </S.AudioActions>
              </S.AudioControls>
            </S.AudioArea>
          )}
          {error && <S.Status role="alert">{error}</S.Status>}
          <S.Suggestions aria-label="여행 조건 자동완성">
            <span>{visibleSuggestions.length ? (lastWord ? "추천 키워드" : "입력할 키워드") : "여행 조건을 자유롭게 입력해 주세요."}</span>
            <div>{visibleSuggestions.map((item) => <button key={`${item.field}-${item.label}`} type="button" disabled={busy || recording || starting} onClick={() => completeSuggestion(item.label)}>{item.label}</button>)}</div>
          </S.Suggestions>
          <S.Composer onSubmit={submitText}>
            <S.RecordButton type="button" aria-label={recording ? "녹음 종료" : "녹음 시작"} disabled={busy || starting} onClick={recording ? () => recorder.current?.stop() : startRecording}>{recording ? <FiSquare /> : <FiMic />}</S.RecordButton>
            <label className="sr-only" htmlFor="voice-message">여행 조건 입력</label>
            <input ref={inputRef} id="voice-message" value={text} onChange={(event) => setText(event.target.value)} placeholder={recording ? "녹음 중입니다. 종료 버튼을 눌러 주세요." : "여행 조건을 입력해 주세요"} maxLength={6000} disabled={busy || recording || starting} />
            <S.SendButton type="submit" disabled={!text.trim() || busy || recording || starting} aria-label="메시지 전송"><FiSend /></S.SendButton>
          </S.Composer>
          <S.Hint>{recording ? "녹음 중 · 종료 버튼을 누르면 녹음 내용을 확인할 수 있어요 (최대 2분)" : "마이크를 눌러 녹음하거나 메시지를 입력해 주세요."}</S.Hint>
        </S.Chat>
        <S.Direct><span>화면에서 직접 선택하고 싶으신가요?</span> <a href="/booking">직접 선택으로 예약하기 →</a></S.Direct>
      </S.Main>
      <Footer />
    </S.Page>
  );
}
