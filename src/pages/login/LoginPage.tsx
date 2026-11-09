import Header from "../../components/Header";
import { useState, type FormEvent } from "react";
import { clearSession, getErrorMessage, setAccessToken } from "../../api/client";
import { getMyProfile, login } from "../../api/services";
import * as S from "./LoginPage.styles";

export default function LoginPage({ reservationRequired = false }: { reservationRequired?: boolean }) {
  const [message, setMessage] = useState(() =>
    new URLSearchParams(window.location.search).get("signup") === "success"
      ? "회원가입이 완료되었습니다. 로그인해 주세요."
      : "",
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const loginId = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    setSubmitting(true);
    setMessage("");

    try {
      clearSession();
      const auth = await login(loginId, password);
      setAccessToken(auth.accessToken);
      const profile = await getMyProfile();

      if (profile.role === "STAFF") {
        window.sessionStorage.setItem("isStaff", "true");
        window.location.assign("/staff");
        return;
      }

      window.sessionStorage.setItem("isLoggedIn", "true");
      if (reservationRequired) {
        window.sessionStorage.setItem("showReservationOptions", "true");
      } else {
        window.sessionStorage.setItem("showTravelHistory", "true");
      }
      window.location.assign("/");
    } catch (error) {
      clearSession();
      setMessage(getErrorMessage(error));
      setSubmitting(false);
    }
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
          <S.SubmitButton type="submit" disabled={submitting}>{submitting ? "로그인 중..." : "로그인"}</S.SubmitButton>
        </S.Form>
        <S.Message role="alert" aria-live="polite">{message}</S.Message>
        <S.SignupPrompt>
          아직 회원이 아니신가요?
          <S.SignupButton href="/signup">
            회원가입
          </S.SignupButton>
        </S.SignupPrompt>
        <S.StaffHint>직원 계정은 로그인 후 직원 페이지로 자동 이동합니다.</S.StaffHint>
      </S.Main>
    </S.Page>
  );
}
