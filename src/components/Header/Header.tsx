import { useEffect, useState } from "react";
import * as S from "./Header.styles";

type HeaderProps = {
  variant?: "home" | "default" | "auth";
  currentPage?: "theme" | "reservation" | "login";
};

export default function Header({ variant = "default", currentPage }: HeaderProps) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24);
  const [loggedIn, setLoggedIn] = useState(
    () => window.sessionStorage.getItem("isLoggedIn") === "true",
  );

  useEffect(() => {
    if (variant !== "home") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  function handleLogout() {
    window.sessionStorage.removeItem("isLoggedIn");
    window.sessionStorage.removeItem("showTravelHistory");
    setLoggedIn(false);
    window.location.assign("/");
  }

  return (
    <S.Header $variant={variant} $scrolled={scrolled}>
      <S.Brand href="/" $variant={variant}>미스터 월드</S.Brand>
      <S.Nav aria-label="주 메뉴" $variant={variant}>
        <S.NavLink $variant={variant} href={variant === "home" ? "#themes" : "/#themes"} aria-current={currentPage === "theme" ? "page" : undefined}>THEME</S.NavLink>
        <S.NavLink
          $variant={variant}
          href={loggedIn ? (variant === "home" ? "#reservation" : "/#reservation") : "/reservation"}
          aria-current={currentPage === "reservation" ? "page" : undefined}
        >
          RESERVATION
        </S.NavLink>
        {loggedIn ? (
          <S.NavButton $variant={variant} type="button" onClick={handleLogout}>LOGOUT</S.NavButton>
        ) : (
          <S.NavLink $variant={variant} href="/login" aria-current={currentPage === "login" ? "page" : undefined}>LOGIN</S.NavLink>
        )}
      </S.Nav>
    </S.Header>
  );
}
