import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.55);
`;

export const Dialog = styled.div`
  width: min(480px, 100%);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border-radius: 16px;
  background: #fff;
  color: #1d1c1a;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px 16px;
`;

export const Title = styled.h2`
  margin: 0;
  font: 700 22px "Noto Serif KR", serif;
`;

export const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: #f2eee7;
  color: #1d1c1a;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;

  &:focus-visible { outline: 2px solid #88745a; outline-offset: 3px; }
`;

export const Content = styled.div`
  padding: 0 24px 24px;
  line-height: 1.7;
`;
