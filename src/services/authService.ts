import { apiRequest } from "../api/client";

export type LoginResponse = {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
};

type SignupFields = {
  loginId: string;
  password: string;
  name: string;
  phoneNumber: string;
  address: string;
};

export type SignupRequest = SignupFields & (
  | { role: "CUSTOMER"; staffCode?: never }
  | { role: "STAFF"; staffCode: string }
);

export function login(loginId: string, password: string) {
  return apiRequest<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ loginId, password }),
  });
}

export function signup(payload: SignupRequest) {
  return apiRequest<unknown>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
