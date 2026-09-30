import { useEffect, useState } from "react";
import { HomePage as Layout } from "./HomePage.styles";
import "../../App.css";

const slides = [
  "/images/lake-aerial.jpg",
  "/images/airplane-window.jpg",
  "/images/lakeside-village.jpg",
  "/images/hot-air-balloons.jpg",
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
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
  return (
    <Layout>
      <section className="hero-section screenshot-hero">
        {slides.map((image, index) => (
          <img
            key={image}
            className={`hero-image slide-${index} ${index === slide ? "active" : ""}`}
            src={image}
            alt="여행지 풍경"
          />
        ))}
        <div className="hero-overlay" />
        <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
          <a className="brand" href="/">
            미스터 월드
          </a>
          <nav>
            <a href="#themes">THEME</a>
            <a href="/reservation">RESERVATION</a>
            <a href="/login">LOGIN</a>
          </nav>
        </header>
        <div className="hero-copy">
          <p className="eyebrow">Travel with a purpose.</p>
          <h1>떠나는 이유에 맞춘 여행.</h1>
          <a className="outline-button" href="/reservation">
            여행 예약하기
          </a>
        </div>
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={index === slide ? "selected" : ""}
              onClick={() => setSlide(index)}
              aria-label={`${index + 1}번 슬라이드`}
            />
          ))}
        </div>
      </section>
      <section className="info-grid home-info-grid">
        <div className="info-column">
          <div className="section-heading">
            <h2>Notice</h2>
            <button>더보기 +</button>
          </div>
          {[
            ["신청 인원 3명 이상 시 출발이 확정됩니다", "2026.09.28"],
            ["예약 취소 위약금 기준 안내", "2026.09.20"],
            ["음성 예약 서비스를 시작합니다", "2026.09.12"],
            [
              "허니문·효도 테마는 그랜드 등급부터 선택 가능합니다",
              "2026.09.01",
            ],
          ].map(([title, date]) => (
            <div className="notice-row" key={title}>
              <span>
                <b>[공지]</b> {title}
              </span>
              <time>{date}</time>
            </div>
          ))}
        </div>
        <div className="info-column">
          <div className="section-heading">
            <h2>Reservation</h2>
            <button>더보기 +</button>
          </div>
          <div className="guest-card">
            <p>
              로그인하면 예약 현황과 이전 여행을 확인하고, 단골 고객 할인을 받을
              수 있어요.
            </p>
            <a className="primary" href="/login">
              로그인
            </a>
          </div>
        </div>
      </section>
      <section id="themes" className="theme-preview">
        <h2>Choose your journey</h2>
        <a href="/themes">테마 둘러보기</a>
      </section>
    </Layout>
  );
}
