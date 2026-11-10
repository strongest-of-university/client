import Header from "../../components/Header";
import { getAccessToken } from "../../api/client";
import { getMyBookings, getMyProfile, type BookingDto } from "../../api/services";
import { useEffect, useRef, useState } from "react";
import * as S from "./HomePage.styles";
import { notices } from "../notices/notices";
import Footer from "../../components/Footer";
import Modal from "../../components/Modal";
import { FiMic } from "react-icons/fi";
import { LuMousePointer2 } from "react-icons/lu";

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

type HomeReservation = { title: string; details: string; status: string; confirmed: boolean };
type TravelHistoryGroup = {
  year: string;
  trips: { date: string; title: string; period: string; grade: string; price: string }[];
};

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(
    () => window.sessionStorage.getItem("showTravelHistory") === "true",
  );
  const [reservationOptionsOpen, setReservationOptionsOpen] = useState(
    () => window.sessionStorage.getItem("showReservationOptions") === "true",
  );
  const [reservationItems, setReservationItems] = useState<HomeReservation[]>([]);
  const [historyItems, setHistoryItems] = useState<TravelHistoryGroup[]>([]);
  const [profileName, setProfileName] = useState("고객");
  const isLoggedIn = Boolean(getAccessToken()) && window.sessionStorage.getItem("isLoggedIn") === "true";
  const themeStackRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (historyOpen) window.sessionStorage.removeItem("showTravelHistory");
  }, [historyOpen]);

  useEffect(() => {
    if (reservationOptionsOpen) window.sessionStorage.removeItem("showReservationOptions");
  }, [reservationOptionsOpen]);

  useEffect(() => {
    if (!isLoggedIn) return;
    let active = true;
    Promise.all([getMyBookings(), getMyProfile()])
      .then(([bookings, profile]) => {
        if (!active) return;
        setProfileName(profile.name);
        setReservationItems(bookings
          .filter((booking) => booking.bookingStatus !== "COMPLETED" && booking.bookingStatus !== "CANCELLED")
          .slice(0, 2)
          .map(toHomeReservation));
        setHistoryItems(toTravelHistory(bookings));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [isLoggedIn]);

  function openReservationOptions() {
    setReservationOptionsOpen(true);
  }

  function selectDirectReservation() {
    setReservationOptionsOpen(false);
    window.location.assign("/booking");
  }

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
        <Header variant="home" onReservationClick={openReservationOptions} />
        <S.HeroCopy>
          <S.Eyebrow>Travel with a purpose.</S.Eyebrow>
          <S.HeroTitle>떠나는 이유에 맞춘 여행.</S.HeroTitle>
          <S.ReservationButton
            href={isLoggedIn ? "#reservation" : "/reservation"}
            onClick={(event) => {
              if (!isLoggedIn) return;
              event.preventDefault();
              openReservationOptions();
            }}
          >
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
            <S.MoreButton
              href={isLoggedIn ? "#reservation" : "/reservation"}
              onClick={(event) => {
                if (!isLoggedIn) return;
                event.preventDefault();
                openReservationOptions();
              }}
            >
              더보기 +
            </S.MoreButton>
          </S.SectionHeading>
          {isLoggedIn ? (
            <S.ReservationList>
              {reservationItems.map((reservation) => (
                <S.ReservationRow key={reservation.title}>
                  <S.ReservationSummary>
                    <S.ReservationTitle>{reservation.title}</S.ReservationTitle>
                    <S.ReservationDetails>{reservation.details}</S.ReservationDetails>
                  </S.ReservationSummary>
                  <S.StatusBadge $confirmed={reservation.confirmed}>{reservation.status}</S.StatusBadge>
                </S.ReservationRow>
              ))}
              {reservationItems.length === 0 && <S.GuestText>진행 중인 예약이 없습니다.</S.GuestText>}
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
        title={`다시 오셨네요, ${profileName} 님`}
        onClose={() => setHistoryOpen(false)}
        size="large"
        tone="warm"
      >
        <S.HistorySubtitle>이전 여행 · 최근순</S.HistorySubtitle>
        <S.HistoryList>
          {historyItems.map(({ year, trips }) => (
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
        {historyItems.length === 0 && <S.HistorySubtitle>완료된 이전 여행이 없습니다.</S.HistorySubtitle>}
        <S.MoreTripsButton type="button" onClick={() => setHistoryOpen(false)}>
          지난 여행 더 보러 가기 <span aria-hidden="true">→</span>
        </S.MoreTripsButton>
      </Modal>
      <Modal
        open={reservationOptionsOpen}
        title="어떻게 예약할까요?"
        onClose={() => setReservationOptionsOpen(false)}
        size="wide"
        tone="warm"
      >
        <S.ReservationOptionGrid>
          <S.ReservationOption
            type="button"
            onClick={() => window.location.assign("/voice")}
          >
            <FiMic aria-hidden="true" />
            <strong>음성으로</strong>
            <span>말로 원하는 여행을 설명하면 필요한 정보를 되물어 채워 드려요</span>
          </S.ReservationOption>
          <S.ReservationOption type="button" onClick={selectDirectReservation}>
            <LuMousePointer2 className="direct-pointer" aria-hidden="true" />
            <strong>직접 선택</strong>
            <span>테마, 등급, 구성을 화면에서 하나씩 골라요</span>
          </S.ReservationOption>
        </S.ReservationOptionGrid>
      </Modal>
    </S.HomePage>
  );
}

const HOME_THEME_TITLE: Record<string, string> = {
  HONEYMOON: "허니문 낭만 투어",
  HEALING: "효도 힐링 투어",
  GOLF: "골프 챌린지 투어",
  TREKKING: "아웃도어 트레킹 투어",
};

const HOME_LEVEL_LABEL: Record<string, string> = { CLASSIC: "클래식", GRAND: "그랜드", PREMIUM: "프리미엄" };

function shortDate(value?: string) {
  return value ? value.slice(0, 10).replaceAll("-", ".") : "일정 미정";
}

function toHomeReservation(booking: BookingDto) {
  const confirmed = booking.bookingStatus === "CONFIRMED" || booking.bookingStatus === "IN_PROGRESS";
  return {
    title: HOME_THEME_TITLE[booking.theme ?? ""] ?? "테마 여행",
    details: `${shortDate(booking.departureDate)} – ${shortDate(booking.returnDate).slice(5)} · ${HOME_LEVEL_LABEL[booking.tourLevel ?? ""] ?? booking.tourLevel ?? "등급 미정"} · ${booking.numberOfPeople ?? 0}명 · ${(booking.totalPrice ?? 0).toLocaleString("ko-KR")}원`,
    status: confirmed ? "출발 확정" : "모집 중",
    confirmed,
  };
}

function toTravelHistory(bookings: BookingDto[]): TravelHistoryGroup[] {
  const grouped = new Map<string, TravelHistoryGroup["trips"]>();
  bookings.filter((booking) => booking.bookingStatus === "COMPLETED").forEach((booking) => {
    const departure = booking.departureDate?.slice(0, 10) ?? "";
    const year = `${departure.slice(0, 4)}년`;
    const trips = grouped.get(year) ?? [];
    trips.push({
      date: departure ? `${departure.slice(5, 7)}월 ${departure.slice(8, 10)}일` : "일정 미정",
      title: HOME_THEME_TITLE[booking.theme ?? ""] ?? "테마 여행",
      period: `${shortDate(booking.departureDate)} – ${shortDate(booking.returnDate).slice(5)}`,
      grade: HOME_LEVEL_LABEL[booking.tourLevel ?? ""] ?? booking.tourLevel ?? "등급 미정",
      price: `${(booking.totalPrice ?? 0).toLocaleString("ko-KR")}원`,
    });
    grouped.set(year, trips);
  });
  return [...grouped.entries()].map(([year, trips]) => ({ year, trips }));
}
