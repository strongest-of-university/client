import styled, { css } from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: #f4f4f2;
`;

export const StepNav = styled.ol`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  width: min(910px, calc(100% - 64px));
  margin: 22px auto 20px;
  padding: 0;
  overflow: hidden;
  border: 1px solid #e2dfda;
  border-radius: 4px;
  background: var(--color-surface);
  list-style: none;

  @media (max-width: 760px) {
    grid-template-columns: repeat(3, 1fr);
    width: min(100% - 28px, 910px);
  }
`;

export const Step = styled.li<{ $active: boolean; $complete: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 20px 16px;
  border-right: 1px solid #e8e5e0;

  &:last-child { border-right: 0; }

  ${({ $active }) => $active && css`background: var(--color-background);`}

  ${({ $complete }) => $complete && css`
    > span:first-child {
      border-color: var(--color-text);
      color: var(--color-surface);
      background: var(--color-text);
    }
  `}

  span {
    display: grid;
    min-width: 0;
  }

  strong {
    font-size: 12px;
    white-space: nowrap;
  }

  small {
    overflow: hidden;
    color: #746d65;
    font-size: 9px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ${({ $complete }) => $complete && css`
    small { color: #6e5a35; }
  `}

  @media (max-width: 760px) {
    padding: 12px 10px;
    &:nth-child(3) { border-right: 0; }
    &:nth-child(-n + 3) { border-bottom: 1px solid #e8e5e0; }
  }
`;

export const StepNumber = styled.span`
  display: grid !important;
  place-items: center;
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--color-text);
  color: var(--color-text);
  background: var(--color-surface);
  font-size: 12px;
  font-weight: 700;
`;

export const BookingForm = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 670px) 220px;
  align-items: start;
  gap: 20px;
  width: min(910px, calc(100% - 64px));
  margin: 0 auto;
  padding-bottom: 70px;

  @media (max-width: 820px) {
    grid-template-columns: minmax(0, 1fr);
    width: min(100% - 28px, 670px);
  }
`;

export const Content = styled.div`
  display: grid;
  gap: 18px;
`;

export const Section = styled.section`
  padding: 22px;
  border: 1px solid #e3e0db;
  border-radius: 5px;
  background: var(--color-surface);

  @media (max-width: 520px) { padding: 18px 14px; }
`;

export const SectionTitle = styled.h2`
  margin: 0 0 3px;
  font-size: 18px;
  line-height: 1.35;
`;

export const SectionDescription = styled.p`
  margin: 0 0 18px;
  color: #756e66;
  font-size: 11px;
  line-height: 1.5;
`;

export const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;

export const ThemeCard = styled.button<{ $selected: boolean; $color: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 150px;
  padding: 22px 16px;
  border: 1px solid ${({ $selected }) => $selected ? "var(--color-text)" : "#e5e1db"};
  border-radius: 4px;
  color: ${({ $selected }) => $selected ? "var(--color-surface)" : "var(--color-text)"};
  background: ${({ $selected }) => $selected ? "var(--color-text)" : "var(--color-surface)"};
  box-shadow: 0 3px 10px rgba(35, 29, 23, 0.06);
  text-align: left;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(35, 29, 23, 0.1);
  }

  &:focus-visible { outline: 2px solid ${({ $color }) => $color}; outline-offset: 2px; }

  svg { margin-bottom: 14px; color: ${({ $selected, $color }) => $selected ? "var(--color-surface)" : $color}; font-size: 23px; }
  strong { margin-bottom: 12px; font-size: 15px; }
  span { color: ${({ $selected }) => $selected ? "#ddd8d1" : "#756e66"}; font-size: 9px; line-height: 1.55; }
`;

export const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

export const ChoiceCard = styled.button<{ $selected: boolean }>`
  display: grid;
  gap: 7px;
  min-height: 76px;
  padding: 15px;
  border: 1px solid ${({ $selected }) => $selected ? "var(--color-text)" : "#e3dfd8"};
  border-radius: 5px;
  color: ${({ $selected }) => $selected ? "var(--color-surface)" : "var(--color-text)"};
  background: ${({ $selected }) => $selected ? "var(--color-text)" : "var(--color-surface)"};
  box-shadow: 0 3px 10px rgba(35, 29, 23, 0.04);
  text-align: left;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  strong { font-size: 13px; }
  span { color: ${({ $selected }) => $selected ? "#ddd8d1" : "#756e66"}; font-size: 10px; }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(35, 29, 23, 0.1);
  }
  &:focus-visible { outline: 2px solid var(--color-text); outline-offset: 2px; }
`;

export const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 44px;
  border: 1px dashed #ded9d1;
  color: #756e66;
  font-size: 10px;
`;

export const PeopleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
`;

export const Counter = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  button {
    width: 32px;
    height: 32px;
    border: 1px solid #807a73;
    border-radius: 3px;
    background: var(--color-surface);
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }
`;

export const GradeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

export const GradeCard = styled.button<{ $selected: boolean }>`
  display: grid;
  gap: 8px;
  min-height: 72px;
  padding: 15px;
  border: 1px solid ${({ $selected }) => $selected ? "var(--color-text)" : "#e3dfd8"};
  border-radius: 5px;
  color: ${({ $selected }) => $selected ? "var(--color-surface)" : "var(--color-text)"};
  background: ${({ $selected }) => $selected ? "var(--color-text)" : "var(--color-surface)"};
  box-shadow: 0 3px 10px rgba(35, 29, 23, 0.04);
  text-align: left;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  strong { font-size: 13px; }
  span { color: ${({ $selected }) => $selected ? "#ddd8d1" : "#756e66"}; font-size: 10px; }
  small { color: #a63d24; font-size: 9px; font-weight: 700; }
  &:disabled { color: #aaa49e; background: #f7f7f6; cursor: not-allowed; }
  &:disabled small { color: #a63d24; }
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(35, 29, 23, 0.1);
  }
  &:focus-visible { outline: 2px solid var(--color-text); outline-offset: 2px; }
`;

export const HelpText = styled.p`
  margin: 15px 0 0;
  color: #a63d24;
  font-size: 10px;
`;

export const OptionRows = styled.div`
  display: grid;
`;

export const OptionRow = styled.div`
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  min-height: 104px;
  padding: 18px 0;
  border-bottom: 1px solid #e7e3dd;

  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const OptionLabel = styled.h3`
  margin: 0;
  font-size: 15px;
  line-height: 1.4;
`;

export const OptionChoices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
`;

export const OptionButton = styled.button<{ $selected: boolean }>`
  display: grid;
  gap: 4px;
  min-width: 128px;
  min-height: 64px;
  padding: 11px 16px;
  border: 1px solid ${({ $selected }) => $selected ? "var(--color-text)" : "#d9d1c7"};
  border-radius: 5px;
  color: ${({ $selected }) => $selected ? "var(--color-surface)" : "var(--color-text)"};
  background: ${({ $selected }) => $selected ? "var(--color-text)" : "var(--color-surface)"};
  box-shadow: 0 3px 10px rgba(35, 29, 23, 0.04);
  text-align: left;
  transition: color 0.18s ease, background-color 0.18s ease, border-color 0.18s ease, transform 0.2s ease, box-shadow 0.2s ease;

  strong {
    font-size: 13px;
    line-height: 1.3;
  }

  span {
    color: ${({ $selected }) => $selected ? "#ddd7cf" : "#6f6962"};
    font-size: 10px;
    line-height: 1.3;
  }

  &:hover:not(:disabled) {
    border-color: var(--color-text);
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(35, 29, 23, 0.1);
  }

  &:disabled {
    border-color: #dedbd6;
    color: #aaa59e;
    background: #f3f3f2;
    cursor: not-allowed;
  }

  &:disabled span { color: #c1bbb3; }
  &:focus-visible { outline: 2px solid var(--color-text); outline-offset: 2px; }

  @media (max-width: 480px) {
    flex: 1 1 130px;
  }
`;

export const AllAgreement = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 9px;
  font-size: 11px;
  font-weight: 700;
`;

export const AgreementList = styled.div`
  overflow: hidden;
  border: 1px solid #e3dfd8;
  border-radius: 4px;
`;

export const Agreement = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 9px;
  min-height: 39px;
  padding: 0 12px;
  border-bottom: 1px solid #eeeae5;
  font-size: 10px;

  &:last-child { border-bottom: 0; }
  svg { font-size: 12px; }
`;

export const Summary = styled.aside`
  position: sticky;
  top: 78px;
  padding: 22px;
  border: 1px solid #e3e0db;
  border-radius: 5px;
  background: var(--color-surface);

  @media (max-width: 820px) {
    position: static;
    grid-row: 1;
  }
`;

export const SummaryTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 20px;
  line-height: 1.35;
`;

export const SummaryList = styled.dl`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0 0 18px;

  div { display: flex; justify-content: space-between; gap: 12px; }
  dt { color: #716b64; font-size: 10px; }
  dd { margin: 0; font-size: 10px; font-weight: 700; text-align: right; }
`;

export const PriceList = styled(SummaryList)`
  padding: 18px 0;
  border-top: 1px solid #e7e2db;
  border-bottom: 1px solid #e7e2db;

  div:last-child {
    display: grid;
    gap: 8px;
    justify-items: end;
    margin-top: 4px;
  }

  div:last-child dd { font-size: 15px; }
`;

export const SubmitButton = styled.button`
  width: 100%;
  min-height: 47px;
  margin-top: 18px;
  border: 0;
  border-radius: 4px;
  color: var(--color-surface);
  background: var(--color-text);
  font-size: 12px;
  font-weight: 700;

  &:disabled { color: #898581; background: #dddddd; cursor: not-allowed; }
  &:focus-visible { outline: 2px solid var(--color-text); outline-offset: 2px; }
`;

export const SummaryHint = styled.p`
  margin: 10px 0 0;
  color: #746e67;
  font-size: 8px;
  text-align: center;
`;

export const SubmitMessage = styled.p`
  margin: 12px 0 0;
  color: #315d3e;
  font-size: 9px;
  line-height: 1.5;
  text-align: center;

  &:empty { display: none; }
`;

export const LoadingBackdrop = styled.div`
  position: fixed;
  z-index: 1100;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.38);
`;

export const LoadingDialog = styled.div`
  display: grid;
  place-items: center;
  gap: 25px;
  width: min(322px, 100%);
  min-height: 184px;
  padding: 32px;
  border-radius: 24px;
  background: var(--color-surface);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);

  strong {
    font-size: 17px;
    text-align: center;
  }
`;

export const Spinner = styled.span`
  width: 60px;
  height: 60px;
  border: 4px solid #e5e2dc;
  border-bottom-color: var(--color-text);
  border-radius: 50%;
  animation: payment-spin 0.85s linear infinite;

  @keyframes payment-spin {
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1.8s;
  }
`;

export const CompletionBackdrop = styled(LoadingBackdrop)`
  z-index: 1150;
`;

export const CompletionDialog = styled.div`
  display: grid;
  justify-items: center;
  width: min(550px, 100%);
  padding: 44px 34px 34px;
  border-radius: 22px;
  background: var(--color-background);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.25);
`;

export const CheckCircle = styled.span`
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  border: 2px solid var(--color-text);
  border-radius: 50%;

  svg {
    width: 38px;
    height: 38px;
    stroke-width: 1.8;
  }
`;

export const CompletionTitle = styled.h2`
  margin: 18px 0 28px;
  font: 700 27px "Noto Serif KR", serif;
  text-align: center;
`;

export const CompletionActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;

  @media (max-width: 440px) { grid-template-columns: 1fr; }
`;

export const HomeButton = styled.button`
  min-height: 58px;
  border: 1px solid #ded1c0;
  border-radius: 12px;
  color: var(--color-text);
  background: transparent;
  font-size: 16px;
`;

export const HistoryButton = styled(HomeButton)`
  border-color: var(--color-text);
  color: var(--color-surface);
  background: var(--color-text);
  font-weight: 700;
`;

export const PaymentDescription = styled.p`
  margin: 0 0 22px;
  color: #393531;
  font-size: 15px;
`;

export const PaymentFields = styled.div`
  display: grid;
  gap: 15px;
`;

export const PaymentField = styled.div`
  display: grid;
  gap: 7px;

  label {
    font-size: 13px;
    font-weight: 700;
  }

  input {
    width: 100%;
    height: 58px;
    padding: 0 15px;
    border: 1px solid #ddd1c1;
    border-radius: 12px;
    color: var(--color-text);
    background: var(--color-surface);
    font: 500 17px "Noto Sans KR", sans-serif;
    outline: none;
  }

  input::placeholder { color: #8b8986; }
  input:focus { border-color: var(--color-text); box-shadow: 0 0 0 2px rgba(29, 28, 26, 0.08); }
`;

export const InstallmentSelect = styled.div`
  display: grid;
  gap: 6px;
`;

export const InstallmentTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 58px;
  padding: 0 15px;
  border: 1px solid #ddd1c1;
  border-radius: 12px;
  color: var(--color-text);
  background: var(--color-surface);
  font: 500 17px "Noto Sans KR", sans-serif;
  text-align: left;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover { border-color: #a89d90; }
  &:focus-visible { outline: 2px solid rgba(29, 28, 26, 0.18); outline-offset: 2px; }
`;

export const InstallmentList = styled.div`
  display: grid;
  overflow: hidden;
  border: 1px solid #ddd1c1;
  border-radius: 12px;
  background: var(--color-surface);
  box-shadow: 0 10px 24px rgba(35, 29, 23, 0.1);
  animation: installment-open 0.2s ease-out;

  @keyframes installment-open {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const InstallmentOption = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding: 0 15px;
  border: 0;
  border-bottom: 1px solid #eee9e2;
  color: ${({ $selected }) => $selected ? "var(--color-surface)" : "var(--color-text)"};
  background: ${({ $selected }) => $selected ? "var(--color-text)" : "var(--color-surface)"};
  font: 500 14px "Noto Sans KR", sans-serif;
  text-align: left;

  &:last-child { border-bottom: 0; }
  &:hover { color: var(--color-surface); background: var(--color-text); }
  &:focus-visible { position: relative; outline: 2px solid var(--color-accent); outline-offset: -3px; }
`;

export const PaymentFieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;

  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

export const CardInputWrap = styled.div`
  position: relative;

  input { padding-right: 120px; }
`;

export const SecurityInputWrap = styled(CardInputWrap)`
  input { padding-right: 50px; }

  svg {
    position: absolute;
    top: 50%;
    right: 15px;
    width: 28px;
    height: 28px;
    transform: translateY(-50%);
  }
`;

export const CardBrands = styled.span`
  position: absolute;
  top: 50%;
  right: 15px;
  display: flex;
  gap: 5px;
  transform: translateY(-50%);

  b {
    display: grid;
    place-items: center;
    min-width: 31px;
    height: 22px;
    padding: 0 5px;
    border-radius: 4px;
    color: var(--color-surface);
    background: #242476;
    font: 800 11px Arial, sans-serif;
  }

  b:nth-child(2) { background: #e5102b; }
  b:nth-child(3) { background: #171717; }
`;

export const PaymentTotal = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin: 22px -24px 0;
  padding: 20px 24px;
  border-top: 1px solid #e4dfd7;
  border-bottom: 1px solid #e4dfd7;
  background: var(--color-background);

  > strong { font-size: 16px; }

  span {
    display: grid;
    justify-items: end;
  }

  b { font-size: 24px; line-height: 1.25; }
  small { color: #6f6962; font-size: 11px; }
`;

export const PaymentActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 20px;
`;

export const PreviousButton = styled.button`
  min-width: 90px;
  height: 55px;
  border: 1px solid #ddd1c1;
  border-radius: 12px;
  color: var(--color-text);
  background: var(--color-surface);
  font-size: 16px;
`;

export const ConfirmPaymentButton = styled.button`
  min-width: 200px;
  height: 55px;
  border: 0;
  border-radius: 12px;
  color: var(--color-surface);
  background: var(--color-text);
  font-size: 15px;
  font-weight: 700;

  &:disabled {
    color: #8d8984;
    background: #dddddd;
    cursor: not-allowed;
  }

  @media (max-width: 440px) { min-width: 0; flex: 1; }
`;

export const AgreementDetailsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
`;

export const AgreementContent = styled.div`
  color: #514c46;
  font-size: 14px;
  line-height: 1.7;
  > p { margin: 0 0 20px; color: #756e66; font-size: 13px; }
  section + section { margin-top: 20px; }
  h3 { margin: 0 0 6px; color: var(--color-text); font-size: 15px; }
  section p { margin: 0; }
`;

export const AgreementCloseButton = styled.button`
  display: block;
  min-width: 120px;
  min-height: 44px;
  margin: 28px 0 0 auto;
  border: 0;
  border-radius: 4px;
  background: var(--color-text);
  color: var(--color-surface);
  font-weight: 700;
  cursor: pointer;
  &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }
`;
