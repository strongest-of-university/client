import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: var(--color-surface);
  color: var(--color-text);
`;

export const Main = styled.main`
  width: min(400px, calc(100% - 48px));
  margin: 0 auto;
  padding: clamp(56px, 6vw, 108px) 0 56px;
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
  color: var(--color-text-muted);
  font-size: 14px;
`;

export const Input = styled.input`
  width: 100%;
  min-height: 52px;
  padding: 12px 16px;
  border: 1px solid #dfd4c4;
  border-radius: 11px;
  background: #fffdf9;
  color: var(--color-text);
  font: inherit;
  font-size: 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-visible {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(136, 116, 90, 0.15);
  }

  &:autofill,
  &:-webkit-autofill {
    -webkit-text-fill-color: var(--color-text);
    caret-color: var(--color-text);
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
  background: var(--color-text);
  color: var(--color-background);
  font-size: 16px;
  font-weight: 700;
  transition: background-color 0.2s ease;

  &:hover { background: #39352f; }
  &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 4px; }
  &:disabled { background: #aaa49b; cursor: wait; }
`;

export const Message = styled.p`
  margin: 20px 0 0;
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.6;
  text-align: center;

  &:empty { display: none; }
`;

export const ReservationNotice = styled.p`
  margin: 0 0 28px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #efe9dd;
  color: var(--color-text);
  font-size: 14px;
  line-height: 1.7;
  word-break: keep-all;
`;

export const SignupPrompt = styled.p`
  margin: 20px 0 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 10px;
  color: var(--color-text-muted);
  font-size: 14px;
`;

export const SignupButton = styled.a`
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-text);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 4px; }
`;

export const StaffHint = styled.p`
  margin: 24px 0 0;
  color: #817970;
  font-size: 12px;
  line-height: 1.6;
  text-align: center;

  strong { color: var(--color-text); }
`;
