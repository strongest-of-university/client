import styled from "styled-components";

export const HomePage = styled.div`
  min-height: 100vh;
  background: #fffdf8;
  color: #1d1c1a;
`;

export const Hero = styled.section`
  position: relative;
  height: 100vh;
  min-height: 680px;
  overflow: hidden;
  background: #7d8b98;
`;

export const HeroImage = styled.img<{ $active: boolean; $index: number }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: ${({ $index }) =>
    $index === 1 || $index === 2 ? "center 60%" : "center bottom"};
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  filter: saturate(0.72) brightness(0.8);
  transition: opacity 1.2s ease;
`;

export const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(18, 25, 31, 0.28);
`;

export const SliderDots = styled.div`
  position: absolute;
  bottom: 35px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
`;
export const Dot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "34px" : "13px")};
  height: 4px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: #fffdf8;
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  transition:
    width 0.7s ease,
    opacity 0.7s ease;
`;
export const InfoGrid = styled.section`
  max-width: 1200px;
  margin: auto;
  padding: clamp(64px, 9vw, 120px) clamp(20px, 4vw, 48px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(36px, 6vw, 80px);
`;
export const InfoColumn = styled.div`
  scroll-margin-top: 96px;
`;
export const SectionHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid #1d1c1a;
  padding-bottom: 14px;
  h2 {
    font:
      600 32px "Cormorant Garamond",
      serif;
    margin: 0;
  }
`;
export const NoticeRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #eae4d8;
  font-size: 14px;
  time {
    color: #6b665d;
    font-size: 12px;
    white-space: nowrap;
  }
`;
export const GuestCard = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #eae4d8;
  p {
    line-height: 1.7;
    font-size: 15px;
  }
`;
export const ReservationList = styled.div``;
export const ReservationRow = styled.article`
  min-height: 109px;
  padding: 22px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #eae4d8;

  @media (max-width: 600px) {
    align-items: flex-start;
  }
`;
export const ReservationSummary = styled.div`
  min-width: 0;
`;
export const ReservationTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 16px;
  line-height: 1.5;
`;
export const ReservationDetails = styled.p`
  margin: 0;
  color: #6b665d;
  font-size: 13px;
  line-height: 1.6;
  word-break: keep-all;
`;
export const StatusBadge = styled.span<{ $confirmed: boolean }>`
  flex: 0 0 auto;
  padding: 5px 12px;
  border: 1px solid #1d1c1a;
  border-radius: 999px;
  background: ${({ $confirmed }) => ($confirmed ? "#1d1c1a" : "transparent")};
  color: ${({ $confirmed }) => ($confirmed ? "#fffdf8" : "#1d1c1a")};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;
`;
export const HistorySubtitle = styled.p`
  margin: -12px 0 20px;
  color: #6b665d;
  font-size: 14px;
`;
export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;
`;
export const HistoryYear = styled.section``;
export const HistoryYearTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 21px;
  line-height: 1.5;
`;
export const TripList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;
export const TripItem = styled.li`
  position: relative;
  margin-left: 7px;
  padding: 0 0 14px 23px;
  border-left: 2px solid #e4ded3;

  &::before {
    content: "";
    position: absolute;
    top: 8px;
    left: -7px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #1d1c1a;
  }

  &:last-child { padding-bottom: 0; }
`;
export const TripDate = styled.h4`
  margin: 0 0 10px;
  font-size: 17px;
  line-height: 1.5;
`;
export const TripCard = styled.article`
  padding: 16px;
  border: 1px solid #dfd4c4;
  border-radius: 14px;
  background: #fffdf9;
`;
export const TripTitle = styled.h5`
  margin: 0 0 8px;
  font-size: 17px;
`;
export const TripDetails = styled.dl`
  margin: 0;
  font-size: 14px;
  line-height: 1.55;

  div {
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
    gap: 2px;
  }

  dt { color: #6b665d; }
  dd { margin: 0; }
`;
export const MoreTripsButton = styled.button`
  width: 100%;
  min-height: 62px;
  margin-top: 30px;
  border: 0;
  border-radius: 14px;
  background: #1d1c1a;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  span { margin-left: 8px; font-size: 20px; }
  &:hover { background: #39352f; }
  &:focus-visible { outline: 2px solid #88745a; outline-offset: 4px; }
`;
export const PrimaryLink = styled.a`
  display: block;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  text-decoration: none;
  border: 0;
  background: #1d1c1a;
  color: #fffdf8;
  padding: 16px;
`;
export const ThemePreview = styled.section`
  padding: 1px 50px 30px;
  text-align: center;
  background: #fffdf8;
  h2 {
    font:
      600 36px "Cormorant Garamond",
      serif;
  }
  a {
    color: #1d1c1a;
  }
`;
export const Eyebrow = styled.p`
  font:
    italic 27px "Cormorant Garamond",
    serif;
  margin: 0 0 10px;
`;
export const HeroTitle = styled.h1`
  font:
    700 clamp(38px, 4.6vw, 62px) "Noto Serif KR",
    serif;
  letter-spacing: -0.06em;
  margin: 0;
`;
export const SectionTitle = styled.h2`
  font:
    600 32px "Cormorant Garamond",
    serif;
  margin: 0;
`;
export const MoreButton = styled.a`
  background: none;
  color: inherit;
  text-decoration: none;
  border: 1px solid #1d1c1a;
  padding: 3px 8px;
  font-size: 12px;
  line-height: 1.5;
`;
export const NoticeText = styled.a`
  color: inherit;
  text-decoration: none;

  &:hover { text-decoration: underline; text-underline-offset: 3px; }
  &:focus-visible { outline: 2px solid #88745a; outline-offset: 4px; }
`;
export const NoticeLabel = styled.b``;
export const NoticeDate = styled.time`
  color: #6b665d;
  font-size: 12px;
  white-space: nowrap;
`;
export const GuestText = styled.p`
  line-height: 1.7;
  font-size: 15px;
`;
export const ThemeTitle = styled.h2`
  margin: 0;
  padding: 0 24px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(12px, 2vw, 24px);
  text-align: center;
  font:
    600 clamp(20px, 2.4vw, 28px) "Noto Serif KR",
    serif;
  letter-spacing: -0.04em;
  line-height: 1.5;

  &::before,
  &::after {
    content: "";
    flex: 0 1 64px;
    min-width: 16px;
    height: 1px;
    background: #d6cbbb;
  }

  @media (prefers-reduced-motion: no-preference) {
    transition:
      opacity 0.6s ease,
      transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);

    &[data-reveal="pending"] {
      opacity: 0;
      transform: translateY(28px);
    }
  }
`;
export const ThemeLink = styled.a`
  color: #1d1c1a;
`;
export const ThemeStack = styled.section`
  scroll-margin-top: 96px;
`;
export const ThemeCard = styled.article<{ $image: string }>`
  position: relative;
  scroll-margin-top: 88px;
  min-height: 520px;
  overflow: hidden;
  color: #fffdf8;
  background: url(${({ $image }) => $image}) center / cover no-repeat;

  @media (prefers-reduced-motion: no-preference) {
    transition:
      opacity 0.6s ease,
      transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);

    &[data-reveal="pending"]:not(:focus-within) {
      opacity: 0;
      transform: translateY(48px);
      pointer-events: none;
    }
  }
`;
export const ThemeShade = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(20, 18, 15, 0.38);
`;
export const ThemeContent = styled.div`
  position: relative;
  z-index: 1;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (prefers-reduced-motion: no-preference) {
    > * {
      transition:
        opacity 0.45s ease,
        transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }

    > :nth-child(1) { transition-delay: 0.06s; }
    > :nth-child(2) { transition-delay: 0.12s; }
    > :nth-child(3) { transition-delay: 0.18s; }

    [data-reveal="pending"]:not(:focus-within) & > * {
      opacity: 0;
      transform: translateY(20px);
    }
  }
`;
export const ThemeCardTitle = styled.h2`
  margin: 0;
  font:
    500 clamp(52px, 7vw, 96px) "Cormorant Garamond",
    serif;
`;
export const ThemeDescription = styled.p`
  margin: 10px 0 22px;
  font-size: 16px;
  font-weight: 500;
`;
export const ThemeMore = styled.a`
  padding: 11px 31px;
  border: 1px solid #fffdf8;
  color: #fffdf8;
  text-decoration: none;
  font:
    600 17px "Cormorant Garamond",
    serif;
  letter-spacing: 0.14em;
  transition:
    background-color 0.25s ease,
    color 0.25s ease;
  &:hover {
    background: #fffdf8;
    color: #1d1c1a;
  }
`;

export const HeroCopy = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fffdf8;
  text-align: center;
  .eyebrow {
    font:
      italic 27px "Cormorant Garamond",
      serif;
    margin: 0 0 10px;
  }
  h1 {
    font:
      700 clamp(38px, 4.6vw, 62px) "Noto Serif KR",
      serif;
    letter-spacing: -0.06em;
    margin: 0;
  }
`;

export const ReservationButton = styled.a`
  margin-top: 42px;
  padding: 12px 32px;
  border: 1px solid #fffdf8;
  color: #fffdf8;
  background: rgba(20, 20, 20, 0.05);
  text-decoration: none;
  font-weight: 600;
  transition:
    background-color 0.25s ease,
    color 0.25s ease;
  &:hover {
    background: #fffdf8;
    color: #1d1c1a;
  }
`;
