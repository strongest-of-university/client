import { type FormEvent, useMemo, useState } from "react";
import { FiChevronRight, FiFeather, FiFlag, FiHeart, FiMap } from "react-icons/fi";
import Header from "../../components/Header";
import * as S from "./BookingPage.styles";

type Grade = {
  id: "classic" | "grand" | "premium";
  name: string;
  hotel: string;
  meal: string;
  price: number;
  unavailable?: boolean;
};

type Theme = {
  id: string;
  title: string;
  description: string;
  color: string;
  Icon: typeof FiHeart;
  transport: string;
  schedules: { id: string; dates: string; duration: string }[];
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
    schedules: [
      { id: "honeymoon-1", dates: "2026.11.07 – 11.12", duration: "5박 6일" },
      { id: "honeymoon-2", dates: "2026.12.19 – 12.23", duration: "4박 5일" },
    ],
    grades: [
      { id: "classic", name: "클래식", hotel: "3성급 호텔", meal: "도시락", price: 1890000, unavailable: true },
      { id: "grand", name: "그랜드", hotel: "4성급 호텔", meal: "현지식 레스토랑", price: 2160000 },
      { id: "premium", name: "프리미엄", hotel: "5성급 호텔", meal: "고급 레스토랑 스테이크와 샴페인", price: 2550000 },
    ],
  },
  {
    id: "healing",
    title: "효도 힐링 투어",
    description: "고품격 안마·지압 서비스 · 건강 인삼 · 10인 승합 고급차량",
    color: "#806826",
    Icon: FiFeather,
    transport: "10인 승합 고급차량",
    schedules: [
      { id: "healing-1", dates: "2026.12.05 – 12.09", duration: "4박 5일" },
      { id: "healing-2", dates: "2027.01.09 – 01.12", duration: "3박 4일" },
    ],
    grades: [
      { id: "classic", name: "클래식", hotel: "3성급 호텔", meal: "도시락", price: 1290000, unavailable: true },
      { id: "grand", name: "그랜드", hotel: "4성급 호텔", meal: "현지식 레스토랑", price: 1560000 },
      { id: "premium", name: "프리미엄", hotel: "5성급 호텔", meal: "고급 레스토랑 스테이크와 샴페인", price: 1950000 },
    ],
  },
  {
    id: "golf",
    title: "골프 챌린지 투어",
    description: "유명 골프 리조트 테마 연출 · 골프 액세서리(골프공) · 10인 승합 고급차량",
    color: "#315d3e",
    Icon: FiFlag,
    transport: "10인 승합 고급차량",
    schedules: [
      { id: "golf-1", dates: "2026.11.21 – 11.24", duration: "3박 4일" },
      { id: "golf-2", dates: "2026.12.12 – 12.16", duration: "4박 5일" },
    ],
    grades: [
      { id: "classic", name: "클래식", hotel: "3성급 호텔", meal: "도시락", price: 1590000 },
      { id: "grand", name: "그랜드", hotel: "4성급 호텔", meal: "현지식 레스토랑", price: 1860000 },
      { id: "premium", name: "프리미엄", hotel: "5성급 호텔", meal: "고급 레스토랑 스테이크와 샴페인", price: 2250000 },
    ],
  },
  {
    id: "trekking",
    title: "아웃도어 트레킹 투어",
    description: "트레킹·산악 테마 어드벤처 연출 · 아웃도어 기념품(스카프) · 10인 승합 고급차량",
    color: "#365168",
    Icon: FiMap,
    transport: "10인 승합 고급차량",
    schedules: [
      { id: "trekking-1", dates: "2026.11.14 – 11.18", duration: "4박 5일" },
      { id: "trekking-2", dates: "2026.11.28 – 12.01", duration: "3박 4일" },
    ],
    grades: [
      { id: "classic", name: "클래식", hotel: "3성급 호텔", meal: "도시락", price: 990000 },
      { id: "grand", name: "그랜드", hotel: "4성급 호텔", meal: "현지식 레스토랑", price: 1260000 },
      { id: "premium", name: "프리미엄", hotel: "5성급 호텔", meal: "고급 레스토랑 스테이크와 샴페인", price: 1650000 },
    ],
  },
];

const steps = [
  ["테마 선택", "여행 목적 고르기"],
  ["일정 선택", "지원된 출발일 중에서"],
  ["인원 선택", "함께 가는 인원"],
  ["등급 선택", "호텔과 식사 기준"],
  ["옵션 변경", "원하는 구성으로"],
  ["신청", "3명부터 출발 확정"],
];

const currency = new Intl.NumberFormat("ko-KR");
const hotelChoices = [
  { value: "3성급 호텔", price: 0, priceLabel: "0원" },
  { value: "4성급 호텔", price: 180000, priceLabel: "+18만" },
  { value: "5성급 호텔", price: 420000, priceLabel: "+42만" },
];
const transportChoices = [
  { value: "2인 전용 고급차량", price: 150000, priceLabel: "+15만" },
  { value: "10인 승합 고급차량", price: 60000, priceLabel: "+6만" },
];
const mealChoices = [
  { value: "도시락", price: 0, priceLabel: "0원" },
  { value: "현지식 레스토랑", price: 90000, priceLabel: "+9만" },
  { value: "고급 레스토랑 스테이크와 샴페인", price: 240000, priceLabel: "+24만" },
];
const drinkChoices = [
  { value: "샴페인", price: 40000, priceLabel: "+40,000원" },
  { value: "커피", price: 7000, priceLabel: "+7,000원" },
];

function getChoicePrice(choices: { value: string; price: number }[], value?: string) {
  return choices.find((choice) => choice.value === value)?.price ?? 0;
}

export default function BookingPage() {
  const [themeId, setThemeId] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [people, setPeople] = useState(2);
  const [gradeId, setGradeId] = useState("");
  const [hotelOption, setHotelOption] = useState("");
  const [transportOption, setTransportOption] = useState("");
  const [mealOption, setMealOption] = useState("");
  const [drinkOptions, setDrinkOptions] = useState<string[]>([]);
  const [agreements, setAgreements] = useState([false, false, false]);
  const [submitMessage, setSubmitMessage] = useState("");

  const theme = themes.find((item) => item.id === themeId);
  const schedule = theme?.schedules.find((item) => item.id === scheduleId);
  const grade = theme?.grades.find((item) => item.id === gradeId);
  const allAgreed = agreements.every(Boolean);
  const isComplete = Boolean(theme && schedule && grade && allAgreed);
  const selectedHotel = hotelOption || grade?.hotel;
  const selectedTransport = transportOption || theme?.transport;
  const selectedMeal = mealOption || grade?.meal;
  const requiresGrandOrHigher = theme?.id === "honeymoon" || theme?.id === "healing";
  const changedOptions = [
    hotelOption && hotelOption !== grade?.hotel,
    transportOption && transportOption !== theme?.transport,
    mealOption && mealOption !== grade?.meal,
  ].filter(Boolean).length + drinkOptions.length;
  const optionAdjustment = grade && theme
    ? getChoicePrice(hotelChoices, selectedHotel) - getChoicePrice(hotelChoices, grade.hotel)
      + getChoicePrice(transportChoices, selectedTransport) - getChoicePrice(transportChoices, theme.transport)
      + getChoicePrice(mealChoices, selectedMeal) - getChoicePrice(mealChoices, grade.meal)
      + drinkOptions.reduce((sum, option) => sum + getChoicePrice(drinkChoices, option), 0)
    : 0;
  const price = grade ? (grade.price + optionAdjustment) * people : 0;
  const discount = Math.round(price * 0.05);
  const finalPrice = price - discount;

  const currentStep = useMemo(() => {
    if (!theme) return 1;
    if (!schedule) return 2;
    if (!grade) return 4;
    if (!allAgreed) return 5;
    return 6;
  }, [allAgreed, grade, schedule, theme]);

  function selectTheme(nextTheme: Theme) {
    setThemeId(nextTheme.id);
    setScheduleId("");
    setGradeId("");
    setHotelOption("");
    setTransportOption("");
    setMealOption("");
    setDrinkOptions([]);
    setSubmitMessage("");
  }

  function selectGrade(nextGradeId: Grade["id"]) {
    setGradeId(nextGradeId);
    setHotelOption("");
    setMealOption("");
    setSubmitMessage("");
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isComplete) return;
    setSubmitMessage("예약 신청이 접수되었습니다. 마이페이지에서 신청 내역을 확인해 주세요.");
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
              {themes.map((item) => {
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
            <S.SectionDescription>미스터 월드가 기획한 여행 일정이에요. 3명 이상 모이면 출발이 확정됩니다.</S.SectionDescription>
            {theme ? (
              <S.ChoiceGrid>
                {theme.schedules.map((item) => (
                  <S.ChoiceCard
                    key={item.id}
                    type="button"
                    $selected={scheduleId === item.id}
                    onClick={() => setScheduleId(item.id)}
                    aria-pressed={scheduleId === item.id}
                  >
                    <strong>{item.dates}</strong>
                    <span>{item.duration} · 모집 중</span>
                  </S.ChoiceCard>
                ))}
              </S.ChoiceGrid>
            ) : <S.EmptyState>테마를 먼저 고르면 출발 일정이 나와요.</S.EmptyState>}
          </S.Section>

          <S.Section>
            <S.SectionTitle>3. 몇 분이 함께하세요?</S.SectionTitle>
            <S.SectionDescription>선택한 일정의 현재 신청 인원과 합쳐 3명 이상이면 출발이 확정됩니다.</S.SectionDescription>
            <S.PeopleRow>
              <strong>신청 인원</strong>
              <S.Counter>
                <button type="button" onClick={() => setPeople((value) => Math.max(1, value - 1))} aria-label="인원 줄이기">−</button>
                <strong>{people}명</strong>
                <button type="button" onClick={() => setPeople((value) => Math.min(10, value + 1))} aria-label="인원 늘리기">+</button>
              </S.Counter>
            </S.PeopleRow>
          </S.Section>

          <S.Section>
            <S.SectionTitle>4. 여행 등급을 고르세요</S.SectionTitle>
            <S.SectionDescription>등급은 기본 호텔과 식사 구성을 정합니다.</S.SectionDescription>
            <S.GradeGrid>
              {(theme?.grades ?? [
                { id: "classic", name: "클래식", hotel: "3성급 호텔", meal: "도시락", price: 0 },
                { id: "grand", name: "그랜드", hotel: "4성급 호텔", meal: "현지식 레스토랑", price: 0 },
                { id: "premium", name: "프리미엄", hotel: "5성급 호텔", meal: "고급 레스토랑 스테이크와 샴페인", price: 0 },
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
                  <span>{item.hotel} · {item.meal}</span>
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
                      return <S.OptionButton key={choice.value} type="button" disabled={unavailable} $selected={selected} onClick={() => setHotelOption(choice.value)} aria-pressed={selected}><strong>{choice.value}</strong><span>{unavailable ? "이 테마 선택 불가" : `${choice.priceLabel}${choice.value === grade.hotel ? " · 등급 기본" : ""}`}</span></S.OptionButton>;
                    })}
                  </S.OptionChoices>
                </S.OptionRow>
                <S.OptionRow>
                  <S.OptionLabel>교통</S.OptionLabel>
                  <S.OptionChoices>
                    {transportChoices.map((choice) => {
                      const selected = selectedTransport === choice.value;
                      return <S.OptionButton key={choice.value} type="button" $selected={selected} onClick={() => setTransportOption(choice.value)} aria-pressed={selected}><strong>{choice.value}</strong><span>{choice.priceLabel}{choice.value === theme.transport ? " · 테마 기본" : ""}</span></S.OptionButton>;
                    })}
                  </S.OptionChoices>
                </S.OptionRow>
                <S.OptionRow>
                  <S.OptionLabel>식사</S.OptionLabel>
                  <S.OptionChoices>
                    {mealChoices.map((choice) => {
                      const unavailable = requiresGrandOrHigher && choice.value === "도시락";
                      const selected = selectedMeal === choice.value;
                      const label = choice.value === "고급 레스토랑 스테이크와 샴페인" ? "스테이크 & 샴페인" : choice.value;
                      return <S.OptionButton key={choice.value} type="button" disabled={unavailable} $selected={selected} onClick={() => setMealOption(choice.value)} aria-pressed={selected}><strong>{label}</strong><span>{unavailable ? "이 테마 선택 불가" : `${choice.priceLabel}${choice.value === grade.meal ? " · 등급 기본" : ""}`}</span></S.OptionButton>;
                    })}
                  </S.OptionChoices>
                </S.OptionRow>
                <S.OptionRow>
                  <S.OptionLabel>추가 옵션</S.OptionLabel>
                  <S.OptionChoices>
                    {drinkChoices.map((choice) => {
                      const selected = drinkOptions.includes(choice.value);
                      return <S.OptionButton key={choice.value} type="button" $selected={selected} onClick={() => toggleDrink(choice.value)} aria-pressed={selected}><strong>{choice.value}</strong><span>{choice.priceLabel}</span></S.OptionButton>;
                    })}
                  </S.OptionChoices>
                </S.OptionRow>
              </S.OptionRows>
            ) : <S.EmptyState>테마와 등급을 먼저 골라 주세요.</S.EmptyState>}
          </S.Section>

          <S.Section>
            <S.SectionTitle>6. 신청 정보를 확인하세요</S.SectionTitle>
            <S.SectionDescription>일정은 상품별로 확정되어 있으며, 3명 이상 신청 시 출발이 확정됩니다.</S.SectionDescription>
            <S.AllAgreement>
              <input id="agree-all" type="checkbox" checked={allAgreed} onChange={toggleAllAgreements} />
              <label htmlFor="agree-all">전체 약관 동의</label>
            </S.AllAgreement>
            <S.AgreementList>
              {["개인정보 수집·이용 동의 (필수)", "여행 약관 동의 (필수)", "취소 및 위약금 규정 동의 (필수)"].map((label, index) => (
                <S.Agreement key={label}>
                  <input id={`agreement-${index}`} type="checkbox" checked={agreements[index]} onChange={() => toggleAgreement(index)} />
                  <label htmlFor={`agreement-${index}`}>{label}</label>
                  <FiChevronRight aria-hidden="true" />
                </S.Agreement>
              ))}
            </S.AgreementList>
          </S.Section>
        </S.Content>

        <S.Summary>
          <S.SummaryBadge>● {theme ? "선택 중" : "선택 전"}</S.SummaryBadge>
          <S.SummaryTitle>{theme?.title ?? "테마를 선택해 주세요"}</S.SummaryTitle>
          <S.SummaryList>
            <div><dt>등급</dt><dd>{grade?.name ?? "–"}</dd></div>
            <div><dt>출발</dt><dd>{schedule?.dates ?? "–"}</dd></div>
            <div><dt>호텔</dt><dd>{selectedHotel ?? "–"}</dd></div>
            <div><dt>교통</dt><dd>{selectedTransport ?? "–"}</dd></div>
            <div><dt>식사</dt><dd>{selectedMeal ?? "–"}</dd></div>
            <div><dt>추가 음료</dt><dd>{drinkOptions.length ? drinkOptions.join(" · ") : "없음"}</dd></div>
            <div><dt>추가 옵션</dt><dd>{changedOptions ? `${changedOptions}개` : "없음"}</dd></div>
            <div><dt>신청 인원</dt><dd>{people}명</dd></div>
          </S.SummaryList>
          <S.PriceList>
            <div><dt>여행·옵션 금액</dt><dd>{price ? `${currency.format(price)}원` : "–"}</dd></div>
            <div><dt>단골 고객 5% 할인</dt><dd>{discount ? `−${currency.format(discount)}원` : "–"}</dd></div>
            <div><dt>최종 결제 예정 금액</dt><dd>{finalPrice ? `${currency.format(finalPrice)}원` : "–"}</dd></div>
          </S.PriceList>
          <S.SubmitButton type="submit" disabled={!isComplete}>결제하기</S.SubmitButton>
          <S.SummaryHint>{theme ? "모든 필수 항목과 약관을 확인해 주세요" : "1번에서 테마를 골라 주세요"}</S.SummaryHint>
          <S.SubmitMessage role="status" aria-live="polite">{submitMessage}</S.SubmitMessage>
        </S.Summary>
      </S.BookingForm>
    </S.Page>
  );
}
