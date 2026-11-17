import styled from "styled-components";
export const Page = styled.div`min-height: 100vh; background: #f4f4f2;`;
export const Main = styled.main`width: min(910px, calc(100% - 48px)); margin: 0 auto; padding: 36px 0 80px; @media(max-width:600px){width:calc(100% - 28px);padding-top:20px;}`;
export const BackLink = styled.a`display:inline-block;padding:10px 0;color:#5f5a53;font-size:14px;text-decoration:none;&:hover{text-decoration:underline;}`;
export const Heading = styled.h1`margin:20px 0 8px;color:var(--color-text);font-size:clamp(26px,4vw,36px);`;
export const Description = styled.p`margin:0;color:var(--color-text-subtle);line-height:1.6;`;
export const Chat = styled.section`margin-top:30px;border:1px solid #e2dfda;border-radius:5px;background:var(--color-surface);overflow:hidden;`;
export const ChatHeader = styled.div`
  display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;
  gap: 8px 16px; padding: 20px 24px; border-bottom: 1px solid #eeeae4;
  > div { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; }
  strong { font-size: 16px; } span { font-size: 13px; color: var(--color-text-subtle); }
  button { min-height: 40px; padding: 0 12px; border: 1px solid #d7d3cc; border-radius: 4px; background: var(--color-surface); color: #514c46; font: inherit; font-size: 13px; cursor: pointer; }
  button:disabled { opacity: .5; cursor: not-allowed; }
  button:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
`;
export const Messages = styled.div`display:flex;flex-direction:column;gap:18px;height:360px;overflow-y:auto;padding:24px;background:#faf9f7;`;
export const MessageRow = styled.div<{ $user:boolean }>`display:flex;justify-content:${({$user})=>$user?"flex-end":"flex-start"};`;
export const Bubble = styled.div<{ $user:boolean }>`max-width:min(80%, 600px);padding:14px 16px;border-radius:12px;background:${({$user})=>$user?"var(--color-text-strong)":"var(--color-surface)"};color:${({$user})=>$user?"var(--color-surface)":"var(--color-text)"};border:1px solid ${({$user})=>$user?"var(--color-text-strong)":"#e9e5df"};small{font-size:12px;opacity:.8;}p{margin:6px 0 0;white-space:pre-wrap;line-height:1.6;overflow-wrap:anywhere;}`;
export const Waiting = styled.p`margin:0;color:var(--color-text-subtle);font-size:14px;`;
export const Products = styled.section`padding:20px 24px;border-top:1px solid #eeeae4;h2{margin:0 0 14px;font-size:16px;}`;
export const ProductList = styled.div`
  max-height: min(340px, 45vh);
  overflow-y: auto;
  overscroll-behavior-y: contain;
  scrollbar-gutter: stable;
  margin-bottom: 14px;
  padding-right: 8px;
  &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
`;
export const Product = styled.div`
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
  padding: 16px 0; border-top: 1px solid #f0eeea;
  button { flex: 0 0 auto; min-height: 44px; padding: 0 14px; border: 1px solid #333; background: var(--color-surface); cursor: pointer; font-weight: 700; }
  button:disabled { opacity: .5; cursor: not-allowed; }
  button:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  @media (max-width: 600px) { align-items: stretch; flex-direction: column; }
`;
export const ProductInfo = styled.div`display: grid; gap: 7px; min-width: 0;`;
export const ProductTitle = styled.div`
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
  strong { color: var(--color-text); font-size: 16px; }
  span { padding: 3px 8px; border-radius: 3px; background: #f2eee7; color: #62543f; font-size: 12px; font-weight: 700; }
`;
export const ProductDates = styled.span`color: var(--color-text-strong); font-size: 14px; line-height: 1.5;`;
export const ProductCapacity = styled.span`color: var(--color-text-subtle); font-size: 13px; line-height: 1.5;`;
export const AudioArea = styled.section`
  display: grid;
  gap: 16px;
  margin: 16px 24px;
  padding: 18px 20px;
  border: 1px solid #e9e5df;
  border-radius: 8px;
  background: #faf9f7;
  @media (max-width: 600px) { margin: 14px; padding: 16px; }
`;
export const AudioHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  > div { display: grid; gap: 3px; }
  strong { color: var(--color-text); font-size: 14px; }
  span { color: var(--color-text-subtle); font-size: 13px; }
`;
export const AudioIcon = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  border: 1px solid #e4ded5;
  border-radius: 50%;
  background: var(--color-surface);
  color: #6e5a44;
  font-size: 18px;
`;
export const AudioControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  audio { display: block; flex: 1 1 240px; min-width: 0; width: 100%; height: 44px; }
  @media (max-width: 600px) { flex-direction: column; align-items: stretch; audio { flex: none; } }
`;
export const AudioActions = styled.div`
  display: flex;
  gap: 8px;
  flex: 0 0 auto;
  button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 16px; border-radius: 4px; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
  button:disabled { opacity: .55; cursor: not-allowed; }
  button:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  @media (max-width: 600px) { button { flex: 1; } }
`;
export const AudioDiscard = styled.button`border: 1px solid #d7d3cc; background: var(--color-surface); color: #514c46; &:hover:not(:disabled) { background: #f2f0ed; }`;
export const AudioSend = styled.button`border: 1px solid var(--color-text); background: var(--color-text); color: var(--color-surface); &:hover:not(:disabled) { background: #44413c; }`;

export const Status = styled.p`margin:0;padding:12px 24px;color:#9b3030;font-size:14px;`;
export const Composer = styled.form`display:flex;gap:8px;padding:16px 24px 4px;border-top:1px solid #eeeae4;input{flex:1;min-width:0;padding:0 12px;border:1px solid #d7d3cc;font:inherit;}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}`;
export const RecordButton = styled.button`display:grid;place-items:center;width:48px;height:48px;flex:none;border:1px solid #d7d3cc;background:var(--color-surface);font-size:20px;cursor:pointer;&:disabled{opacity:.5;cursor:not-allowed;}`;
export const SendButton = styled(RecordButton)`background:var(--color-text);color:var(--color-surface);border-color:var(--color-text);`;
export const Hint = styled.p`margin:0;padding:8px 24px 16px;color:var(--color-text-subtle);font-size:12px;`;
export const Direct = styled.div`display:flex;flex-wrap:wrap;justify-content:center;gap:8px 20px;margin-top:26px;color:var(--color-text-subtle);font-size:14px;a{color:var(--color-text);font-weight:700;}`;

export const Suggestions = styled.div`
  box-sizing: border-box;
  height: 82px;
  padding: 14px 24px 4px;
  border-top: 1px solid #eeeae4;
  color: var(--color-text-subtle);
  font-size: 12px;
  > div { display: flex; gap: 8px; height: 40px; margin-top: 9px; overflow-x: auto; scrollbar-width: thin; }
  button { flex: 0 0 auto; min-height: 36px; height: 36px; padding: 0 12px; border: 1px solid #d7d3cc; border-radius: 18px; background: var(--color-surface); color: var(--color-text-strong); font: inherit; cursor: pointer; }
  button:hover { background: #f3eee5; }
  button:focus-visible { outline: 3px solid #a27c3f; outline-offset: 2px; }
  button:disabled { opacity: .5; cursor: not-allowed; }
  & + form { border-top: 0; }
`;

export const RetryForm = styled.form`
  display: grid;
  gap: 16px;
  padding: 20px 24px;
  border-top: 1px solid #eeeae4;
  background: var(--color-background);
  h2 { margin: 0 0 4px; color: var(--color-text); font-size: 16px; }
  p { margin: 0; color: var(--color-text-subtle); font-size: 13px; line-height: 1.5; }
`;
export const RetryFields = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 12px;
  label { display: grid; flex: 1 1 160px; gap: 6px; color: #4c4740; font-size: 13px; font-weight: 700; }
  input { box-sizing: border-box; width: 100%; min-height: 44px; padding: 8px 10px; border: 1px solid #c9c3ba; border-radius: 4px; background: var(--color-surface); color: var(--color-text); font: inherit; }
  button { min-height: 44px; padding: 0 20px; border: 0; border-radius: 4px; background: var(--color-text); color: var(--color-surface); font: inherit; font-weight: 700; cursor: pointer; }
  input:focus-visible, button:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  input:disabled, button:disabled { opacity: .55; cursor: not-allowed; }
  @media (max-width: 480px) { label { flex-basis: 100%; } button { width: 100%; } }
`;

export const ProductPrompt = styled.p`margin: -4px 0 14px; color: var(--color-text-subtle); font-size: 13px; line-height: 1.5;`;
export const OtherDateButton = styled.button`
  min-height: 44px; padding: 0 14px; border: 1px solid #d7d3cc; border-radius: 4px; background: var(--color-surface); color: #514c46; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer;
  &:disabled { opacity: .5; cursor: not-allowed; }
  &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
`;
export const OtherDateForm = styled.form`
  display: flex; flex-wrap: wrap; align-items: end; gap: 10px; padding: 14px; background: #faf9f7; border: 1px solid #eeeae4; border-radius: 4px;
  label { display: grid; flex: 1 1 180px; gap: 6px; font-size: 13px; font-weight: 700; }
  input { min-height: 44px; box-sizing: border-box; width: 100%; padding: 8px; border: 1px solid #c9c3ba; border-radius: 4px; background: var(--color-surface); font: inherit; }
  button { min-height: 44px; padding: 0 14px; border: 1px solid #333; border-radius: 4px; background: var(--color-surface); font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
  button[type="submit"] { background: var(--color-text); color: var(--color-surface); }
  button:disabled { opacity: .5; cursor: not-allowed; }
  input:focus-visible, button:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
`;
