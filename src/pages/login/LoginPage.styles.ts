import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: #fff;
  color: #1d1c1a;
`;

export const Header = styled.header`
  min-height: 80px;
  padding: 20px clamp(24px, 2.8vw, 44px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: #000;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }
`;

export const Brand = styled.a`
  color: #fffdf8;
  text-decoration: none;
  font: 700 24px "Noto Serif KR", serif;
  white-space: nowrap;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: clamp(20px, 2.5vw, 44px);
`;

export const NavLink = styled.a`
  color: #fffdf8;
  text-decoration: none;
  font: 600 clamp(14px, 1.1vw, 17px) "Cormorant Garamond", serif;
  letter-spacing: 0.14em;

  &:hover { text-decoration: underline; text-underline-offset: 6px; }
  &:focus-visible { outline: 2px solid #fffdf8; outline-offset: 6px; }
`;

export const Main = styled.main`
  width: min(400px, calc(100% - 48px));
  margin: 0 auto;
  padding: clamp(56px, 6vw, 108px) 0 56px;
`;

export const ReservationNotice = styled.p`
  margin: 0 0 28px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #efe9dd;
  color: #1d1c1a;
  font-size: 14px;
  line-height: 1.7;
  word-break: keep-all;
`;

export const Title = styled.h1`
  margin: 0 0 26px;
  font: 700 30px "Noto Serif KR", serif;
  line-height: 1.5;
  letter-spacing: -0.04em;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  color: #6b665d;
  font-size: 14px;
`;

export const Input = styled.input`
  width: 100%;
  min-height: 52px;
  padding: 12px 16px;
  border: 1px solid #dfd4c4;
  border-radius: 11px;
  background: #fffdf9;
  color: #1d1c1a;
  font: inherit;
  font-size: 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-visible {
    outline: none;
    border-color: #88745a;
    box-shadow: 0 0 0 3px rgba(136, 116, 90, 0.15);
  }

  &:autofill,
  &:-webkit-autofill {
    -webkit-text-fill-color: #1d1c1a;
    caret-color: #1d1c1a;
    box-shadow: inset 0 0 0 1000px #fffdf9;
  }

  &:autofill:focus-visible,
  &:-webkit-autofill:focus-visible {
    box-shadow:
      inset 0 0 0 1000px #fffdf9,
      0 0 0 3px rgba(136, 116, 90, 0.15);
  }
`;

export const SubmitButton = styled.button`
  min-height: 54px;
  margin-top: 10px;
  border: 0;
  border-radius: 12px;
  background: #1d1c1a;
  color: #fffdf8;
  font-size: 16px;
  font-weight: 700;
  transition: background-color 0.2s ease;

  &:hover { background: #39352f; }
  &:focus-visible { outline: 2px solid #88745a; outline-offset: 4px; }
`;

export const SignupPrompt = styled.p`
  margin: 20px 0 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 10px;
  color: #6b665d;
  font-size: 14px;
`;

export const SignupButton = styled.button`
  padding: 0;
  border: 0;
  background: none;
  color: #1d1c1a;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:focus-visible { outline: 2px solid #88745a; outline-offset: 4px; }
`;

export const Message = styled.p`
  margin: 20px 0 0;
  color: #6b665d;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;

  &:empty { display: none; }
`;
