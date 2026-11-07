import { useMemo, useState } from "react";
import StaffHeader from "./StaffHeader";
import * as S from "./StaffReservationPage.styles";

type Status = "recruiting" | "confirmed" | "closed" | "paused";
type Filter = "all" | Status;
type Applicant = { name: string; people: number; phone: string };
type ReservationProduct = {
  id: string;
  theme: string;
  color: string;
  dates: string;
  duration: string;
  price: string;
  applicants: number;
  capacity: number;
  status: Status;
  customers: Applicant[];
};

const products: ReservationProduct[] = [
  { id: "P-261107-HNY", theme: "허니문 낭만 투어", color: "#8b3140", dates: "2026.11.07 – 11.12", duration: "5박 6일", price: "1인 1,890,000원", applicants: 2, capacity: 8, status: "recruiting", customers: [{ name: "최유진", people: 2, phone: "010-****-5810" }] },
  { id: "P-261114-TRK", theme: "아웃도어 트레킹 투어", color: "#38546c", dates: "2026.11.14 – 11.18", duration: "4박 5일", price: "1인 990,000원", applicants: 1, capacity: 10, status: "recruiting", customers: [{ name: "이서연", people: 1, phone: "010-****-0347" }] },
  { id: "P-261121-GLF", theme: "골프 챌린지 투어", color: "#2d613f", dates: "2026.11.21 – 11.24", duration: "3박 4일", price: "1인 1,590,000원", applicants: 4, capacity: 10, status: "confirmed", customers: [{ name: "김정묵", people: 2, phone: "010-****-0869" }, { name: "박민수", people: 2, phone: "010-****-7765" }] },
  { id: "P-261205-HLG", theme: "효도 힐링 투어", color: "#8a7129", dates: "2026.12.05 – 12.09", duration: "4박 5일", price: "1인 1,290,000원", applicants: 2, capacity: 10, status: "recruiting", customers: [{ name: "김정숙", people: 2, phone: "010-****-0869" }] },
  { id: "P-261219-HNY", theme: "허니문 낭만 투어", color: "#8b3140", dates: "2026.12.19 – 12.23", duration: "4박 5일", price: "1인 2,140,000원", applicants: 0, capacity: 8, status: "recruiting", customers: [] },
  { id: "P-261128-TRK", theme: "아웃도어 트레킹 투어", color: "#38546c", dates: "2026.11.28 – 12.01", duration: "3박 4일", price: "1인 890,000원", applicants: 4, capacity: 10, status: "confirmed", customers: [{ name: "정하늘", people: 2, phone: "010-****-2290" }, { name: "문채희", people: 2, phone: "010-****-4417" }] },
  { id: "P-261212-GLF", theme: "골프 챌린지 투어", color: "#2d613f", dates: "2026.12.12 – 12.16", duration: "4박 5일", price: "1인 1,720,000원", applicants: 1, capacity: 10, status: "recruiting", customers: [{ name: "한지민", people: 1, phone: "010-****-3021" }] },
  { id: "P-270109-HLG", theme: "효도 힐링 투어", color: "#8a7129", dates: "2027.01.09 – 01.12", duration: "3박 4일", price: "1인 1,180,000원", applicants: 0, capacity: 10, status: "recruiting", customers: [] },
];

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "recruiting", label: "모집 중" },
  { id: "confirmed", label: "출발 확정" },
  { id: "closed", label: "마감" },
  { id: "paused", label: "판매 중지" },
];

function statusLabel(status: Status) {
  return { recruiting: "모집 중", confirmed: "출발 확정", closed: "마감", paused: "판매 중지" }[status];
}

export default function StaffReservationPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const visibleProducts = useMemo(() => filter === "all" ? products : products.filter((product) => product.status === filter), [filter]);

  return (
    <S.Page>
      <StaffHeader current="reservation" />
      <S.Main>
        <S.Eyebrow>RESERVATION</S.Eyebrow>
        <S.Title>예약 현황</S.Title>
        <S.Description>상품별 신청 인원을 확인하고, 3명 이상이면 출발 확정 문자를 보내요.</S.Description>

        <S.Filters aria-label="예약 상태 필터">
          {filters.map((item) => {
            const count = item.id === "all" ? products.length : products.filter((product) => product.status === item.id).length;
            return <S.FilterButton key={item.id} type="button" $selected={filter === item.id} onClick={() => setFilter(item.id)}>{item.label} {count}</S.FilterButton>;
          })}
        </S.Filters>

        <S.Grid>
          {visibleProducts.map((product) => {
            const remaining = Math.max(0, 3 - product.applicants);
            const progress = Math.min(100, (product.applicants / product.capacity) * 100);
            return (
              <S.Card key={product.id}>
                <S.CardHeader>
                  <S.Theme><i style={{ background: product.color }} /><span><strong>{product.theme}</strong><small>{product.id}</small></span></S.Theme>
                  <S.Status $confirmed={product.status === "confirmed"}>{statusLabel(product.status)}</S.Status>
                </S.CardHeader>
                <S.TripInfo>{product.dates} · {product.duration} · {product.price}</S.TripInfo>
                <S.ApplicantHeader><span>신청 인원 (최소 3명)</span><strong>{product.applicants} / {product.capacity}명</strong></S.ApplicantHeader>
                <S.Progress aria-label={`최대 ${product.capacity}명 중 ${product.applicants}명 신청`}><i style={{ width: `${progress}%` }} /></S.Progress>
                <S.CustomerList>
                  {product.customers.map((customer) => <li key={`${product.id}-${customer.name}`}><span>{customer.name} · {customer.people}명</span><span>{customer.phone}</span></li>)}
                  {product.customers.length === 0 && <li><span>아직 신청자가 없어요.</span></li>}
                </S.CustomerList>
                <S.Confirmation $confirmed={product.status === "confirmed"}>{product.status === "confirmed" ? "출발 확정됨" : `${remaining}명 더 필요`}</S.Confirmation>
                <S.Help>{product.status === "confirmed" ? "출발이 확정된 상품이에요. 신청자에게 확정 문자가 발송됐어요." : "3명 이상 신청하면 출발을 확정할 수 있어요."}</S.Help>
              </S.Card>
            );
          })}
        </S.Grid>
        {visibleProducts.length === 0 && <S.Empty>해당 상태의 예약 상품이 없습니다.</S.Empty>}
      </S.Main>
    </S.Page>
  );
}
