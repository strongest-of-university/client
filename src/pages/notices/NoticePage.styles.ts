import styled from "styled-components";
import { Page as BasePage } from "../themes/ThemeDetailPage.styles";

export const Page = styled(BasePage)`
  display: flex;
  flex-direction: column;
`;

export const Main = styled.main`
  width: 100%;
  max-width: 1000px;
  flex: 1;
  margin: 0 auto;
  padding: 64px 24px 80px;
`;

export const Eyebrow = styled.p`
  margin: 0 0 16px;
  font: 500 26px "Cormorant Garamond", serif;
`;

export const ArticleHeader = styled.header`
  padding-bottom: 24px;
  border-bottom: 1px solid #1d1c1a;
`;

export const Title = styled.h1`
  margin: 0 0 16px;
  font: 700 clamp(22px, 3vw, 30px) "Noto Sans KR", sans-serif;
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const Metadata = styled.p`
  margin: 0;
  color: #6b665d;
  font-size: 14px;
`;

export const Body = styled.div`
  min-height: 200px;
  padding: 32px 0 44px;
  font-size: 16px;
  line-height: 2;
  word-break: keep-all;
  overflow-wrap: anywhere;

  p { margin: 0 0 24px; }
  p:last-child { margin-bottom: 0; }
`;

export const ArticleNavigation = styled.nav`
  border-top: 1px solid #1d1c1a;
  font-size: 15px;
  line-height: 1.7;
`;

export const NavigationRow = styled.div`
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid #e8e0d5;

  @media (max-width: 600px) { grid-template-columns: 64px minmax(0, 1fr); }
`;

export const ArticleLink = styled.a`
  color: inherit;
  text-decoration: none;
  overflow-wrap: anywhere;

  &:hover { text-decoration: underline; text-underline-offset: 4px; }
`;
