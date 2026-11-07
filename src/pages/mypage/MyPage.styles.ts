import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: #fffdf8;
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
  margin: 0 0 20px;
  font-family: "Noto Serif KR", serif;
  font-size: 23px;
  line-height: 1.35;

  @media (max-width: 520px) {
    font-size: 21px;
  }
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
    background: #1d1c1a;
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
  background: #fff;
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
  color: #1d1c1a;
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
    outline: 2px solid #1d1c1a;
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
  margin: 14px 0 9px;
  padding-top: 13px;
  border-top: 1px solid #e9e3db;
  font-size: 12px;
`;

export const DetailList = styled.dl`
  display: grid;
  gap: 7px;
  margin: 0 0 2px;

  div {
    display: grid;
    grid-template-columns: 70px minmax(0, 1fr);
    gap: 10px;
  }

  dt {
    color: #77716b;
    font-size: 9px;
  }

  dd {
    margin: 0;
    color: #282521;
    font-size: 10px;
    font-weight: 600;
    text-align: right;
  }
`;

export const CancelButton = styled.button`
  width: 100%;
  min-height: 38px;
  margin-top: 11px;
  border: 0;
  border-radius: 7px;
  color: #fff;
  background: #1d1c1a;
  font-size: 11px;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: #33312e;
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
      color: #1d1c1a;
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
  color: #1d1c1a;
  background: #fffdf8;
  font-size: 15px;
  font-weight: 700;
`;

export const ConfirmCancelButton = styled(BackButton)`
  border-color: #aa3c20;
  color: #fff;
  background: #aa3c20;

  &:hover { background: #8f3018; }
`;
