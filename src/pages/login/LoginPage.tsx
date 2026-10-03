import { useState, type FormEvent } from "react";
import * as S from "./LoginPage.styles";

export default function LoginPage({ reservationRequired = false }: { reservationRequired?: boolean }) {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("로그인 서비스를 준비 중입니다. 잠시 후 다시 시도해 주세요.");
  }

  return (
    <S.Page>
      <S.Header>
        <S.Brand href="/">미스터 월드</S.Brand>
        <S.Nav aria-label="주 메뉴">
          <S.NavLink href="/#themes">THEME</S.NavLink>
          <S.NavLink href="/reservation" aria-current={reservationRequired ? "page" : undefined}>RESERVATION</S.NavLink>
          <S.NavLink href="/login" aria-current={reservationRequired ? undefined : "page"}>LOGIN</S.NavLink>
        </S.Nav>
      </S.Header>
      <S.Main>
        {reservationRequired && (
          <S.ReservationNotice>
            예약은 로그인 후 진행할 수 있어요. 로그인하면 바로 이어서 진행돼요.
          </S.ReservationNotice>
        )}
        <S.Title>로그인</S.Title>
        <S.Form onSubmit={handleSubmit} onChange={() => setMessage("")}>
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
          <S.SignupButton type="button" onClick={() => setMessage("회원가입 기능은 준비 중입니다.")}>
            회원가입
          </S.SignupButton>
        </S.SignupPrompt>
        <S.Message role="status" aria-live="polite">{message}</S.Message>
      </S.Main>
    </S.Page>
  );
}
