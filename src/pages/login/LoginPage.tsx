import Header from "../../components/Header";
import { type FormEvent } from "react";
import * as S from "./LoginPage.styles";

export default function LoginPage({ reservationRequired = false }: { reservationRequired?: boolean }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.sessionStorage.setItem("isLoggedIn", "true");
    window.sessionStorage.setItem("showTravelHistory", "true");
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
      </S.Main>
    </S.Page>
  );
}
