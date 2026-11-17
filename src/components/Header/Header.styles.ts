import styled, { css } from "styled-components";

type VariantProps = { $variant: "home" | "default" | "auth" };

export const Header = styled.header<VariantProps & { $scrolled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px clamp(28px, 4.3vw, 82px);
  background: var(--color-text);

  ${({ $variant, $scrolled }) => $variant === "home" ? css`
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    right: 0;
    background: ${$scrolled ? "var(--color-text)" : "transparent"};
    box-shadow: ${$scrolled ? "0 4px 18px rgba(0,0,0,.18)" : "none"};
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  ` : css`
    gap: 24px;
    ${$variant === "auth" ? css`
      min-height: 80px;
      padding: 20px clamp(24px, 2.8vw, 44px);
      background: #000;
    ` : css`
      position: sticky;
      top: 0;
      z-index: 10;
    `}
    @media (max-width: 600px) {
      flex-direction: column;
      gap: ${$variant === "auth" ? "16px" : "12px"};
      ${$variant === "auth" && css`padding: 20px;`}
    }
  `}
`;

export const Brand = styled.a<VariantProps>`
  color: var(--color-background);
  text-decoration: none;
  font: 700 ${({ $variant }) => $variant === "auth" ? "24px" : "22px"} "Noto Serif KR", serif;
  ${({ $variant }) => $variant !== "home" && css`white-space: nowrap;`}
`;

export const Nav = styled.nav<VariantProps>`
  display: flex;
  gap: ${({ $variant }) => $variant === "auth" ? "clamp(20px, 2.5vw, 44px)" : "clamp(12px, 2vw, 28px)"};
  ${({ $variant }) => $variant !== "home" && css`align-items: center;`}
`;

export const NavLink = styled.a<VariantProps>`
  color: var(--color-background);
  text-decoration: none;
  font: ${({ $variant }) => $variant === "auth" ? "600 clamp(14px, 1.1vw, 17px)" : "500 15px"} "Cormorant Garamond", serif;
  letter-spacing: ${({ $variant }) => $variant === "auth" ? "0.14em" : "0.12em"};
  ${({ $variant }) => $variant !== "home" && css`
    &:hover { text-decoration: underline; text-underline-offset: 6px; }
  `}
  ${({ $variant }) => $variant === "auth" && css`
    &:focus-visible { outline: 2px solid var(--color-background); outline-offset: 6px; }
  `}
`;

export const NavButton = styled(NavLink).attrs({ as: "button" })`
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;
