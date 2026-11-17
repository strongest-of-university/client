import styled from "styled-components";

export const FooterContainer = styled.footer`
  padding: 48px clamp(28px, 4.3vw, 82px);
  background: var(--color-text);
  color: #c7c0b4;
`;

export const FooterBrand = styled.h2`
  margin: 0 0 16px;
  color: var(--color-background);
  font: 700 20px "Noto Serif KR", serif;
`;

export const FooterText = styled.p`
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.5;
  word-break: keep-all;
`;

export const Copyright = styled.p`
  margin: 0;
  color: #aaa293;
  font-size: 13px;
  line-height: 1.5;
`;
