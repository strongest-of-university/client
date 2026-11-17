import { apiRequest } from "../api/client";

export type LoginResponse = {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
};

export type SignupRequest = {
  loginId: string;
  password: string;
  name: string;
  phoneNumber: string;
  address: string;
};

export function login(loginId: string, password: string) {
  return apiRequest<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ loginId, password }),
  });
}

export function signup(payload: SignupRequest) {
  return apiRequest<unknown>("/api/v1/auth/customer/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
