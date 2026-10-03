import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: #fff;
  color: #1d1c1a;

  a:focus-visible,
  button:focus-visible {
    outline: 3px solid #b69b68;
    outline-offset: 5px;
  }
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 18px clamp(28px, 4.3vw, 82px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  background: #1d1c1a;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const Brand = styled.a`
  color: #fffdf8;
  font: 700 22px "Noto Serif KR", serif;
  text-decoration: none;
  white-space: nowrap;
`;

export const Nav = styled.nav`
  display: flex;
  gap: clamp(12px, 2vw, 28px);
  align-items: center;
`;

export const NavLink = styled.a`
  color: #fffdf8;
  font: 500 15px "Cormorant Garamond", serif;
  letter-spacing: 0.12em;
  text-decoration: none;

  &:hover { text-decoration: underline; text-underline-offset: 6px; }
`;

export const Hero = styled.section<{
  $image: string;
  $position: string;
  $mobilePosition: string;
}>`
  position: relative;
  min-height: 484px;
  display: flex;
  align-items: flex-end;
  background: url(${({ $image }) => $image}) ${({ $position }) => $position} / cover no-repeat;
  color: #fff;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(20, 18, 15, 0.38);
  }

  @media (max-width: 600px) {
    min-height: 420px;
    background-position: ${({ $mobilePosition }) => $mobilePosition};
  }
`;

export const HeroContent = styled.div`
  position: relative;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 56px 24px 68px;
`;

export const Eyebrow = styled.p`
  margin: 0 0 12px;
  font: 500 clamp(52px, 6vw, 80px) "Cormorant Garamond", serif;
  line-height: 1.1;
`;

export const Title = styled.h1`
  margin: 0 0 18px;
  font: 700 clamp(28px, 3.2vw, 44px) "Noto Serif KR", serif;
  line-height: 1.45;
  letter-spacing: -0.04em;
`;

export const HeroDescription = styled.p`
  margin: 0;
  font-size: clamp(15px, 1.35vw, 18px);
  font-weight: 600;
  line-height: 1.7;
  word-break: keep-all;
`;

export const Content = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 24px 80px;
`;

export const Overview = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 5vw, 70px);

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

export const SectionTitle = styled.h2<{ $compact?: boolean }>`
  margin: 0 0 ${({ $compact }) => ($compact ? "18px" : "22px")};
  padding-bottom: ${({ $compact }) => ($compact ? "14px" : "18px")};
  border-bottom: 1px solid #1d1c1a;
  font: 500 ${({ $compact }) => ($compact ? "30px" : "36px")} "Cormorant Garamond", serif;
  line-height: 1.25;
`;

export const Introduction = styled.p`
  margin: 0 0 20px;
  font-size: 16px;
  line-height: 1.9;
  word-break: keep-all;
`;

export const FeatureList = styled.dl`
  margin: 0;
`;

export const Feature = styled.div`
  display: grid;
  grid-template-columns: 108px minmax(0, 1fr);
  gap: 16px;
  padding: 13px 0;
  border-bottom: 1px solid #e8e0d5;
  font-size: 15px;
  line-height: 1.5;
  word-break: keep-all;

  dt { font-weight: 700; }
  dd { margin: 0; }

  @media (max-width: 600px) {
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 12px;
    font-size: 15px;
  }
`;

export const Restriction = styled.p`
  margin: 16px 0 0;
  color: #b43d16;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
  word-break: keep-all;
`;

export const DeparturesSection = styled.section`
  scroll-margin-top: 96px;

  @media (max-width: 600px) {
    scroll-margin-top: 128px;
  }
`;

export const DepartureList = styled.div`
  display: grid;
  gap: 18px;
`;

export const DepartureCard = styled.article`
  padding: 20px;
  border: 1px solid #dacebd;
  border-radius: 16px;

  @media (max-width: 600px) { padding: 16px; }
`;

export const CardHeading = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px 16px;
  margin-bottom: 14px;
`;

export const DepartureTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  line-height: 1.4;

  @media (max-width: 600px) { font-size: 18px; }
`;

export const Badge = styled.span<{ $confirmed: boolean }>`
  padding: 4px 10px;
  border-radius: 20px;
  background: ${({ $confirmed }) => ($confirmed ? "#1d1c1a" : "#f5f5f5")};
  color: ${({ $confirmed }) => ($confirmed ? "#fff" : "#1d1c1a")};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`;

export const DetailRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 16px;
  font-size: 14px;
  line-height: 1.6;
`;

export const CapacityRow = styled(DetailRow)`
  margin-top: 8px;
  font-size: 13px;
`;

export const CapacityBar = styled.progress`
  display: block;
  width: 100%;
  height: 6px;
  margin: 6px 0 12px;
  overflow: hidden;
  appearance: none;
  border: 0;
  border-radius: 10px;
  background: #e8e2d7;
  color: #1d1c1a;

  &::-webkit-progress-bar { background: #e8e2d7; }
  &::-webkit-progress-value { background: #1d1c1a; }
  &::-moz-progress-bar { background: #1d1c1a; }
`;

export const ReservationButton = styled.button`
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  border: 0;
  border-radius: 11px;
  background: #1d1c1a;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  transition: background-color 0.2s ease;

  &:hover { background: #3b3832; }
`;

export const ReservationNotice = styled.p`
  margin: 14px 0 0;
  color: #6b665d;
  font-size: 14px;
  line-height: 1.7;
`;

export const LowerSection = styled.section`
  margin-top: 52px;
`;

export const ThreeColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 850px) { grid-template-columns: 1fr; }
`;

export const StyleCard = styled.article<{ $unavailable: boolean }>`
  min-height: 148px;
  padding: 20px;
  border: 1px solid ${({ $unavailable }) => ($unavailable ? "#ece7df" : "#dacebd")};
  border-radius: 16px;
  color: ${({ $unavailable }) => ($unavailable ? "#999" : "#1d1c1a")};
`;

export const StyleTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

export const StylePrice = styled.span`
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
`;

export const StyleDescription = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
`;

export const UnavailableNote = styled.p`
  margin: 8px 0 0;
  color: #a9604c;
  font-size: 12px;
`;

export const OtherTheme = styled.a<{ $color: string }>`
  min-height: 126px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  padding: 16px 20px;
  border-radius: 15px;
  background: ${({ $color }) => $color};
  color: #fff;
  text-decoration: none;
  transition: filter 0.2s ease;

  &:hover { filter: brightness(1.1); }
`;

export const OtherThemeTitle = styled.h3`
  margin: 0;
  font: 600 28px "Cormorant Garamond", serif;
`;

export const OtherThemeDescription = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
`;
