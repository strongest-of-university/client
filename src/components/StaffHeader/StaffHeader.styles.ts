import styled from "styled-components";

export const Header = styled.header`
  position: sticky;
  z-index: 20;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  min-height: 70px;
  padding: 0 clamp(28px, 4.3vw, 66px);
  color: var(--color-surface);
  background: var(--color-text);

  @media (max-width: 760px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
    padding-top: 18px;
    padding-bottom: 16px;
  }
`;

export const Brand = styled.a`
  color: var(--color-surface);
  font: 700 24px "Noto Serif KR", serif;
  text-decoration: none;
  white-space: nowrap;

  small {
    margin-left: 8px;
    font: 700 12px "Cormorant Garamond", serif;
    letter-spacing: .16em;
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: stretch;
  align-self: stretch;
  gap: clamp(18px, 3vw, 42px);
  overflow-x: auto;
  max-width: 100%;

  @media (max-width: 760px) {
    align-self: auto;
    min-height: 38px;
  }
`;

export const NavLink = styled.a<{ $active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 70px;
  padding: 0;
  color: var(--color-surface);
  font: 600 14px "Cormorant Garamond", serif;
  line-height: 1;
  letter-spacing: .16em;
  text-decoration: none;
  white-space: nowrap;

  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 14px;
    left: 0;
    height: 1px;
    background: ${({ $active }) => $active ? "var(--color-surface)" : "transparent"};
  }

  @media (max-width: 760px) {
    min-height: 38px;

    &::after { bottom: 2px; }
  }
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  min-height: 70px;
  padding: 0;
  border: 0;
  color: var(--color-surface);
  background: transparent;
  font: 600 14px "Cormorant Garamond", serif;
  line-height: 1;
  letter-spacing: .16em;
  white-space: nowrap;

  @media (max-width: 760px) { min-height: 38px; }
`;
