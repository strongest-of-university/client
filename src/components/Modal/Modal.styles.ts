import styled from "styled-components";

export const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.55);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition:
    opacity 0.45s ease,
    visibility 0s linear ${({ $open }) => ($open ? "0s" : "0.45s")};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Dialog = styled.div<{
  $size: "default" | "large" | "wide";
  $tone: "default" | "warm";
  $open: boolean;
}>`
  width: min(${({ $size }) => ($size === "wide" ? "700px" : $size === "large" ? "600px" : "480px")}, 100%);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border-radius: 16px;
  background: ${({ $tone }) => ($tone === "warm" ? "var(--color-background)" : "var(--color-surface)")};
  color: var(--color-text);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: ${({ $open }) => ($open ? "translateY(0) scale(1)" : "translateY(14px) scale(0.985)")};
  transition:
    opacity 0.4s ease,
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px 16px;
`;

export const Title = styled.h2<{ $size: "default" | "large" | "wide" }>`
  margin: 0;
  font: 700 ${({ $size }) => ($size === "default" ? "22px" : "clamp(24px, 4vw, 30px)")} "Noto Serif KR", serif;
  line-height: 1.35;
`;

export const CloseButton = styled.button<{ $tone: "default" | "warm" }>`
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${({ $tone }) => ($tone === "warm" ? "transparent" : "#f2eee7")};
  color: var(--color-text);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;

  svg { width: 21px; height: 21px; }

  &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }
`;

export const Content = styled.div`
  padding: 0 24px 24px;
  line-height: 1.7;
`;
