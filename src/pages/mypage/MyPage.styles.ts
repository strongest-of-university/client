import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: var(--color-background);
`;

export const Main = styled.main`
  width: min(450px, calc(100% - 40px));
  margin: 0 auto;
  padding: 28px 0 64px;

  @media (max-width: 520px) {
    width: min(100% - 28px, 450px);
    padding-top: 24px;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-family: "Noto Serif KR", serif;
  font-size: 23px;
  line-height: 1.35;

  @media (max-width: 520px) {
    font-size: 21px;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
`;

export const MyPageTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 28px;
  border-bottom: 1px solid #d8cec0;
`;

export const MyPageTab = styled.button<{ $active: boolean }>`
  position: relative;
  min-height: 44px;
  padding: 10px 12px 12px;
  border: 0;
  color: ${({ $active }) => ($active ? "var(--color-text)" : "#8a837b")};
  background: transparent;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 800 : 600)};
  transition: color 0.2s ease, background 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    height: 2px;
    background: var(--color-text);
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transition: transform 0.25s ease;
  }

  &:hover {
    color: var(--color-text);
    background: rgba(29, 28, 26, 0.035);
  }

  &:focus-visible {
    z-index: 1;
    outline: 2px solid #786c5d;
    outline-offset: -2px;
  }
`;

export const ProfileEditButton = styled.button`
  width: 100%;
  min-height: 42px;
  margin-bottom: 4px;
  padding: 9px 14px;
  border: 1px solid var(--color-text);
  border-radius: 7px;
  color: var(--color-text);
  background: var(--color-background);
  font-size: 10px;
  font-weight: 700;

  &:hover:not(:disabled) { color: var(--color-surface); background: var(--color-text); }
  &:focus-visible { outline: 2px solid #786c5d; outline-offset: 2px; }
  &:disabled { opacity: 0.45; cursor: wait; }
`;

export const MoreReservationsButton = styled(ProfileEditButton)`
  margin: 22px 0 0;
`;

export const ProfileCard = styled.section`
  display: grid;
  gap: 8px;
  margin-bottom: 22px;
  padding: 13px 14px;
  border: 1px solid #ded5c8;
  border-radius: 11px;
  background: var(--color-surface);

  div {
    display: grid;
    grid-template-columns: 82px minmax(0, 1fr);
    gap: 12px;
    align-items: baseline;
  }

  span { color: #77716b; font-size: 9px; }
  strong { font-size: 10px; text-align: right; word-break: keep-all; }
`;

export const Year = styled.h2`
  margin: 0 0 10px;
  font-size: 17px;
  line-height: 1.4;
`;

export const Timeline = styled.ol`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const TimelineItem = styled.li`
  position: relative;
  padding: 0 0 0 18px;

  &::before {
    content: "";
    position: absolute;
    top: 5px;
    left: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-text);
  }

  &::after {
    content: "";
    position: absolute;
    top: 24px;
    bottom: -12px;
    left: 3px;
    width: 1px;
    background: #ded5c8;
  }

  &:last-child::after {
    bottom: 0;
  }
`;

export const Date = styled.h3`
  margin: 0 0 8px;
  font-size: 14px;
  line-height: 1.25;
`;

export const Card = styled.article`
  padding: 14px;
  border: 1px solid #ded5c8;
  border-radius: 12px;
  background: var(--color-surface);
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-bottom: 13px;
`;

export const Status = styled.strong`
  font-size: 13px;
`;

export const ReservationNumber = styled.span`
  color: #77716b;
  font-size: 9px;
`;

export const TourTitle = styled.h4`
  margin: 0 0 2px;
  font-size: 13px;
  line-height: 1.35;
  text-decoration: underline;
  text-underline-offset: 2px;
`;

export const Summary = styled.p`
  margin: 0 0 12px;
  color: #746f69;
  font-size: 10px;
  line-height: 1.4;
`;

export const OptionButton = styled.button<{ $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 38px;
  padding: 10px 12px;
  border: 0;
  border-radius: 8px;
  color: var(--color-text);
  background: #f6f6f6;
  font-size: 10px;
  text-align: left;

  svg {
    flex: none;
    color: #6a7b90;
    font-size: 15px;
    transform: rotate(${({ $open }) => ($open ? "180deg" : "0")});
    transition: transform 0.25s ease;
  }

  &:hover {
    background: #eeeeec;
  }

  &:focus-visible {
    outline: 2px solid var(--color-text);
    outline-offset: 2px;
  }

  @media (max-width: 520px) {
    gap: 8px;
    font-size: 9px;
  }
`;

export const DetailPanel = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: grid-template-rows 0.35s ease, opacity 0.25s ease;
`;

export const DetailInner = styled.div`
  overflow: hidden;
`;

export const DetailTitle = styled.h5`
  margin: 18px 0 12px;
  padding-top: 16px;
  border-top: 1px solid #e9e3db;
  color: #1f1c19;
  font-size: 15px;
  line-height: 1.4;
`;

export const DetailList = styled.dl`
  display: grid;
  gap: 0;
  margin: 0 0 4px;
  overflow: hidden;
  border: 1px solid #e8e0d6;
  border-radius: 10px;
  background: #fbfaf8;

  div {
    display: grid;
    grid-template-columns: 116px minmax(0, 1fr);
    align-items: center;
    gap: 16px;
    min-height: 42px;
    padding: 9px 13px;
    border-bottom: 1px solid #eee8e0;

    &:last-child {
      min-height: 48px;
      border-bottom: 0;
      background: #f2eee7;
    }
  }

  dt {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #746d65;
    font-size: 11px;
    font-weight: 500;
    line-height: 1.45;

    svg {
      flex: 0 0 auto;
      width: 16px;
      height: 16px;
      color: #5f5549;
      stroke-width: 1.8;
    }
  }

  dd {
    margin: 0;
    color: #211e1a;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.45;
    text-align: right;
    overflow-wrap: anywhere;
  }

  div:last-child dd {
    font-size: 14px;
    font-weight: 800;
  }

  div:last-child dt svg {
    color: #26221e;
  }

  @media (max-width: 420px) {
    div {
      grid-template-columns: 100px minmax(0, 1fr);
      gap: 10px;
      padding-inline: 11px;
    }
  }
`;

export const CancelButton = styled.button`
  width: 100%;
  min-height: 38px;
  margin-top: 11px;
  border: 0;
  border-radius: 7px;
  color: var(--color-surface);
  background: var(--color-text);
  font-size: 11px;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: var(--color-text-strong);
  }

  &:focus-visible {
    outline: 2px solid #786c5d;
    outline-offset: 2px;
  }

  &:disabled {
    color: #8c8985;
    background: #dedede;
    cursor: not-allowed;
  }
`;

export const Note = styled.p`
  margin: 7px 0 0;
  color: #66615b;
  font-size: 8px;
  line-height: 1.45;
`;

export const LiveMessage = styled.p`
  min-height: 18px;
  margin: 14px 0 0 18px;
  color: #6c6258;
  font-size: 11px;

  &:empty {
    margin-top: 0;
    min-height: 0;
  }
`;

export const ProfileForm = styled.form`
  display: grid;
  gap: 14px;
`;

export const ProfileField = styled.div`
  display: grid;
  gap: 6px;

  label {
    color: #655f58;
    font-size: 12px;
    font-weight: 700;
  }

  input {
    width: 100%;
    min-height: 48px;
    padding: 11px 13px;
    border: 1px solid #ddd1c1;
    border-radius: 9px;
    color: var(--color-text);
    background: var(--color-background);
    font: inherit;
    font-size: 14px;
  }

  input:focus-visible {
    outline: 2px solid #8a765c;
    outline-offset: 2px;
  }
`;

export const ProfileFormMessage = styled.p`
  margin: -2px 0 0;
  color: #ad3d20;
  font-size: 11px;
  line-height: 1.5;

  &:empty { display: none; }
`;

export const ProfileActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 4px;
`;

export const CancelSummary = styled.p`
  margin: 0 0 20px;
  color: #282521;
  font-size: 14px;
  line-height: 1.65;
  word-break: keep-all;
`;

export const RefundBox = styled.div`
  padding: 14px 16px;
  border-radius: 14px;
  background: #f3eee5;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 3px 0;
  }

  span { color: #6f6860; font-size: 14px; }
  strong { font-size: 15px; }
  .fee { color: #ad3d20; }

  .refund {
    margin-top: 7px;
    padding-top: 9px;
    border-top: 1px solid #dcd2c5;

    span, strong {
      color: var(--color-text);
      font-weight: 700;
    }
  }
`;

export const CancellationRule = styled.p`
  margin: 18px 0;
  color: #766e66;
  font-size: 12px;
`;

export const CancelActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 440px) { grid-template-columns: 1fr; }
`;

export const BackButton = styled.button`
  min-height: 54px;
  border: 1px solid #ddd1c1;
  border-radius: 12px;
  color: var(--color-text);
  background: var(--color-background);
  font-size: 15px;
  font-weight: 700;
`;

export const ConfirmCancelButton = styled(BackButton)`
  border-color: #aa3c20;
  color: var(--color-surface);
  background: #aa3c20;

  &:hover { background: #8f3018; }
`;

export const SaveProfileButton = styled(BackButton)`
  border-color: var(--color-text);
  color: var(--color-surface);
  background: var(--color-text);

  &:hover:not(:disabled) { background: #39352f; }
  &:disabled { opacity: 0.55; cursor: wait; }
`;
