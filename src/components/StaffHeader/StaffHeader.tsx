import { useAuth } from "../../contexts/auth/authContext";
import * as S from "./StaffHeader.styles";

export type StaffHeaderSection = "product" | "reservation" | "stock" | "sms";

export default function StaffHeader({ current }: { current: StaffHeaderSection }) {
  const { signOut } = useAuth();

  function logout() {
    signOut();
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
