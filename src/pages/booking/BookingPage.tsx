import { type FormEvent, useEffect, useMemo, useState } from "react";
import { FiCheck, FiChevronRight, FiFeather, FiFlag, FiHeart, FiMap } from "react-icons/fi";
import { getErrorMessage } from "../../api/client";
import { createBooking, previewBooking, type BookingPreview, type BookingSelection } from "../../services/bookingService";
import { getTravelProduct, getTravelProducts, minimumApplicantsForTheme, type ThemeCode, type TravelProduct } from "../../services/travelProductService";
import Header from "../../components/Header";
import Modal from "../../components/Modal";
import { useBookingDraft } from "../../contexts/booking/bookingDraftContext";
import * as S from "./BookingPage.styles";

type Grade = {
  id: "classic" | "grand" | "premium";
  name: string;
  hotel: string;
  meal: string;
  drink?: string;
  unavailable?: boolean;
};

type Theme = {
  id: string;
  title: string;
  description: string;
  color: string;
  Icon: typeof FiHeart;
  transport: string;
  schedules: { id: string; dates: string; duration: string; travelProductId?: number; status?: TravelProduct["status"]; remainingCapacity?: number }[];
  grades: Grade[];
};

const themes: Theme[] = [
  {
    id: "honeymoon",
    title: "허니문 낭만 투어",
    description: "2인 전용 로맨틱 스페셜 룸 데코레이션 · 커플 기념티 · 2인 전용 고급차량",
    color: "#873040",
    Icon: FiHeart,
    transport: "2인 전용 고급차량",
    schedules: [],
    grades: [
      { id: "classic", name: "클래식", hotel: "3성급 호텔", meal: "도시락", unavailable: true },
      { id: "grand", name: "그랜드", hotel: "4성급 호텔", meal: "현지식 레스토랑" },
      { id: "premium", name: "프리미엄", hotel: "5성급 호텔", meal: "고급 레스토랑 스테이크", drink: "샴페인" },
    ],
  },
  {
    id: "healing",
    title: "효도 힐링 투어",
    description: "고품격 안마·지압 서비스 · 건강 인삼 · 10인 승합 고급차량",
    color: "#806826",
    Icon: FiFeather,
    transport: "10인 승합 고급차량",
    schedules: [],
    grades: [
      { id: "classic", name: "클래식", hotel: "3성급 호텔", meal: "도시락", unavailable: true },
      { id: "grand", name: "그랜드", hotel: "4성급 호텔", meal: "현지식 레스토랑" },
      { id: "premium", name: "프리미엄", hotel: "5성급 호텔", meal: "고급 레스토랑 스테이크", drink: "샴페인" },
    ],
  },
  {
    id: "golf",
    title: "골프 챌린지 투어",
    description: "유명 골프 리조트 테마 연출 · 골프 액세서리(골프공) · 10인 승합 고급차량",
    color: "#315d3e",
    Icon: FiFlag,
    transport: "10인 승합 고급차량",
    schedules: [],
    grades: [
      { id: "classic", name: "클래식", hotel: "3성급 호텔", meal: "도시락" },
      { id: "grand", name: "그랜드", hotel: "4성급 호텔", meal: "현지식 레스토랑" },
      { id: "premium", name: "프리미엄", hotel: "5성급 호텔", meal: "고급 레스토랑 스테이크", drink: "샴페인" },
    ],
  },
  {
    id: "trekking",
    title: "아웃도어 트레킹 투어",
    description: "트레킹·산악 테마 어드벤처 연출 · 아웃도어 기념품(스카프) · 10인 승합 고급차량",
    color: "#365168",
    Icon: FiMap,
    transport: "10인 승합 고급차량",
    schedules: [],
    grades: [
      { id: "classic", name: "클래식", hotel: "3성급 호텔", meal: "도시락" },
      { id: "grand", name: "그랜드", hotel: "4성급 호텔", meal: "현지식 레스토랑" },
      { id: "premium", name: "프리미엄", hotel: "5성급 호텔", meal: "고급 레스토랑 스테이크", drink: "샴페인" },
    ],
  },
];

const steps = [
  ["테마 선택", "여행 목적 고르기"],
  ["일정 선택", "지원된 출발일 중에서"],
  ["인원 선택", "함께 가는 인원"],
  ["등급 선택", "호텔과 식사 기준"],
  ["옵션 변경", "원하는 구성으로"],
  ["신청", "상품별 기준 충족 시 확정"],
];

const agreementDetails = [
  {
    title: "개인정보 수집·이용 동의",
    sections: [
      ["수집·이용 목적", "미스터월드 서비스를 운영하는 최강팀은 회원 확인, 여행 예약과 결제 처리, 예약 내역 조회 및 여행 관련 안내를 위해 정보를 이용합니다."],
      ["수집 항목", "회원가입 시 입력한 아이디, 이름, 휴대폰 번호, 주소와 예약 시 선택한 일정·인원·여행 옵션 및 결제에 필요한 카드 정보를 처리합니다. 음성 예약을 이용할 때는 이용자가 제출한 음성과 입력 내용이 예약 조건 확인에 사용됩니다."],
      ["보유·이용 기간", "개인정보의 구체적인 보유 기간과 삭제 기준은 서비스 운영 정책을 확정할 때 정합니다."],
      ["동의 거부", "개인정보 수집·이용에 동의하지 않을 수 있으며, 필수 정보에 동의하지 않으면 예약을 진행할 수 없습니다."],
    ],
  },
  {
    title: "여행 약관 동의",
    sections: [
      ["예약 신청", "고객은 여행 테마, 출발 일정, 인원과 여행 구성을 확인하고 결제하여 예약을 신청합니다. 예약 내역은 마이페이지에서 확인할 수 있습니다."],
      ["여행 일정과 구성", "여행 일정 및 호텔, 교통, 식사 등은 고객이 예약 화면에서 선택한 상품과 옵션을 따릅니다. 예약 전 일정과 최종 금액을 확인해 주세요."],
      ["출발 확정", "상품별 신청 인원이 해당 상품의 출발 기준을 충족하면 출발이 확정됩니다."],
    ],
  },
  {
    title: "취소 및 위약금 규정 동의",
    sections: [
      ["취소 신청", "예약 취소 가능 여부는 마이페이지의 예약 상태에 따라 확인할 수 있습니다. 출발이 확정된 상품은 현재 화면에서 취소할 수 없습니다."],
      ["위약금과 환불", "취소할 때 표시되는 결제 금액, 위약금과 환불 예정 금액을 확인한 후 취소를 진행해 주세요. 환불 처리 시점은 결제 수단에 따라 달라질 수 있습니다."],
      ["규정 안내", "구체적인 취소 기한과 위약금 기준은 서비스 운영 정책 및 서버 처리 기준을 확인해 확정합니다."],
    ],
  },
] as const;

const currency = new Intl.NumberFormat("ko-KR");
const FIXED_DRINK_PRICES = { champagne: 70_000, coffee: 15_000 } as const;
const hotelChoices = [
  { value: "3성급 호텔" },
  { value: "4성급 호텔" },
  { value: "5성급 호텔" },
];
const transportChoices = [
  { value: "2인 전용 고급차량" },
  { value: "10인 승합 고급차량" },
];
const mealChoices = [
  { value: "도시락" },
  { value: "현지식 레스토랑" },
  { value: "고급 레스토랑 스테이크" },
];
const drinkChoices = [
  { value: "샴페인" },
  { value: "커피" },
];

const THEME_CODES: Record<string, ThemeCode> = {
  honeymoon: "HONEYMOON",
  healing: "HEALING",
  golf: "GOLF",
  trekking: "TREKKING",
};

const PRODUCT_STATUS_LABEL: Record<TravelProduct["status"], string> = {
  RECRUITING: "모집 중",
  CONFIRMED: "출발 확정",
  CLOSED: "마감",
  IN_PROGRESS: "여행 중",
  COMPLETED: "여행 완료",
  CANCELLED: "판매 중지",
};

export default function BookingPage() {
  const { consumeBookingDraft } = useBookingDraft();
  const [themeId, setThemeId] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [people, setPeople] = useState(1);
  const [gradeId, setGradeId] = useState("");
  const [hotelOption, setHotelOption] = useState("");
  const [transportOption, setTransportOption] = useState("");
  const [mealOption, setMealOption] = useState("");
  const [drinkOptions, setDrinkOptions] = useState<string[]>([]);
  const [agreements, setAgreements] = useState([false, false, false]);
  const [openAgreement, setOpenAgreement] = useState<number | null>(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [previewMessage, setPreviewMessage] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [productsByTheme, setProductsByTheme] = useState<Partial<Record<ThemeCode, TravelProduct[]>>>({});
  const [failedThemeCodes, setFailedThemeCodes] = useState<Set<ThemeCode>>(() => new Set());
  const [productsLoading, setProductsLoading] = useState(true);
  const [previewState, setPreviewState] = useState<{ key: string; data: BookingPreview } | null>(null);

  const availableThemes = useMemo(() => themes.map((item) => {
    const products = productsByTheme[THEME_CODES[item.id]];
    if (!products) return item;
    return {
      ...item,
      schedules: products
        .filter((product) => product.status === "RECRUITING" || product.status === "CONFIRMED")
        .map(productToSchedule),
    };
  }), [productsByTheme]);

  const theme = availableThemes.find((item) => item.id === themeId);
  const schedule = theme?.schedules.find((item) => item.id === scheduleId);
  const grade = theme?.grades.find((item) => item.id === gradeId);
  const selectedProduct = theme ? productsByTheme[THEME_CODES[theme.id]]?.find((product) => product.travelProductId === schedule?.travelProductId) : undefined;
  const allAgreed = agreements.every(Boolean);
  const isHoneymoon = theme?.id === "honeymoon";
  const departureMinimumPeople = theme ? minimumApplicantsForTheme(THEME_CODES[theme.id]) : 0;
  const rawMaxPeople = typeof schedule?.remainingCapacity === "number" ? Math.max(0, schedule.remainingCapacity) : 0;
  const maxPeople = isHoneymoon ? Math.floor(rawMaxPeople / 2) * 2 : rawMaxPeople;
  const minimumPeople = isHoneymoon ? 2 : 1;
  const peopleStep = isHoneymoon ? 2 : 1;
  const hasCapacity = maxPeople >= minimumPeople && people >= minimumPeople && people <= maxPeople && (!isHoneymoon || people % 2 === 0) && (schedule?.status === "RECRUITING" || schedule?.status === "CONFIRMED");
  const isComplete = Boolean(theme && schedule?.travelProductId && hasCapacity && grade && allAgreed);
  const selectedHotel = hotelOption || grade?.hotel;
  const selectedTransport = transportOption || theme?.transport;
  const selectedMeal = mealOption || grade?.meal;
  const requiresGrandOrHigher = theme?.id === "honeymoon" || theme?.id === "healing";
  const formattedCardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
  const paymentReady = /^\d{16}$/.test(cardNumber);

  const bookingSelection: BookingSelection | null = (() => {
    if (!schedule?.travelProductId || !hasCapacity || !grade || !selectedHotel || !selectedTransport || !selectedMeal) return null;
    return {
      travelProductId: schedule.travelProductId,
      tourLevel: grade.id.toUpperCase() as BookingSelection["tourLevel"],
      numberOfPeople: people,
      selectedHotel: Number(selectedHotel.match(/\d/)?.[0] ?? 0),
      selectedTransportation: selectedTransport.startsWith("2인") ? 1 : 2,
      selectedMeal: selectedMeal === "도시락" ? 1 : selectedMeal === "현지식 레스토랑" ? 2 : 3,
      selectedDrink: drinkOptions.length === 0 ? 0 : drinkOptions.length === 2 ? 3 : drinkOptions[0] === "샴페인" ? 1 : 2,
    };
  })();
  const selectionKey = bookingSelection ? JSON.stringify(bookingSelection) : "";
  const bookingPreview = previewState?.key === selectionKey ? previewState.data : null;
  const displayedOriginalPrice = bookingPreview?.originalPrice;
  const discount = bookingPreview?.discountAmount;
  const finalPrice = bookingPreview?.totalPrice;

  useEffect(() => {
    let active = true;
    const themeCodes = Object.values(THEME_CODES) as ThemeCode[];
    Promise.allSettled(themeCodes.map(async (code) => {
      const products = await getTravelProducts(code);
      const details = await Promise.all(products.map((product) => getTravelProduct(product.travelProductId).catch(() => product)));
      return [code, details.map((detail, index) => ({ ...products[index], ...detail, theme: code }))] as const;
    }))
      .then((results) => {
        if (!active) return;
        const entries = results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
        const failed = new Set(results.flatMap((result, index) => result.status === "rejected" ? [themeCodes[index]] : []));
        const next = Object.fromEntries(entries) as Partial<Record<ThemeCode, TravelProduct[]>>;
        setProductsByTheme(next);
        setFailedThemeCodes(failed);
        setProductsLoading(false);
        if (entries.length === 0) {
          const firstError = results.find((result) => result.status === "rejected");
          setSubmitMessage(`상품 일정을 불러오지 못했습니다.${firstError?.status === "rejected" ? ` ${getErrorMessage(firstError.reason)}` : ""}`);
          return;
        }
        const savedBookingDraft = consumeBookingDraft();
        const savedId = savedBookingDraft.travelProductId;
        if (savedId) {
          const matched = entries.find(([, products]) => products.some((product) => product.travelProductId === savedId));
          if (matched) {
            const selectedThemeId = Object.entries(THEME_CODES).find(([, code]) => code === matched[0])?.[0] ?? "";
            setThemeId(selectedThemeId);
            setScheduleId(String(savedId));
            const selectedProduct = matched[1].find((product) => product.travelProductId === savedId);
            const capacity = Math.max(0, selectedProduct?.remainingCapacity ?? 0);
            if (capacity > 0) setPeople(clampPeople(selectedThemeId === "honeymoon" ? 2 : 1, capacity, selectedThemeId === "honeymoon"));
            const savedDraft = savedBookingDraft.voiceDraft;
            if (savedDraft) {
              try {
                const draft = savedDraft;
                const selectedTheme = themes.find((item) => item.id === selectedThemeId);
                const matchedGrade = selectedTheme?.grades.find((item) => item.id.toUpperCase() === draft.tourLevel && !item.unavailable);
                if (matchedGrade) {
                  setGradeId(matchedGrade.id);
                  setMealOption(matchedGrade.meal);
                  setDrinkOptions(matchedGrade.drink ? [matchedGrade.drink] : []);
                }
                if (Number.isInteger(draft.numberOfPeople) && draft.numberOfPeople! >= 1 && capacity > 0) setPeople(clampPeople(draft.numberOfPeople!, capacity, selectedThemeId === "honeymoon"));
                const restricted = selectedThemeId === "honeymoon" || selectedThemeId === "healing";
                if (draft.selectedHotel && draft.selectedHotel >= (restricted ? 4 : 3) && draft.selectedHotel <= 5) setHotelOption(`${draft.selectedHotel}성급 호텔`);
                if (draft.selectedTransportation === 1 || draft.selectedTransportation === 2) setTransportOption(transportChoices[draft.selectedTransportation - 1].value);
                if (draft.selectedMeal && draft.selectedMeal >= (restricted ? 2 : 1) && draft.selectedMeal <= 3) setMealOption(mealChoices[draft.selectedMeal - 1].value);
                if (draft.selectedDrink === 1 || draft.selectedDrink === 3) setDrinkOptions(draft.selectedDrink === 3 ? ["샴페인", "커피"] : ["샴페인"]);
                else if (draft.selectedDrink === 2) setDrinkOptions(["커피"]);
              } catch { /* Invalid saved draft is ignored. */ }
            }
          }
        }
      })
      .catch((error) => {
        if (active) {
          setProductsLoading(false);
          setSubmitMessage(`상품 일정을 불러오지 못했습니다. ${getErrorMessage(error)}`);
        }
      });
    return () => { active = false; };
  }, [consumeBookingDraft]);

  useEffect(() => {
    if (!selectionKey) return;
    const selection = JSON.parse(selectionKey) as BookingSelection;
    let active = true;
    const timer = window.setTimeout(() => {
      previewBooking(selection)
        .then((preview) => {
          if (active) {
            setPreviewState({ key: selectionKey, data: preview });
            setPreviewMessage("");
          }
        })
        .catch((error) => {
          if (active) setPreviewMessage(getErrorMessage(error));
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [selectionKey]);

  const currentStep = (() => {
    if (!theme) return 1;
    if (!schedule) return 2;
    if (!grade) return 4;
    if (!allAgreed) return 5;
    return 6;
  })();

  function selectTheme(nextTheme: Theme) {
    setThemeId(nextTheme.id);
    setScheduleId("");
    setPeople(nextTheme.id === "honeymoon" ? 2 : 1);
    setGradeId("");
    setHotelOption("");
    setTransportOption("");
    setMealOption("");
    setDrinkOptions([]);
    setSubmitMessage("");
    setPreviewMessage("");
  }

  function selectGrade(nextGradeId: Grade["id"]) {
    const nextGrade = theme?.grades.find((item) => item.id === nextGradeId);
    setGradeId(nextGradeId);
    setHotelOption("");
    setMealOption(nextGrade?.meal ?? "");
    setDrinkOptions(nextGrade?.drink ? [nextGrade.drink] : []);
    setSubmitMessage("");
    setPreviewMessage("");
  }

  function toggleDrink(option: string) {
    setDrinkOptions((current) => current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option]);
  }

  function toggleAgreement(index: number) {
    setAgreements((current) => current.map((checked, itemIndex) => itemIndex === index ? !checked : checked));
  }

  function toggleAllAgreements() {
    const nextValue = !allAgreed;
    setAgreements([nextValue, nextValue, nextValue]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isComplete || !bookingSelection) return;
    setSubmitMessage("");
    setPaymentLoading(true);
    try {
      const preview = await previewBooking(bookingSelection);
      setPreviewState({ key: selectionKey, data: preview });
      setPaymentLoading(false);
      setPaymentOpen(true);
    } catch (error) {
      setPaymentLoading(false);
      setSubmitMessage(getErrorMessage(error));
    }
  }

  function updateCardNumber(value: string) {
    setCardNumber(value.replace(/\D/g, "").slice(0, 16));
  }

  async function completePayment() {
    if (!paymentReady || !bookingSelection) return;
    setPaymentOpen(false);
    setPaymentProcessing(true);
    try {
      await createBooking(bookingSelection, cardNumber, bookingPreview ?? undefined);
      setPaymentProcessing(false);
      setPaymentCompleted(true);
    } catch (error) {
      setPaymentProcessing(false);
      setPaymentOpen(true);
      setSubmitMessage(getErrorMessage(error));
    }
  }

  return (
    <S.Page>
      <Header currentPage="reservation" />
      <S.StepNav aria-label="예약 단계">
        {steps.map(([title, description], index) => (
          <S.Step key={title} $active={currentStep === index + 1} $complete={currentStep > index + 1}>
            <S.StepNumber>{index + 1}</S.StepNumber>
            <span><strong>{title}</strong><small>{description}</small></span>
          </S.Step>
        ))}
      </S.StepNav>

      <S.BookingForm onSubmit={handleSubmit}>
        <S.Content>
          <S.Section id="booking-theme">
            <S.SectionTitle>1. 어떤 여행을 찾으세요?</S.SectionTitle>
            <S.SectionDescription>테마별 기본 서비스와 기념품이 함께 제공됩니다.</S.SectionDescription>
            <S.ThemeGrid>
              {availableThemes.map((item) => {
                const Icon = item.Icon;
                return (
                  <S.ThemeCard
                    key={item.id}
                    type="button"
                    $selected={themeId === item.id}
                    $color={item.color}
                    onClick={() => selectTheme(item)}
                    aria-pressed={themeId === item.id}
                  >
                    <Icon aria-hidden="true" />
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </S.ThemeCard>
                );
              })}
            </S.ThemeGrid>
          </S.Section>

          <S.Section>
            <S.SectionTitle>2. 출발 일정을 고르세요</S.SectionTitle>
            <S.SectionDescription>{theme ? `미스터 월드가 기획한 여행 일정이에요. ${departureMinimumPeople}명 이상 모이면 출발이 확정됩니다.` : "테마를 선택하면 상품별 출발 기준을 확인할 수 있어요."}</S.SectionDescription>
            {!theme ? <S.EmptyState>테마를 먼저 고르면 출발 일정이 나와요.</S.EmptyState> : productsLoading ? (
              <S.EmptyState>상품 일정을 불러오는 중입니다.</S.EmptyState>
            ) : failedThemeCodes.has(THEME_CODES[theme.id]) ? (
              <S.EmptyState>이 테마의 상품 일정을 불러오지 못했습니다.</S.EmptyState>
            ) : theme.schedules.length > 0 ? (
              <S.ChoiceGrid>
                {theme.schedules.map((item) => (
                  <S.ChoiceCard
                    key={item.id}
                    type="button"
                    $selected={scheduleId === item.id}
                    disabled={!item.travelProductId || !Number.isFinite(item.remainingCapacity) || (item.remainingCapacity ?? 0) <= 0 || (item.status !== "RECRUITING" && item.status !== "CONFIRMED")}
                    onClick={() => {
                      setScheduleId(item.id);
                      setPeople((current) => clampPeople(current, item.remainingCapacity ?? 0, theme.id === "honeymoon"));
                    }}
                    aria-pressed={scheduleId === item.id}
                  >
                    <strong>{item.dates}</strong>
                    <span>{item.duration} · {item.status ? PRODUCT_STATUS_LABEL[item.status] : "모집 중"}{typeof item.remainingCapacity === "number" ? ` · 잔여 ${item.remainingCapacity}석` : ""}</span>
                  </S.ChoiceCard>
                ))}
              </S.ChoiceGrid>
            ) : <S.EmptyState>현재 예약 가능한 일정이 없습니다.</S.EmptyState>}
          </S.Section>

          <S.Section>
            <S.SectionTitle>3. 몇 분이 함께하세요?</S.SectionTitle>
            <S.SectionDescription>{theme ? `선택한 일정의 현재 신청 인원과 합쳐 ${departureMinimumPeople}명 이상이면 출발이 확정됩니다.` : "테마와 일정을 선택하면 출발 기준을 확인할 수 있어요."}</S.SectionDescription>
            <S.PeopleRow>
              <strong>신청 인원</strong>
              <S.Counter>
                <button type="button" onClick={() => setPeople((value) => Math.max(minimumPeople, value - peopleStep))} disabled={!schedule || people <= minimumPeople} aria-label="인원 줄이기">−</button>
                <strong>{people}명</strong>
                <button type="button" onClick={() => setPeople((value) => Math.min(maxPeople, value + peopleStep))} disabled={!schedule || people >= maxPeople} aria-label="인원 늘리기">+</button>
              </S.Counter>
            </S.PeopleRow>
            <S.HelpText>{schedule ? isHoneymoon ? `허니문은 2명 단위로 신청할 수 있어요. 남은 ${schedule.remainingCapacity ?? 0}석 중 최대 ${maxPeople}명까지 선택할 수 있습니다.` : `남은 ${schedule.remainingCapacity ?? 0}석 중 최대 ${maxPeople}명까지 신청할 수 있어요.` : "일정을 먼저 선택해 주세요."}</S.HelpText>
          </S.Section>

          <S.Section>
            <S.SectionTitle>4. 여행 등급을 고르세요</S.SectionTitle>
            <S.SectionDescription>등급은 기본 호텔과 식사 구성을 정합니다.</S.SectionDescription>
            <S.GradeGrid>
              {(theme?.grades ?? [
                { id: "classic", name: "클래식", hotel: "3성급 호텔", meal: "도시락" },
                { id: "grand", name: "그랜드", hotel: "4성급 호텔", meal: "현지식 레스토랑" },
                { id: "premium", name: "프리미엄", hotel: "5성급 호텔", meal: "고급 레스토랑 스테이크", drink: "샴페인" },
              ] as Grade[]).map((item) => (
                <S.GradeCard
                  key={item.id}
                  type="button"
                  $selected={gradeId === item.id}
                  disabled={!theme || item.unavailable}
                  onClick={() => selectGrade(item.id)}
                  aria-pressed={gradeId === item.id}
                >
                  <strong>{item.name}</strong>
                  <span>{item.hotel} · {item.meal}{item.drink ? ` · ${item.drink}` : ""}</span>
                  {item.unavailable && <small>이 테마에서는 선택 불가</small>}
                </S.GradeCard>
              ))}
            </S.GradeGrid>
            {!theme && <S.HelpText>● 테마를 먼저 고르면 선택 가능한 등급을 알려드려요.</S.HelpText>}
            {theme && theme.grades.some((item) => item.unavailable) && <S.HelpText>● 이 테마는 그랜드 등급부터 선택할 수 있어요.</S.HelpText>}
          </S.Section>

          <S.Section>
            <S.SectionTitle>5. 원하는 구성으로 바꿔보세요</S.SectionTitle>
            <S.SectionDescription>등급 기본값에서 호텔·교통·식사를 개별로 바꿀 수 있습니다.</S.SectionDescription>
            {theme && grade ? (
              <S.OptionRows>
                <S.OptionRow>
                  <S.OptionLabel>호텔 등급</S.OptionLabel>
                  <S.OptionChoices>
                    {hotelChoices.map((choice) => {
                      const unavailable = requiresGrandOrHigher && choice.value === "3성급 호텔";
                      const selected = selectedHotel === choice.value;
                      const price = choice.value === "3성급 호텔" ? selectedProduct?.threeStarHotelPrice : choice.value === "4성급 호텔" ? selectedProduct?.fourStarHotelPrice : selectedProduct?.fiveStarHotelPrice;
                      return <S.OptionButton key={choice.value} type="button" disabled={unavailable} $selected={selected} onClick={() => setHotelOption(choice.value)} aria-pressed={selected}><strong>{choice.value}</strong><span>{unavailable ? "이 테마 선택 불가" : formatOptionMeta(price, choice.value === grade.hotel ? "등급 기본" : undefined)}</span></S.OptionButton>;
                    })}
                  </S.OptionChoices>
                </S.OptionRow>
                <S.OptionRow>
                  <S.OptionLabel>교통</S.OptionLabel>
                  <S.OptionChoices>
                    {transportChoices.map((choice) => {
                      const selected = selectedTransport === choice.value;
                      const price = choice.value.startsWith("2인") ? selectedProduct?.luxuryCarPrice : selectedProduct?.luxuryVanPrice;
                      return <S.OptionButton key={choice.value} type="button" $selected={selected} onClick={() => setTransportOption(choice.value)} aria-pressed={selected}><strong>{choice.value}</strong><span>{formatOptionMeta(price, choice.value === theme.transport ? "테마 기본" : undefined)}</span></S.OptionButton>;
                    })}
                  </S.OptionChoices>
                </S.OptionRow>
                <S.OptionRow>
                  <S.OptionLabel>식사</S.OptionLabel>
                  <S.OptionChoices>
                    {mealChoices.map((choice) => {
                      const unavailable = requiresGrandOrHigher && choice.value === "도시락";
                      const selected = selectedMeal === choice.value;
                      const label = choice.value === "고급 레스토랑 스테이크" ? "스테이크" : choice.value;
                      const price = choice.value === "도시락" ? selectedProduct?.lunchPrice : choice.value === "현지식 레스토랑" ? selectedProduct?.localRestaurantPrice : selectedProduct?.steakPrice;
                      return <S.OptionButton key={choice.value} type="button" disabled={unavailable} $selected={selected} onClick={() => setMealOption(choice.value)} aria-pressed={selected}><strong>{label}</strong><span>{unavailable ? "이 테마 선택 불가" : formatOptionMeta(price, choice.value === grade.meal ? "등급 기본" : undefined)}</span></S.OptionButton>;
                    })}
                  </S.OptionChoices>
                </S.OptionRow>
                <S.OptionRow>
                  <S.OptionLabel>추가 옵션</S.OptionLabel>
                  <S.OptionChoices>
                    {drinkChoices.map((choice) => {
                      const selected = drinkOptions.includes(choice.value);
                      const price = choice.value === "샴페인" ? FIXED_DRINK_PRICES.champagne : FIXED_DRINK_PRICES.coffee;
                      return <S.OptionButton key={choice.value} type="button" $selected={selected} onClick={() => toggleDrink(choice.value)} aria-pressed={selected}><strong>{choice.value}</strong><span>{formatOptionMeta(price, choice.value === grade.drink ? "등급 기본" : undefined)}</span></S.OptionButton>;
                    })}
                  </S.OptionChoices>
                </S.OptionRow>
              </S.OptionRows>
            ) : <S.EmptyState>테마와 등급을 먼저 골라 주세요.</S.EmptyState>}
          </S.Section>

          <S.Section>
            <S.SectionTitle>6. 신청 정보를 확인하세요</S.SectionTitle>
            <S.SectionDescription>{theme ? `일정은 상품별로 확정되어 있으며, ${departureMinimumPeople}명 이상 신청 시 출발이 확정됩니다.` : "상품별 출발 기준을 확인한 뒤 신청해 주세요."}</S.SectionDescription>
            <S.AllAgreement>
              <input id="agree-all" type="checkbox" checked={allAgreed} onChange={toggleAllAgreements} />
              <label htmlFor="agree-all">전체 약관 동의</label>
            </S.AllAgreement>
            <S.AgreementList>
              {agreementDetails.map((agreement, index) => (
                <S.Agreement key={agreement.title}>
                  <input id={`agreement-${index}`} type="checkbox" aria-label={`${agreement.title} (필수)`} checked={agreements[index]} onChange={() => toggleAgreement(index)} />
                  <S.AgreementDetailsButton type="button" onClick={() => setOpenAgreement(index)} aria-label={`${agreement.title} 내용 보기`}>
                    <span>{agreement.title} (필수)</span><FiChevronRight aria-hidden="true" />
                  </S.AgreementDetailsButton>
                </S.Agreement>
              ))}
            </S.AgreementList>
          </S.Section>
        </S.Content>

        <S.Summary>
          <S.SummaryTitle>{theme?.title ?? "테마를 선택해 주세요"}</S.SummaryTitle>
          <S.SummaryList>
            <div><dt>등급</dt><dd>{grade?.name ?? "–"}</dd></div>
            <div><dt>출발</dt><dd>{schedule?.dates ?? "–"}</dd></div>
            <div><dt>호텔</dt><dd>{selectedHotel ?? "–"}</dd></div>
            <div><dt>교통</dt><dd>{selectedTransport ?? "–"}</dd></div>
            <div><dt>식사</dt><dd>{selectedMeal ?? "–"}</dd></div>
            <div><dt>추가 음료</dt><dd>{drinkOptions.length ? drinkOptions.join(" · ") : "없음"}</dd></div>
            <div><dt>신청 인원</dt><dd>{people}명</dd></div>
          </S.SummaryList>
          <S.PriceList>
            <div><dt>여행·옵션 금액</dt><dd>{displayedOriginalPrice ? `${currency.format(displayedOriginalPrice)}원` : "–"}</dd></div>
            <div><dt>단골 고객 7% 할인</dt><dd>{discount ? `−${currency.format(discount)}원` : "–"}</dd></div>
            <div><dt>최종 결제 예정 금액</dt><dd>{finalPrice ? `${currency.format(finalPrice)}원` : "–"}</dd></div>
          </S.PriceList>
          <S.SubmitButton type="submit" disabled={!isComplete}>결제하기</S.SubmitButton>
          <S.SummaryHint>{theme ? "모든 필수 항목과 약관을 확인해 주세요" : "1번에서 테마를 골라 주세요"}</S.SummaryHint>
          <S.SubmitMessage role="status" aria-live="polite">{submitMessage || previewMessage}</S.SubmitMessage>
        </S.Summary>
      </S.BookingForm>

      {paymentLoading && (
        <S.LoadingBackdrop role="dialog" aria-modal="true" aria-label="결제 정보 불러오는 중">
          <S.LoadingDialog>
            <S.Spinner aria-hidden="true" />
            <strong>결제 정보를 불러오는 중이에요</strong>
          </S.LoadingDialog>
        </S.LoadingBackdrop>
      )}

      {paymentProcessing && (
        <S.LoadingBackdrop role="dialog" aria-modal="true" aria-label="결제 처리 중">
          <S.LoadingDialog>
            <S.Spinner aria-hidden="true" />
            <strong>결제하는 중이에요</strong>
          </S.LoadingDialog>
        </S.LoadingBackdrop>
      )}

      {paymentCompleted && (
        <S.CompletionBackdrop role="dialog" aria-modal="true" aria-labelledby="payment-complete-title">
          <S.CompletionDialog>
            <S.CheckCircle aria-hidden="true"><FiCheck /></S.CheckCircle>
            <S.CompletionTitle id="payment-complete-title">예약 신청이 접수됐어요</S.CompletionTitle>
            <S.CompletionDescription>출발 기준 인원이 모이면 예약이 확정되고 문자로 안내해 드려요.</S.CompletionDescription>
            <S.CompletionActions>
              <S.HomeButton type="button" onClick={() => window.location.assign("/")}>홈으로</S.HomeButton>
              <S.HistoryButton type="button" onClick={() => window.location.assign("/mypage")}>예약 내역 보기</S.HistoryButton>
            </S.CompletionActions>
          </S.CompletionDialog>
        </S.CompletionBackdrop>
      )}

      {openAgreement !== null && (
        <Modal open title={agreementDetails[openAgreement].title} onClose={() => setOpenAgreement(null)} size="large" tone="warm">
          <S.AgreementContent>
            <p>미스터월드 서비스 · 최강팀 약관 안내 예시</p>
            {agreementDetails[openAgreement].sections.map(([heading, content]) => (
              <section key={heading}><h3>{heading}</h3><p>{content}</p></section>
            ))}
          </S.AgreementContent>
          <S.AgreementCloseButton type="button" onClick={() => setOpenAgreement(null)}>확인</S.AgreementCloseButton>
        </Modal>
      )}

      <Modal
        open={paymentOpen}
        title="결제 수단 확인"
        onClose={() => setPaymentOpen(false)}
        size="large"
        tone="warm"
      >
        <S.PaymentDescription>숫자 16자리의 카드 번호를 입력해 주세요. 결제가 끝나면 예약 신청이 완료돼요.</S.PaymentDescription>
        <S.SubmitMessage role="alert" aria-live="polite">{submitMessage}</S.SubmitMessage>
        <S.PaymentFields>
          <S.PaymentField>
            <label htmlFor="manual-payment-number">카드 번호</label>
            <input id="manual-payment-number" name="manual-payment-number" value={formattedCardNumber} onChange={(event) => updateCardNumber(event.target.value)} placeholder="1234 1234 1234 1234" inputMode="numeric" pattern="[0-9 ]*" maxLength={19} autoComplete="new-password" data-1p-ignore="true" data-lpignore="true" />
          </S.PaymentField>
        </S.PaymentFields>
        <S.PaymentTotal>
          <strong>총 결제 금액</strong>
          <span><b>{typeof finalPrice === "number" ? `${currency.format(finalPrice)}원` : "–"}</b><small>유류할증료·세금 포함</small></span>
        </S.PaymentTotal>
        <S.PaymentActions>
          <S.PreviousButton type="button" onClick={() => setPaymentOpen(false)}>이전</S.PreviousButton>
          <S.ConfirmPaymentButton type="button" disabled={!paymentReady} onClick={() => void completePayment()}>결제하고 예약하기</S.ConfirmPaymentButton>
        </S.PaymentActions>
      </Modal>
    </S.Page>
  );
}

function formatApiOptionPrice(value?: number) {
  if (typeof value !== "number") return "가격 확인 중";
  if (value === 0) return "+0원";
  return `+${currency.format(value)}원`;
}

function formatOptionMeta(value?: number, baseLabel?: string) {
  return [formatApiOptionPrice(value), baseLabel].filter(Boolean).join(" · ");
}

function clampPeople(value: number, capacity: number, evenOnly: boolean) {
  const boundedCapacity = Math.max(0, capacity);

  if (!evenOnly) {
    return boundedCapacity > 0
      ? Math.min(Math.max(1, value), boundedCapacity)
      : 1;
  }

  const evenMaximum = Math.floor(boundedCapacity / 2) * 2;
  if (evenMaximum < 2) return 2;

  const evenValue = Math.max(2, Math.ceil(value / 2) * 2);
  return Math.min(evenValue, evenMaximum);
}

function productToSchedule(product: TravelProduct) {
  const departure = new Date(product.departureDate);
  const returned = new Date(product.returnDate);
  const nights = Math.max(1, Math.round((returned.getTime() - departure.getTime()) / 86_400_000));
  const date = (value: Date, year = false) => new Intl.DateTimeFormat("ko-KR", {
    ...(year ? { year: "numeric" as const } : {}),
    month: "2-digit",
    day: "2-digit",
  }).format(value).replaceAll(". ", ".").replace(/\.$/, "");
  return {
    id: String(product.travelProductId),
    travelProductId: product.travelProductId,
    dates: `${date(departure, true)} – ${date(returned)}`,
    duration: `${nights}박 ${nights + 1}일`,
    status: product.status,
    remainingCapacity: product.remainingCapacity,
  };
}
