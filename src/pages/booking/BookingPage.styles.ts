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
  background: #fff;
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

  ${({ $active }) => $active && css`background: #fffdf8;`}

  ${({ $complete }) => $complete && css`
    > span:first-child {
      border-color: #1d1c1a;
      color: #fff;
      background: #1d1c1a;
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
  border: 1px solid #1d1c1a;
  color: #1d1c1a;
  background: #fff;
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
  background: #fff;

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
  border: 1px solid ${({ $selected }) => $selected ? "#1d1c1a" : "#e5e1db"};
  border-radius: 4px;
  color: ${({ $selected }) => $selected ? "#fff" : "#1d1c1a"};
  background: ${({ $selected }) => $selected ? "#1d1c1a" : "#fff"};
  box-shadow: 0 3px 10px rgba(35, 29, 23, 0.06);
  text-align: left;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(35, 29, 23, 0.1);
  }

  &:focus-visible { outline: 2px solid ${({ $color }) => $color}; outline-offset: 2px; }

  svg { margin-bottom: 14px; color: ${({ $selected, $color }) => $selected ? "#fff" : $color}; font-size: 23px; }
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
  border: 1px solid ${({ $selected }) => $selected ? "#1d1c1a" : "#e3dfd8"};
  border-radius: 5px;
  color: ${({ $selected }) => $selected ? "#fff" : "#1d1c1a"};
  background: ${({ $selected }) => $selected ? "#1d1c1a" : "#fff"};
  text-align: left;

  strong { font-size: 13px; }
  span { color: ${({ $selected }) => $selected ? "#ddd8d1" : "#756e66"}; font-size: 10px; }
  &:focus-visible { outline: 2px solid #1d1c1a; outline-offset: 2px; }
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
    background: #fff;
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
  border: 1px solid ${({ $selected }) => $selected ? "#1d1c1a" : "#e3dfd8"};
  border-radius: 5px;
  color: ${({ $selected }) => $selected ? "#fff" : "#1d1c1a"};
  background: ${({ $selected }) => $selected ? "#1d1c1a" : "#fff"};
  text-align: left;

  strong { font-size: 13px; }
  span { color: ${({ $selected }) => $selected ? "#ddd8d1" : "#756e66"}; font-size: 10px; }
  small { color: #a63d24; font-size: 9px; font-weight: 700; }
  &:disabled { color: #aaa49e; background: #f7f7f6; cursor: not-allowed; }
  &:disabled small { color: #a63d24; }
  &:focus-visible { outline: 2px solid #1d1c1a; outline-offset: 2px; }
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
  border: 1px solid ${({ $selected }) => $selected ? "#1d1c1a" : "#d9d1c7"};
  border-radius: 5px;
  color: ${({ $selected }) => $selected ? "#fff" : "#1d1c1a"};
  background: ${({ $selected }) => $selected ? "#1d1c1a" : "#fff"};
  text-align: left;
  transition: color 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;

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
    border-color: #1d1c1a;
  }

  &:disabled {
    border-color: #dedbd6;
    color: #aaa59e;
    background: #f3f3f2;
    cursor: not-allowed;
  }

  &:disabled span { color: #c1bbb3; }
  &:focus-visible { outline: 2px solid #1d1c1a; outline-offset: 2px; }

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
  grid-template-columns: auto 1fr auto;
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
  background: #fff;

  @media (max-width: 820px) {
    position: static;
    grid-row: 1;
  }
`;

export const SummaryBadge = styled.span`
  display: inline-block;
  margin-bottom: 17px;
  padding: 6px 10px;
  border-radius: 999px;
  color: #4d4842;
  background: #f1eee8;
  font-size: 9px;
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
  color: #fff;
  background: #1d1c1a;
  font-size: 12px;
  font-weight: 700;

  &:disabled { color: #898581; background: #dddddd; cursor: not-allowed; }
  &:focus-visible { outline: 2px solid #1d1c1a; outline-offset: 2px; }
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
