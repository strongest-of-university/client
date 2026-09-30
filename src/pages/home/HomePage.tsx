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
  useEffect(() => {
    const timer = window.setInterval(
      () => setSlide((current) => (current + 1) % slides.length),
      5000,
    );
    return () => window.clearInterval(timer);
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
        <header className="site-header">
          <a className="brand" href="/">
            미스터 월드
          </a>
          <nav>
            <a href="#themes">THEME</a>
            <a href="/reservation">RESERVATION</a>
            <a href="/mypage">MY PAGE</a>
            <a href="/login">LOGOUT</a>
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
      <section id="themes" className="theme-preview">
        <h2>Choose your journey</h2>
        <a href="/themes">테마 둘러보기</a>
      </section>
    </Layout>
  );
}
