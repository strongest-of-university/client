import styled from "styled-components";
import { Input as AuthInput, SubmitButton as AuthSubmitButton } from "../login/LoginPage.styles";

export const Input = styled(AuthInput)`
  &[aria-invalid="true"] { border-color: #b43d16; }
`;

export const Feedback = styled.p<{ $valid: boolean }>`
  margin: 0;
  color: ${({ $valid }) => ($valid ? "#2d583b" : "#b43d16")};
  font-size: 12px;
  line-height: 1.6;

  &:empty { display: none; }
`;

export const HelpText = styled.p`
  margin: 0;
  color: #6b665d;
  font-size: 12px;
  line-height: 1.7;
  word-break: keep-all;
`;

export const SubmitButton = styled(AuthSubmitButton)`
  &:disabled {
    background: #d9d9d9;
    color: #777;
    cursor: not-allowed;
  }
`;
