import Header from "../../components/Header";
import { useEffect, useRef, useState } from "react";
import * as S from "./HomePage.styles";
import { notices } from "../notices/notices";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal";

const slides = [
  "/images/lake-aerial.jpg",
  "/images/airplane-window.jpg",
  "/images/lakeside-village.jpg",
  "/images/hot-air-balloons.jpg",
];
const themes = [
  [
    "Honeymoon",
    "둘만의 시작을 위한 로맨틱 스페셜 룸과 2인 전용 차량",
    "/images/honeymoon.jpg",
  ],
  ["Healing", "부모님을 위한 쉼과 회복의 여행", "/images/healing.jpg"],
  [
    "Golf",
    "유명 골프 리조트에서 즐기는 라운딩 챌린지",
    "/images/golf.jpg",
  ],
  ["Trekking", "산과 길을 걷는 아웃도어 어드벤처", "/images/trekking.jpg"],
];

const reservations = [
  {
    title: "골프 챌린지 투어",
    details: "2026.11.21 – 11.24 · 프리미엄 · 2명 · 4,180,000원",
    status: "출발 확정",
    confirmed: true,
  },
  {
    title: "효도 힐링 투어",
    details: "2026.12.05 – 12.09 · 그랜드 · 2명 · 3,078,000원",
    status: "모집 중",
    confirmed: false,
  },
];

const travelHistory = [
  {
    year: "2026년",
    trips: [
      {
        date: "05월 10일 (일)",
        title: "골프 챌린지 투어",
        period: "2026.05.10 – 05.13 (3박 4일)",
        grade: "프리미엄",
        price: "2,340,000원",
      },
    ],
  },
  {
    year: "2025년",
    trips: [
      {
        date: "10월 02일 (목)",
        title: "효도 힐링 투어",
        period: "2025.10.02 – 10.06 (4박 5일)",
        grade: "그랜드",
        price: "1,560,000원",
      },
      {
        date: "06월 21일 (토)",
        title: "아웃도어 트레킹 투어",
        period: "2025.06.21 – 06.23 (2박 3일)",
        grade: "클래식",
        price: "980,000원",
      },
    ],
  },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(
    () => window.sessionStorage.getItem("showTravelHistory") === "true",
  );
  const isLoggedIn = window.sessionStorage.getItem("isLoggedIn") === "true";
  const themeStackRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (historyOpen) window.sessionStorage.removeItem("showTravelHistory");
  }, [historyOpen]);

  useEffect(() => {
    const timer = window.setInterval(
      () => setSlide((current) => (current + 1) % slides.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const stack = themeStackRef.current;
    if (
      !stack ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const revealElements = stack.querySelectorAll<HTMLElement>("[data-theme-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.reveal = "visible";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );

    revealElements.forEach((element) => {
      element.dataset.reveal = "pending";
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      revealElements.forEach((element) => delete element.dataset.reveal);
    };
  }, []);

  return (
    <S.HomePage>
      <S.Hero>
        {slides.map((image, index) => (
          <S.HeroImage
            key={image}
            $active={index === slide}
            $index={index}
            src={image}
            alt="여행지 풍경"
          />
        ))}
        <S.HeroOverlay />
        <Header variant="home" />
        <S.HeroCopy>
          <S.Eyebrow>Travel with a purpose.</S.Eyebrow>
          <S.HeroTitle>떠나는 이유에 맞춘 여행.</S.HeroTitle>
          <S.ReservationButton href="/reservation">
            여행 예약하기
          </S.ReservationButton>
        </S.HeroCopy>
        <S.SliderDots>
          {slides.map((_, index) => (
            <S.Dot
              key={index}
              $active={index === slide}
              onClick={() => setSlide(index)}
              aria-label={`${index + 1}번 슬라이드`}
            />
          ))}
        </S.SliderDots>
      </S.Hero>
      <S.InfoGrid>
        <S.InfoColumn id="notices">
          <S.SectionHeading>
            <S.SectionTitle>Notice</S.SectionTitle>
          </S.SectionHeading>
          {notices.map(({ id, title, date }) => (
            <S.NoticeRow key={id}>
              <S.NoticeText href={`/notices/${id}`}>
                <S.NoticeLabel>[공지]</S.NoticeLabel> {title}
              </S.NoticeText>
              <S.NoticeDate>{date}</S.NoticeDate>
            </S.NoticeRow>
          ))}
        </S.InfoColumn>
        <S.InfoColumn id="reservation">
          <S.SectionHeading>
            <S.SectionTitle>Reservation</S.SectionTitle>
            <S.MoreButton href={isLoggedIn ? "#reservation" : "/login"}>더보기 +</S.MoreButton>
          </S.SectionHeading>
          {isLoggedIn ? (
            <S.ReservationList>
              {reservations.map((reservation) => (
                <S.ReservationRow key={reservation.title}>
                  <S.ReservationSummary>
                    <S.ReservationTitle>{reservation.title}</S.ReservationTitle>
                    <S.ReservationDetails>{reservation.details}</S.ReservationDetails>
                  </S.ReservationSummary>
                  <S.StatusBadge $confirmed={reservation.confirmed}>{reservation.status}</S.StatusBadge>
                </S.ReservationRow>
              ))}
            </S.ReservationList>
          ) : (
            <S.GuestCard>
              <S.GuestText>
                로그인하면 예약 현황과 이전 여행을 확인하고, 단골 고객 할인을 받을
                수 있어요.
              </S.GuestText>
              <S.PrimaryLink href="/login">로그인</S.PrimaryLink>
            </S.GuestCard>
          )}
        </S.InfoColumn>
      </S.InfoGrid>
      <S.ThemeStack id="themes" ref={themeStackRef}>
        <S.ThemeTitle data-theme-reveal>여행에도 취향이 있으니까</S.ThemeTitle>
        {themes.map(([title, description, image]) => (
          <S.ThemeCard
            key={title}
            id={`theme-${title.toLowerCase()}`}
            $image={image}
            data-theme-reveal
            onFocusCapture={(event) => {
              event.currentTarget.dataset.reveal = "visible";
            }}
          >
            <S.ThemeShade />
            <S.ThemeContent>
              <S.ThemeCardTitle>{title}</S.ThemeCardTitle>
              <S.ThemeDescription>{description}</S.ThemeDescription>
              <S.ThemeMore href={`/themes/${title.toLowerCase()}`}>
                more
              </S.ThemeMore>
            </S.ThemeContent>
          </S.ThemeCard>
        ))}
      </S.ThemeStack>
      <Footer />
      <Modal
        open={historyOpen}
        title="다시 오셨네요, 김정묵 님"
        onClose={() => setHistoryOpen(false)}
        size="large"
        tone="warm"
      >
        <S.HistorySubtitle>이전 여행 · 최근순</S.HistorySubtitle>
        <S.HistoryList>
          {travelHistory.map(({ year, trips }) => (
            <S.HistoryYear key={year}>
              <S.HistoryYearTitle>{year}</S.HistoryYearTitle>
              <S.TripList>
                {trips.map((trip) => (
                  <S.TripItem key={`${year}-${trip.date}`}>
                    <S.TripDate>{trip.date}</S.TripDate>
                    <S.TripCard>
                      <S.TripTitle>{trip.title}</S.TripTitle>
                      <S.TripDetails>
                        <div><dt>기간</dt><dd>{trip.period}</dd></div>
                        <div><dt>등급</dt><dd>{trip.grade}</dd></div>
                        <div><dt>가격</dt><dd><strong>{trip.price}</strong></dd></div>
                      </S.TripDetails>
                    </S.TripCard>
                  </S.TripItem>
                ))}
              </S.TripList>
            </S.HistoryYear>
          ))}
        </S.HistoryList>
        <S.MoreTripsButton type="button" onClick={() => setHistoryOpen(false)}>
          지난 여행 더 보러 가기 <span aria-hidden="true">→</span>
        </S.MoreTripsButton>
      </Modal>
    </S.HomePage>
  );
}
