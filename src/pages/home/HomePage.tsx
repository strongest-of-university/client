import { useEffect, useRef, useState } from "react";
import * as S from "./HomePage.styles";

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

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const themeStackRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = window.setInterval(
      () => setSlide((current) => (current + 1) % slides.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        <S.Header $scrolled={scrolled}>
          <S.Brand href="/">미스터 월드</S.Brand>
          <S.Nav>
            <S.NavLink href="#themes">THEME</S.NavLink>
            <S.NavLink href="/reservation">RESERVATION</S.NavLink>
            <S.NavLink href="/login">LOGIN</S.NavLink>
          </S.Nav>
        </S.Header>
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
        <S.InfoColumn>
          <S.SectionHeading>
            <S.SectionTitle>Notice</S.SectionTitle>
          </S.SectionHeading>
          {[
            ["신청 인원 3명 이상 시 출발이 확정됩니다", "2026.09.28"],
            ["예약 취소 위약금 기준 안내", "2026.09.20"],
            ["음성 예약 서비스를 시작합니다", "2026.09.12"],
            [
              "허니문·효도 테마는 그랜드 등급부터 선택 가능합니다",
              "2026.09.01",
            ],
          ].map(([title, date]) => (
            <S.NoticeRow key={title}>
              <S.NoticeText>
                <S.NoticeLabel>[공지]</S.NoticeLabel> {title}
              </S.NoticeText>
              <S.NoticeDate>{date}</S.NoticeDate>
            </S.NoticeRow>
          ))}
        </S.InfoColumn>
        <S.InfoColumn>
          <S.SectionHeading>
            <S.SectionTitle>Reservation</S.SectionTitle>
            <S.MoreButton href="/login">더보기 +</S.MoreButton>
          </S.SectionHeading>
          <S.GuestCard>
            <S.GuestText>
              로그인하면 예약 현황과 이전 여행을 확인하고, 단골 고객 할인을 받을
              수 있어요.
            </S.GuestText>
            <S.PrimaryLink href="/login">로그인</S.PrimaryLink>
          </S.GuestCard>
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
      <S.Footer>
        <S.FooterBrand>미스터 월드</S.FooterBrand>
        <S.FooterText>
          소프트웨어공학 프로젝트 · 과제팀 최강 · 김정묵 · 장은석 · 박종혁 · 지도교수 이병정
        </S.FooterText>
        <S.FooterText>문의 시간 09:00 ~ 21:00</S.FooterText>
        <S.Copyright>Copyright © 2026 Mr. World. All rights reserved.</S.Copyright>
      </S.Footer>
    </S.HomePage>
  );
}
