import { FooterContainer, FooterBrand, FooterText, Copyright } from "./Footer.styles";

export default function Footer() {
  return (
    <FooterContainer>
      <FooterBrand>미스터 월드</FooterBrand>
      <FooterText>
        소프트웨어공학 프로젝트 · 과제팀 최강 · 김정묵 · 장은석 · 박종혁 · 지도교수 이병정
      </FooterText>
      <FooterText>문의 시간 09:00 ~ 21:00</FooterText>
      <Copyright>Copyright © 2026 Mr. World. All rights reserved.</Copyright>
    </FooterContainer>
  );
}
