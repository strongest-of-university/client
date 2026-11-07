import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Header from "../../components/Header";
import * as S from "./MyPage.styles";

type Reservation = {
  date: string;
  status: string;
  reservationNumber: string;
  title: string;
  summary: string;
  option: string;
  details: {
    period: string;
    people: string;
    grade: string;
    hotel: string;
    transport: string;
    meal: string;
    gift: string;
    payment: string;
  };
  cancelState?: "available" | "unavailable";
};

const reservations: Reservation[] = [
  {
    date: "12월 05일 (토)",
    status: "모집 중",
    reservationNumber: "MW-261205-004",
    title: "효도 힐링 투어",
    summary: "12.05 – 12.09 · 2명 · 3,078,000원",
    option: "그랜드 / 4성 호텔 / 4박 5일 / 현지식 레스토랑",
    details: {
      period: "2026.12.05 – 12.09 (4박 5일)",
      people: "2명",
      grade: "그랜드",
      hotel: "4성급 호텔",
      transport: "10인 승합 고급차량",
      meal: "현지식 레스토랑",
      gift: "건강 인삼",
      payment: "3,078,000원",
    },
    cancelState: "available",
  },
  {
    date: "11월 21일 (토)",
    status: "출발 확정",
    reservationNumber: "MW-261121-018",
    title: "골프 챌린지 투어",
    summary: "11.21 – 11.24 · 2명 · 4,180,000원",
    option: "프리미엄 / 5성 호텔 / 3박 4일 / 스테이크 & 샴페인",
    details: {
      period: "2026.11.21 – 11.24 (3박 4일)",
      people: "2명",
      grade: "프리미엄",
      hotel: "5성급 호텔",
      transport: "10인 승합 고급차량",
      meal: "스테이크 & 샴페인",
      gift: "골프공",
      payment: "4,180,000원",
    },
    cancelState: "unavailable",
  },
  {
    date: "05월 10일 (일)",
    status: "여행 완료",
    reservationNumber: "MW-260510-022",
    title: "골프 챌린지 투어",
    summary: "05.10 – 05.13 · 1명 · 2,340,000원",
    option: "프리미엄 / 5성 호텔 / 3박 4일 / 스테이크 & 샴페인",
    details: {
      period: "2026.05.10 – 05.13 (3박 4일)",
      people: "1명",
      grade: "프리미엄",
      hotel: "5성급 호텔",
      transport: "10인 승합 고급차량",
      meal: "스테이크 & 샴페인",
      gift: "골프공",
      payment: "2,340,000원",
    },
  },
];

export default function MyPage() {
  const [message, setMessage] = useState("");
  const [expandedReservation, setExpandedReservation] = useState<string | null>(null);

  return (
    <S.Page>
      <Header currentPage="mypage" />
      <S.Main>
        <S.Title>마이페이지</S.Title>
        <S.Year>2026년</S.Year>
        <S.Timeline>
          {reservations.map((reservation) => {
            const detailOpen = expandedReservation === reservation.reservationNumber;
            const detailId = `reservation-detail-${reservation.reservationNumber}`;

            return (
            <S.TimelineItem key={reservation.reservationNumber}>
              <S.Date>{reservation.date}</S.Date>
              <S.Card>
                <S.StatusRow>
                  <S.Status>{reservation.status}</S.Status>
                  <S.ReservationNumber>
                    {reservation.reservationNumber}
                  </S.ReservationNumber>
                </S.StatusRow>
                <S.TourTitle>{reservation.title}</S.TourTitle>
                <S.Summary>{reservation.summary}</S.Summary>
                <S.OptionButton
                  type="button"
                  $open={detailOpen}
                  onClick={() => setExpandedReservation((current) =>
                    current === reservation.reservationNumber ? null : reservation.reservationNumber,
                  )}
                  aria-expanded={detailOpen}
                  aria-controls={detailId}
                >
                  <span>{reservation.option}</span>
                  <FiChevronDown aria-hidden="true" />
                </S.OptionButton>
                <S.DetailPanel id={detailId} $open={detailOpen} aria-hidden={!detailOpen}>
                  <S.DetailInner>
                    <S.DetailTitle>예약 상세 정보</S.DetailTitle>
                    <S.DetailList>
                      <div><dt>여행 일정</dt><dd>{reservation.details.period}</dd></div>
                      <div><dt>신청 인원</dt><dd>{reservation.details.people}</dd></div>
                      <div><dt>여행 등급</dt><dd>{reservation.details.grade}</dd></div>
                      <div><dt>호텔</dt><dd>{reservation.details.hotel}</dd></div>
                      <div><dt>교통</dt><dd>{reservation.details.transport}</dd></div>
                      <div><dt>식사</dt><dd>{reservation.details.meal}</dd></div>
                      <div><dt>기념품</dt><dd>{reservation.details.gift}</dd></div>
                      <div><dt>결제 금액</dt><dd>{reservation.details.payment}</dd></div>
                    </S.DetailList>
                  </S.DetailInner>
                </S.DetailPanel>

                {reservation.cancelState === "available" && (
                  <S.CancelButton
                    type="button"
                    onClick={() =>
                      setMessage("예약 취소 기능은 준비 중입니다.")
                    }
                  >
                    예약 취소
                  </S.CancelButton>
                )}
                {reservation.cancelState === "unavailable" && (
                  <>
                    <S.CancelButton type="button" disabled>
                      출발 확정 · 취소 불가
                    </S.CancelButton>
                    <S.Note>
                      출발이 확정된 상품은 예약을 취소할 수 없어요.
                    </S.Note>
                  </>
                )}
              </S.Card>
            </S.TimelineItem>
            );
          })}
        </S.Timeline>
        <S.LiveMessage role="status" aria-live="polite">
          {message}
        </S.LiveMessage>
      </S.Main>
    </S.Page>
  );
}
