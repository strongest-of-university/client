import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../../api/client";
import { getTravelProductBookings, type TravelProductBooking } from "../../services/bookingService";
import { getStaffTravelProducts, minimumApplicantsForTheme, type ThemeCode, type TravelProduct, type TravelProductStatus } from "../../services/travelProductService";
import StaffHeader from "./StaffHeader";
import * as S from "./StaffReservationPage.styles";

type Filter = "all" | TravelProductStatus;
type Applicant = { name: string; people: number; phone: string };
type ReservationProduct = {
  id: string;
  theme: string;
  color: string;
  dates: string;
  duration: string;
  applicants: number;
  capacity: number;
  minimumApplicants: number;
  status: TravelProductStatus;
  customers: Applicant[];
};

const THEME_INFO: Record<ThemeCode, { title: string; color: string; code: string }> = {
  HONEYMOON: { title: "허니문 낭만 투어", color: "#8b3140", code: "HNY" },
  HEALING: { title: "효도 힐링 투어", color: "#8a7129", code: "HLG" },
  GOLF: { title: "골프 챌린지 투어", color: "#2d613f", code: "GLF" },
  TREKKING: { title: "아웃도어 트레킹 투어", color: "#38546c", code: "TRK" },
};

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "RECRUITING", label: "모집 중" },
  { id: "CONFIRMED", label: "출발 확정" },
  { id: "CLOSED", label: "마감" },
  { id: "IN_PROGRESS", label: "여행 진행 중" },
  { id: "COMPLETED", label: "여행 완료" },
  { id: "CANCELLED", label: "판매 중지" },
];

const STATUS_LABEL: Record<TravelProductStatus, string> = {
  RECRUITING: "모집 중",
  CONFIRMED: "출발 확정",
  CLOSED: "마감",
  IN_PROGRESS: "여행 진행 중",
  COMPLETED: "여행 완료",
  CANCELLED: "판매 중지",
};

const STATUS_PRIORITY: Record<TravelProductStatus, number> = {
  RECRUITING: 0,
  CONFIRMED: 1,
  IN_PROGRESS: 2,
  CLOSED: 3,
  COMPLETED: 4,
  CANCELLED: 5,
};

export default function StaffReservationPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [products, setProducts] = useState<ReservationProduct[]>([]);
  const [message, setMessage] = useState("예약 현황을 불러오는 중입니다.");
  const visibleProducts = useMemo(() => filter === "all" ? products : products.filter((product) => product.status === filter), [filter, products]);

  useEffect(() => {
    let active = true;
    loadReservationProducts()
      .then((items) => {
        if (!active) return;
        setProducts(items);
        setMessage("");
      })
      .catch((error) => { if (active) setMessage(getErrorMessage(error)); });
    return () => { active = false; };
  }, []);

  return (
    <S.Page>
      <StaffHeader current="reservation" />
      <S.Main>
        <S.Eyebrow>RESERVATION</S.Eyebrow>
        <S.Title>예약 현황</S.Title>
        <S.Description>상품별 신청 인원과 출발 기준을 확인하고 확정 문자를 보내요.</S.Description>

        <S.Filters aria-label="예약 상태 필터">
          {filters.map((item) => {
            const count = item.id === "all" ? products.length : products.filter((product) => product.status === item.id).length;
            return <S.FilterButton key={item.id} type="button" $selected={filter === item.id} onClick={() => setFilter(item.id)}>{item.label} {count}</S.FilterButton>;
          })}
        </S.Filters>

        <S.Grid>
          {visibleProducts.map((product) => {
            const remaining = Math.max(0, product.minimumApplicants - product.applicants);
            const progress = Math.min(100, (product.applicants / product.capacity) * 100);
            const confirmed = product.status === "CONFIRMED";
            return (
              <S.Card key={product.id}>
                <S.CardHeader>
                  <S.Theme><i style={{ background: product.color }} /><span><strong>{product.theme}</strong><small>{product.id}</small></span></S.Theme>
                  <S.Status $confirmed={confirmed}>{STATUS_LABEL[product.status]}</S.Status>
                </S.CardHeader>
                <S.TripInfo>{product.dates} · {product.duration}</S.TripInfo>
                <S.ApplicantHeader><span>신청 인원 (최소 {product.minimumApplicants}명)</span><strong>{product.applicants} / {product.capacity}명</strong></S.ApplicantHeader>
                <S.Progress aria-label={`최대 ${product.capacity}명 중 ${product.applicants}명 신청`}><i style={{ width: `${progress}%` }} /></S.Progress>
                <S.CustomerList>
                  {product.customers.map((customer) => <li key={`${product.id}-${customer.name}`}><span>{customer.name} · {customer.people}명</span><span>{customer.phone}</span></li>)}
                  {product.customers.length === 0 && <li><span>아직 신청자가 없어요.</span></li>}
                </S.CustomerList>
                <S.Confirmation $confirmed={confirmed}>{statusSummary(product.status, remaining)}</S.Confirmation>
                <S.Help>{statusHelp(product.status, product.minimumApplicants)}</S.Help>
              </S.Card>
            );
          })}
        </S.Grid>
        {message && <S.Empty role="status">{message}</S.Empty>}
        {!message && visibleProducts.length === 0 && <S.Empty>해당 상태의 예약 상품이 없습니다.</S.Empty>}
      </S.Main>
    </S.Page>
  );
}

async function loadReservationProducts() {
  const products = await getStaffTravelProducts();
  const reservationProducts = await Promise.all(products.map(async (product) => {
    const page = await getTravelProductBookings(product.travelProductId);
    return toReservationProduct(product, product.theme, page.bookings ?? []);
  }));
  return reservationProducts.sort((a, b) =>
    STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]
    || a.dates.localeCompare(b.dates),
  );
}

function toReservationProduct(product: TravelProduct, theme: ThemeCode, bookings: TravelProductBooking[]): ReservationProduct {
  const info = THEME_INFO[theme];
  const start = product.departureDate.slice(0, 10);
  const end = product.returnDate.slice(0, 10);
  const nights = Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000));
  const activeBookings = bookings.filter((booking) => booking.bookingStatus !== "CANCELLED");
  return {
    id: `P-${start.slice(2).replaceAll("-", "")}-${info.code}`,
    theme: info.title,
    color: info.color,
    dates: `${start.replaceAll("-", ".")} – ${end.slice(5).replaceAll("-", ".")}`,
    duration: `${nights}박 ${nights + 1}일`,
    applicants: product.currentParticipants,
    capacity: product.capacity,
    minimumApplicants: minimumApplicantsForTheme(theme),
    status: product.status,
    customers: activeBookings.map((booking) => ({ name: booking.userName, people: booking.numberOfPeople, phone: maskPhone(booking.phoneNumber) })),
  };
}

function statusSummary(status: TravelProductStatus, remaining: number) {
  if (status === "RECRUITING") return `${remaining}명 더 필요`;
  return STATUS_LABEL[status];
}

function statusHelp(status: TravelProductStatus, minimumApplicants: number) {
  const messages: Record<TravelProductStatus, string> = {
    RECRUITING: `${minimumApplicants}명 이상 신청하면 출발이 확정돼요.`,
    CONFIRMED: "출발이 확정된 상품이에요. 신청자에게 확정 문자가 발송됐어요.",
    CLOSED: "예약 접수가 마감된 상품이에요.",
    IN_PROGRESS: "현재 여행이 진행 중인 상품이에요.",
    COMPLETED: "여행이 완료된 상품이에요.",
    CANCELLED: "상품 자체가 취소되어 판매가 중지됐어요.",
  };
  return messages[status];
}

function maskPhone(phone: string) {
  return phone.replace(/(01\d)-?\d{3,4}-?(\d{4})/, "$1-****-$2");
}
