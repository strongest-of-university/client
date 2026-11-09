import Header from "../../components/Header";
import { useState, type FormEvent } from "react";
import { getErrorMessage } from "../../api/client";
import { signup } from "../../api/services";
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
  const [submitting, setSubmitting] = useState(false);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setMessage("");
    try {
      await signup({
        loginId: fields.username.trim(),
        password: fields.password,
        name: fields.name.trim(),
        phoneNumber: fields.phone.trim(),
        address: fields.address.trim(),
      });
      window.location.assign("/login?signup=success");
    } catch (error) {
      setMessage(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <S.Page>
      <Header variant="auth" />
      <S.Main>
        <S.Title>회원가입</S.Title>
        <S.Form onSubmit={handleSubmit}>
          <S.Field>
            <S.Label htmlFor="signup-username">아이디</S.Label>
            <S.Input id="signup-username" name="username" autoComplete="username" placeholder="아이디" value={fields.username} onChange={(event) => updateField("username", event.target.value)} required />
          </S.Field>
          <S.Field>
            <S.Label htmlFor="signup-password">비밀번호</S.Label>
            <S.Input id="signup-password" name="password" type="password" autoComplete="new-password" placeholder="비밀번호" value={fields.password} onChange={(event) => updateField("password", event.target.value)} required />
          </S.Field>
          <S.Field>
            <S.Label htmlFor="signup-password-confirmation">비밀번호 확인</S.Label>
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
          </S.Field>
          <S.Field>
            <S.Label htmlFor="signup-name">이름</S.Label>
            <S.Input id="signup-name" name="name" autoComplete="name" placeholder="홍길동" value={fields.name} onChange={(event) => updateField("name", event.target.value)} required />
          </S.Field>
          <S.Field>
            <S.Label htmlFor="signup-phone">휴대폰 번호</S.Label>
            <S.Input
              id="signup-phone" name="phone" type="tel" autoComplete="tel" placeholder="010-0000-0000"
              value={fields.phone} onChange={(event) => updateField("phone", event.target.value)}
              onBlur={() => setPhoneTouched(true)} aria-invalid={phoneError}
              aria-describedby={phoneError ? "phone-feedback" : undefined} required
            />
            <S.Feedback id="phone-feedback" $valid={false} role="status">
              {phoneError ? "휴대폰 번호를 확인해 주세요. 예: 010-1234-5678" : ""}
            </S.Feedback>
          </S.Field>
          <S.Field>
            <S.Label htmlFor="signup-address">주소</S.Label>
            <S.Input id="signup-address" name="address" autoComplete="street-address" placeholder="서울시 강남구 ..." value={fields.address} onChange={(event) => updateField("address", event.target.value)} required />
          </S.Field>
          <S.HelpText>주소와 연락처는 예약 및 출발 확정 안내에 사용됩니다.</S.HelpText>
          <S.SubmitButton type="submit" disabled={!canSubmit || submitting}>{submitting ? "가입 중..." : "가입하고 시작하기"}</S.SubmitButton>
        </S.Form>
        <S.Message role="status" aria-live="polite">{message}</S.Message>
      </S.Main>
    </S.Page>
  );
}
