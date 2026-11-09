import * as S from "./StaffPage.styles";
import { clearSession } from "../../api/client";

export default function StaffHeader({ current }: { current: "product" | "reservation" | "stock" | "sms" }) {
  function logout() {
    clearSession();
    window.location.assign("/login");
  }

  return (
    <S.Header>
      <S.Brand href="/staff">미스터 월드 <small>STAFF</small></S.Brand>
      <S.Nav aria-label="직원 메뉴">
        <S.NavLink href="/staff" $active={current === "product"}>PRODUCT</S.NavLink>
        <S.NavLink href="/staff/reservations" $active={current === "reservation"}>RESERVATION</S.NavLink>
        <S.NavLink href="/staff/stock" $active={current === "stock"}>STOCK</S.NavLink>
        <S.NavLink href="/staff/sms" $active={current === "sms"}>SMS</S.NavLink>
        <S.LogoutButton type="button" onClick={logout}>LOGOUT</S.LogoutButton>
      </S.Nav>
    </S.Header>
  );
}
