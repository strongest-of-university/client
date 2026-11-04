import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.55);
`;

export const Sheet = styled.div`
  width: 100%;
  max-height: min(80vh, 720px);
  overflow-y: auto;
  border-radius: 20px 20px 0 0;
  background: #fff;
  color: #1d1c1a;
  box-shadow: 0 -18px 60px rgba(0, 0, 0, 0.24);
`;

export const Handle = styled.div`
  width: 44px;
  height: 4px;
  margin: 10px auto 4px;
  border-radius: 999px;
  background: #d8d2c8;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 24px 16px;
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
  padding: 0 24px calc(28px + env(safe-area-inset-bottom));
  line-height: 1.7;
`;
