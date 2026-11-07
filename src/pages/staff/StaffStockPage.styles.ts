import styled from "styled-components";

export const Page = styled.div`min-height:100vh;color:#1d1c1a;background:#fff;`;
export const Main = styled.main`width:min(1068px,calc(100% - 64px));margin:0 auto;padding:43px 0 70px;@media(max-width:680px){width:min(100% - 28px,1068px);}`;
export const Eyebrow = styled.p`margin:0 0 5px;font:600 14px "Cormorant Garamond",serif;letter-spacing:.2em;`;
export const Title = styled.h1`margin:0 0 8px;font:700 29px "Noto Serif KR",serif;`;
export const Description = styled.p`margin:0 0 30px;color:#4f4943;font-size:11px;`;
export const Grid = styled.div`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;@media(max-width:980px){grid-template-columns:repeat(3,minmax(0,1fr));}@media(max-width:740px){grid-template-columns:repeat(2,minmax(0,1fr));}@media(max-width:480px){grid-template-columns:1fr;}`;
export const Card = styled.article<{ $shortage: boolean }>`padding:18px;border:1px solid ${({$shortage})=>$shortage ? "#c94728" : "#ded6cc"};border-radius:14px;background:#fff;`;
export const CardHeader = styled.div`display:flex;align-items:flex-start;justify-content:space-between;gap:12px;span{display:grid;}strong{font-size:13px;}small{font-size:9px;}`;
export const Badge = styled.b<{ $shortage: boolean }>`flex:none;padding:6px 10px;border-radius:999px;color:${({$shortage})=>$shortage ? "#fff" : "#1d1c1a"};background:${({$shortage})=>$shortage ? "#b94327" : "#f4f4f3"};font-size:8px;`;
export const Amount = styled.div`display:flex;align-items:baseline;gap:6px;margin:14px 0 10px;b{font-size:34px;line-height:1;}span{font-size:10px;}`;
export const StockInfo = styled.div`display:grid;gap:5px;margin-bottom:14px;div{display:flex;justify-content:space-between;gap:10px;font-size:9px;}strong{font-weight:500;text-align:right;}`;
export const Actions = styled.div`display:grid;grid-template-columns:40px 40px 1fr;gap:7px;`;
export const QuantityButton = styled.button`height:40px;border:1px solid #7b746c;border-radius:7px;color:#1d1c1a;background:#fff;font-size:17px;&:hover{background:#f3f1ed;}`;
export const RestockButton = styled.button`height:40px;border:0;border-radius:7px;color:#fff;background:#1d1c1a;font-size:10px;font-weight:700;&:hover{background:#39352f;}`;
