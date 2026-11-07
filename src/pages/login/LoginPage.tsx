import Header from "../../components/Header";
import { type FormEvent } from "react";
import * as S from "./LoginPage.styles";

export default function LoginPage({ reservationRequired = false }: { reservationRequired?: boolean }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim().toUpperCase();

    if (username === "MW-S-021") {
      window.sessionStorage.removeItem("isLoggedIn");
      window.sessionStorage.setItem("isStaff", "true");
      window.location.assign("/staff");
      return;
    }

    window.sessionStorage.removeItem("isStaff");
    window.sessionStorage.setItem("isLoggedIn", "true");
    if (reservationRequired) {
      window.sessionStorage.removeItem("showTravelHistory");
      window.sessionStorage.setItem("showReservationOptions", "true");
    } else {
      window.sessionStorage.removeItem("showReservationOptions");
      window.sessionStorage.setItem("showTravelHistory", "true");
    }
    window.location.assign("/");
  }

  return (
    <S.Page>
      <Header variant="auth" currentPage={reservationRequired ? "reservation" : "login"} />
      <S.Main>
        {reservationRequired && (
          <S.ReservationNotice>
            예약은 로그인 후 진행할 수 있어요. 로그인하면 바로 이어서 진행돼요.
          </S.ReservationNotice>
        )}
        <S.Title>로그인</S.Title>
        <S.Form onSubmit={handleSubmit}>
          <S.Field>
            <S.Label htmlFor="login-id">아이디</S.Label>
            <S.Input id="login-id" name="username" autoComplete="username" required />
          </S.Field>
          <S.Field>
            <S.Label htmlFor="login-password">비밀번호</S.Label>
            <S.Input id="login-password" name="password" type="password" autoComplete="current-password" required />
          </S.Field>
          <S.SubmitButton type="submit">로그인</S.SubmitButton>
        </S.Form>
        <S.SignupPrompt>
          아직 회원이 아니신가요?
          <S.SignupButton href="/signup">
            회원가입
          </S.SignupButton>
        </S.SignupPrompt>
        <S.StaffHint>직원은 사번 <strong>MW-S-021</strong>로 로그인해 주세요.</S.StaffHint>
      </S.Main>
    </S.Page>
  );
}
