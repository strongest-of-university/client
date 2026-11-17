import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  color: var(--color-text);
  background: var(--color-surface);
`;

export const Main = styled.main`
  width: min(1080px, calc(100% - 64px));
  margin: 0 auto;
  padding: 52px 0 80px;

  @media (max-width: 680px) {
    width: min(100% - 28px, 1080px);
    padding-top: 38px;
  }
`;

export const Eyebrow = styled.p`
  margin: 0 0 7px;
  font: 600 14px "Cormorant Garamond", serif;
  letter-spacing: 0.24em;
`;

export const Title = styled.h1`
  margin: 0 0 9px;
  font: 700 30px "Noto Serif KR", serif;
`;

export const Description = styled.p`
  margin: 0 0 34px;
  color: #504a44;
  font-size: 12px;
`;

export const MessageList = styled.section`
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-surface);
`;

export const MessageRow = styled.article`
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  gap: 20px;
  min-height: 96px;
  padding: 19px 24px;
  border-bottom: 1px solid #e7e0d7;

  &:last-child { border-bottom: 0; }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 18px;
  }
`;

export const Meta = styled.div`
  display: grid;
  align-content: start;
  justify-items: start;
  gap: 10px;

  time {
    font-size: 12px;
    font-weight: 600;
  }
`;

export const Type = styled.span`
  padding: 6px 10px;
  border-radius: 999px;
  background: #f3f3f2;
  font-size: 10px;
  font-weight: 700;
`;

export const MessageContent = styled.div`
  display: grid;
  align-content: start;
  gap: 7px;

  strong { font-size: 12px; }

  p {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
    word-break: keep-all;
  }
`;
