import { useState, type FormEvent } from "react";
import * as Auth from "../login/LoginPage.styles";
import * as S from "./SignupPage.styles";

type SignupFields = {
  username: string;
  password: string;
  passwordConfirmation: string;
  name: string;
  phone: string;
  address: string;
};

export default function SignupPage() {
  const [fields, setFields] = useState<SignupFields>({
    username: "", password: "", passwordConfirmation: "", name: "", phone: "", address: "",
  });
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [message, setMessage] = useState("");
  const passwordsMatch = fields.password.length > 0 && fields.password === fields.passwordConfirmation;
  const phoneValid = /^01[016789]-?\d{3,4}-?\d{4}$/.test(fields.phone.trim());
  const requiredFieldsPresent = [fields.username, fields.name, fields.address].every((value) => value.trim().length > 0);
  const canSubmit = requiredFieldsPresent && passwordsMatch && phoneValid;
  const confirmationEntered = fields.passwordConfirmation.length > 0;
  const phoneError = phoneTouched && fields.phone.length > 0 && !phoneValid;

  function updateField(field: keyof SignupFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setMessage("회원가입 서비스를 준비 중입니다. 잠시 후 다시 시도해 주세요.");
  }

  return (
    <Auth.Page>
      <Auth.Header>
        <Auth.Brand href="/">미스터 월드</Auth.Brand>
        <Auth.Nav aria-label="주 메뉴">
          <Auth.NavLink href="/#themes">THEME</Auth.NavLink>
          <Auth.NavLink href="/reservation">RESERVATION</Auth.NavLink>
          <Auth.NavLink href="/login">LOGIN</Auth.NavLink>
        </Auth.Nav>
      </Auth.Header>
      <Auth.Main>
        <Auth.Title>회원가입</Auth.Title>
        <Auth.Form onSubmit={handleSubmit}>
          <Auth.Field>
            <Auth.Label htmlFor="signup-username">아이디</Auth.Label>
            <S.Input id="signup-username" name="username" autoComplete="username" placeholder="아이디" value={fields.username} onChange={(event) => updateField("username", event.target.value)} required />
          </Auth.Field>
          <Auth.Field>
            <Auth.Label htmlFor="signup-password">비밀번호</Auth.Label>
            <S.Input id="signup-password" name="password" type="password" autoComplete="new-password" placeholder="비밀번호" value={fields.password} onChange={(event) => updateField("password", event.target.value)} required />
          </Auth.Field>
          <Auth.Field>
            <Auth.Label htmlFor="signup-password-confirmation">비밀번호 확인</Auth.Label>
            <S.Input
              id="signup-password-confirmation" name="passwordConfirmation" type="password" autoComplete="new-password"
              placeholder="비밀번호를 한 번 더 입력" value={fields.passwordConfirmation}
              onChange={(event) => updateField("passwordConfirmation", event.target.value)}
              aria-invalid={confirmationEntered && !passwordsMatch}
              aria-describedby={confirmationEntered ? "password-feedback" : undefined}
              required
            />
            <S.Feedback id="password-feedback" $valid={passwordsMatch} role="status">
              {confirmationEntered ? (passwordsMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다.") : ""}
            </S.Feedback>
          </Auth.Field>
          <Auth.Field>
            <Auth.Label htmlFor="signup-name">이름</Auth.Label>
            <S.Input id="signup-name" name="name" autoComplete="name" placeholder="홍길동" value={fields.name} onChange={(event) => updateField("name", event.target.value)} required />
          </Auth.Field>
          <Auth.Field>
            <Auth.Label htmlFor="signup-phone">휴대폰 번호</Auth.Label>
            <S.Input
              id="signup-phone" name="phone" type="tel" autoComplete="tel" placeholder="010-0000-0000"
              value={fields.phone} onChange={(event) => updateField("phone", event.target.value)}
              onBlur={() => setPhoneTouched(true)} aria-invalid={phoneError}
              aria-describedby={phoneError ? "phone-feedback" : undefined} required
            />
            <S.Feedback id="phone-feedback" $valid={false} role="status">
              {phoneError ? "휴대폰 번호를 확인해 주세요. 예: 010-1234-5678" : ""}
            </S.Feedback>
          </Auth.Field>
          <Auth.Field>
            <Auth.Label htmlFor="signup-address">주소</Auth.Label>
            <S.Input id="signup-address" name="address" autoComplete="street-address" placeholder="서울시 강남구 ..." value={fields.address} onChange={(event) => updateField("address", event.target.value)} required />
          </Auth.Field>
          <S.HelpText>주소와 연락처는 예약 및 출발 확정 안내에 사용됩니다.</S.HelpText>
          <S.SubmitButton type="submit" disabled={!canSubmit}>가입하고 시작하기</S.SubmitButton>
        </Auth.Form>
        <Auth.Message role="status" aria-live="polite">{message}</Auth.Message>
      </Auth.Main>
    </Auth.Page>
  );
}
