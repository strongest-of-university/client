import styled from "styled-components";
export const Page = styled.div`min-height: 100vh; background: #f4f4f2;`;
export const Main = styled.main`width: min(910px, calc(100% - 48px)); margin: 0 auto; padding: 36px 0 80px; @media(max-width:600px){width:calc(100% - 28px);padding-top:20px;}`;
export const BackLink = styled.a`display:inline-block;padding:10px 0;color:#5f5a53;font-size:14px;text-decoration:none;&:hover{text-decoration:underline;}`;
export const Heading = styled.h1`margin:20px 0 8px;color:#1d1c1a;font-size:clamp(26px,4vw,36px);`;
export const Description = styled.p`margin:0;color:#625d56;line-height:1.6;`;
export const Chat = styled.section`margin-top:30px;border:1px solid #e2dfda;border-radius:5px;background:#fff;overflow:hidden;`;
export const ChatHeader = styled.div`display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;padding:20px 24px;border-bottom:1px solid #eeeae4;strong{font-size:16px;}span{font-size:13px;color:#625d56;}`;
export const Messages = styled.div`display:flex;flex-direction:column;gap:18px;height:360px;overflow-y:auto;padding:24px;background:#faf9f7;`;
export const MessageRow = styled.div<{ $user:boolean }>`display:flex;justify-content:${({$user})=>$user?"flex-end":"flex-start"};`;
export const Bubble = styled.div<{ $user:boolean }>`max-width:min(80%, 600px);padding:14px 16px;border-radius:12px;background:${({$user})=>$user?"#33312e":"#fff"};color:${({$user})=>$user?"#fff":"#1d1c1a"};border:1px solid ${({$user})=>$user?"#33312e":"#e9e5df"};small{font-size:12px;opacity:.8;}p{margin:6px 0 0;white-space:pre-wrap;line-height:1.6;overflow-wrap:anywhere;}`;
export const Waiting = styled.p`margin:0;color:#625d56;font-size:14px;`;
export const Products = styled.section`padding:20px 24px;border-top:1px solid #eeeae4;h2{margin:0 0 14px;font-size:16px;}`;
export const Product = styled.div`display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-top:1px solid #f0eeea;div{display:grid;gap:5px;}span{color:#625d56;font-size:13px;}button{min-height:44px;padding:0 14px;border:1px solid #333;background:#fff;cursor:pointer;font-weight:700;}button:disabled{opacity:.5;cursor:not-allowed;}`;
export const AudioArea = styled.div`display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:16px 24px;border-top:1px solid #eeeae4;font-size:14px;audio{width:min(100%,300px);}div{display:flex;gap:8px;}button{min-height:40px;padding:0 14px;cursor:pointer;}`;
export const Status = styled.p`margin:0;padding:12px 24px;color:#9b3030;font-size:14px;`;
export const Composer = styled.form`display:flex;gap:8px;padding:16px 24px 4px;border-top:1px solid #eeeae4;input{flex:1;min-width:0;padding:0 12px;border:1px solid #d7d3cc;font:inherit;}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}`;
export const RecordButton = styled.button`display:grid;place-items:center;width:48px;height:48px;flex:none;border:1px solid #d7d3cc;background:#fff;font-size:20px;cursor:pointer;&:disabled{opacity:.5;cursor:not-allowed;}`;
export const SendButton = styled(RecordButton)`background:#1d1c1a;color:#fff;border-color:#1d1c1a;`;
export const Hint = styled.p`margin:0;padding:8px 24px 16px;color:#625d56;font-size:12px;`;
export const Direct = styled.div`display:flex;flex-wrap:wrap;justify-content:center;gap:8px 20px;margin-top:26px;color:#625d56;font-size:14px;a{color:#1d1c1a;font-weight:700;}`;

export const Suggestions = styled.div`
  padding: 14px 24px 4px;
  border-top: 1px solid #eeeae4;
  color: #625d56;
  font-size: 12px;
  > div { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 9px; }
  button { min-height: 36px; padding: 0 12px; border: 1px solid #d7d3cc; border-radius: 18px; background: #fff; color: #33312e; font: inherit; cursor: pointer; }
  button:hover { background: #f3eee5; }
  button:focus-visible { outline: 3px solid #a27c3f; outline-offset: 2px; }
  button:disabled { opacity: .5; cursor: not-allowed; }
  & + form { border-top: 0; }
`;
