import { type FormEvent, useEffect, useRef, useState } from "react";
import { FiMic, FiSquare, FiSend } from "react-icons/fi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getErrorMessage } from "../../api/client";
import { sendVoiceAudio, sendVoiceText, type VoiceContext, type VoiceResponse } from "../../api/voice";
import type { TravelProduct } from "../../api/services";
import * as S from "./VoicePage.styles";

type Message = { role: "assistant" | "user"; text: string };
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

const initialMessage: Message = { role: "assistant", text: "안녕하세요! 어떤 여행을 원하시나요? 테마, 출발일, 인원 등을 말씀하거나 입력해 주세요." };

export default function VoicePage() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [context, setContext] = useState<VoiceContext>({ draft: {} });
  const [products, setProducts] = useState<TravelProduct[]>([]);
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [starting, setStarting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [audio, setAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const mounted = useRef(true);
  const requestLock = useRef(false);
  const recordingTimer = useRef<number | undefined>(undefined);
  const end = useRef<HTMLDivElement>(null);
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
  const visibleSuggestions = matchedSuggestions.slice(0, 8);

  function completeSuggestion(label: string) {
    setText((current) => {
      const word = current.match(/\S+$/)?.[0] ?? "";
      const prefix = word && label.includes(word) ? current.slice(0, -word.length) : current;
      return `${prefix}${prefix && !/\s$/.test(prefix) ? " " : ""}${label} `;
    });
    inputRef.current?.focus();
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
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [messages, busy]);

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

  async function submit(input: { text: string } | { audio: Blob }) {
    if (requestLock.current) return;
    requestLock.current = true;
    setBusy(true);
    setError("");
    try {
      const response: VoiceResponse = "text" in input
        ? await sendVoiceText(input.text, context)
        : await sendVoiceAudio(input.audio, context);
      if (!response || !response.draft || typeof response.draft !== "object") throw new Error("서버 응답을 확인할 수 없습니다. 다시 시도해 주세요.");
      const userText = "text" in input ? input.text : response.transcript?.trim() || "음성 메시지";
      const reply = [response.productMessage, ...(response.validationMessages ?? []), response.followUpQuestion].filter(Boolean).join("\n") || "말씀해 주신 여행 조건을 확인했어요. 아래 상품을 확인하거나 추가 조건을 말씀해 주세요.";
      setMessages((previous) => [...previous, { role: "user", text: userText }, { role: "assistant", text: reply }]);
      setContext({ draft: response.draft, lastQuestion: response.followUpQuestion ?? null });
      setProducts(response.products ?? []);
      if ("text" in input) setText("");
      else { setAudio(null); setAudioUrl(""); }
    } catch (caught) { setError(getErrorMessage(caught)); }
    finally { requestLock.current = false; if (mounted.current) setBusy(false); }
  }

  function submitText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = text.trim();
    if (value && !busy && !recording && !starting) void submit({ text: value });
  }
  function selectProduct(product: TravelProduct) {
    window.sessionStorage.setItem("selectedTravelProductId", String(product.travelProductId));
    window.sessionStorage.setItem("voiceBookingDraft", JSON.stringify(context.draft));
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
          <S.ChatHeader><strong>여행 예약 도우미</strong><span>음성과 채팅으로 이어서 대화할 수 있어요</span></S.ChatHeader>
          <S.Messages aria-live="polite" aria-relevant="additions text">
            {messages.map((item, index) => <S.MessageRow key={index} $user={item.role === "user"}><S.Bubble $user={item.role === "user"}><small>{item.role === "user" ? "나" : "예약 도우미"}</small><p>{item.text}</p></S.Bubble></S.MessageRow>)}
            {busy && <S.Waiting>여행 조건을 확인하고 있어요…</S.Waiting>}
            <div ref={end} />
          </S.Messages>
          {products.length > 0 && <S.Products><h2>추천 여행 일정</h2>{products.map((product) => <S.Product key={product.travelProductId}><div><strong>{product.departureDate.slice(0, 10)} 출발</strong><span>{product.returnDate.slice(0, 10)} 도착 · 잔여 {product.remainingCapacity}석</span></div><button type="button" disabled={busy || recording || starting || !["RECRUITING", "CONFIRMED"].includes(product.status) || !Number.isFinite(product.remainingCapacity) || product.remainingCapacity <= 0 || (context.draft.numberOfPeople != null && context.draft.numberOfPeople > product.remainingCapacity)} onClick={() => selectProduct(product)}>{!["RECRUITING", "CONFIRMED"].includes(product.status) || !Number.isFinite(product.remainingCapacity) || product.remainingCapacity <= 0 ? "예약 불가" : context.draft.numberOfPeople != null && context.draft.numberOfPeople > product.remainingCapacity ? "잔여 인원 부족" : "이 일정으로 예약"}</button></S.Product>)}</S.Products>}
          {audio && audioUrl && <S.AudioArea><span>녹음한 내용을 확인하고 전송해 주세요.</span><audio controls src={audioUrl}>이 브라우저에서는 녹음을 재생할 수 없습니다.</audio><div><button type="button" disabled={busy} onClick={() => { setAudio(null); setAudioUrl(""); }}>지우기</button><button type="button" disabled={busy} onClick={() => void submit({ audio })}>음성 전송</button></div></S.AudioArea>}
          {error && <S.Status role="alert">{error}</S.Status>}
          {visibleSuggestions.length > 0 && <S.Suggestions aria-label="여행 조건 자동완성">
            <span>{lastWord ? "추천 키워드" : "입력할 키워드"}</span>
            <div>{visibleSuggestions.map((item) => <button key={`${item.field}-${item.label}`} type="button" disabled={busy || recording || starting} onClick={() => completeSuggestion(item.label)}>{item.label}</button>)}</div>
          </S.Suggestions>}
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
