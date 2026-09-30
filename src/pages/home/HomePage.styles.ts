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

export const Header = styled.header<{ $scrolled: boolean }>`
  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px clamp(28px, 4.3vw, 82px);
  background: ${({ $scrolled }) => ($scrolled ? "#1d1c1a" : "transparent")};
  box-shadow: ${({ $scrolled }) =>
    $scrolled ? "0 4px 18px rgba(0,0,0,.18)" : "none"};
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
`;

export const Brand = styled.a`
  color: #fffdf8;
  text-decoration: none;
  font:
    700 22px "Noto Serif KR",
    serif;
`;

export const Nav = styled.nav`
  display: flex;
  gap: clamp(12px, 2vw, 28px);
  a {
    color: #fffdf8;
    text-decoration: none;
    font:
      500 15px "Cormorant Garamond",
      serif;
    letter-spacing: 0.12em;
  }
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
export const InfoColumn = styled.div``;
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
  button {
    background: none;
    border: 1px solid #1d1c1a;
    padding: 4px 10px;
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
  padding: 100px 24px;
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
export const NavLink = styled.a`
  color: #fffdf8;
  text-decoration: none;
  font:
    500 15px "Cormorant Garamond",
    serif;
  letter-spacing: 0.12em;
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
export const MoreButton = styled.button`
  background: none;
  border: 1px solid #1d1c1a;
  padding: 4px 10px;
`;
export const NoticeText = styled.span``;
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
  font:
    600 36px "Cormorant Garamond",
    serif;
`;
export const ThemeLink = styled.a`
  color: #1d1c1a;
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
