import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import Header from "../../components/Header";
import * as S from "./MyPage.styles";

type Reservation = {
  date: string;
  status: string;
  reservationNumber: string;
  title: string;
  summary: string;
  option: string;
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
    cancelState: "available",
  },
  {
    date: "11월 21일 (토)",
    status: "출발 확정",
    reservationNumber: "MW-261121-018",
    title: "골프 챌린지 투어",
    summary: "11.21 – 11.24 · 2명 · 4,180,000원",
    option: "프리미엄 / 5성 호텔 / 3박 4일 / 스테이크 & 샴페인",
    cancelState: "unavailable",
  },
  {
    date: "05월 10일 (일)",
    status: "여행 완료",
    reservationNumber: "MW-260510-022",
    title: "골프 챌린지 투어",
    summary: "05.10 – 05.13 · 1명 · 2,340,000원",
    option: "프리미엄 / 5성 호텔 / 3박 4일 / 스테이크 & 샴페인",
  },
];

export default function MyPage() {
  const [message, setMessage] = useState("");

  return (
    <S.Page>
      <Header currentPage="mypage" />
      <S.Main>
        <S.Title>마이페이지</S.Title>
        <S.Year>2026년</S.Year>
        <S.Timeline>
          {reservations.map((reservation) => (
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
                  onClick={() =>
                    setMessage(
                      `${reservation.title}의 상세 구성은 준비 중입니다.`,
                    )
                  }
                  aria-label={`${reservation.title} 상세 구성 보기`}
                >
                  <span>{reservation.option}</span>
                  <FiChevronRight aria-hidden="true" />
                </S.OptionButton>

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
          ))}
        </S.Timeline>
        <S.LiveMessage role="status" aria-live="polite">
          {message}
        </S.LiveMessage>
      </S.Main>
    </S.Page>
  );
}
