const DEFAULT_API_BASE_URL = "https://api.xn--939a144d.xn--hu5b25b77nvwc.xn--3e0b707e";
const TOKEN_KEY = "accessToken";
const REQUEST_TIMEOUT_MS = 12_000;

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "" : DEFAULT_API_BASE_URL)
).replace(/\/$/, "");

type ApiEnvelope<T> = {
  data?: T;
  message?: string;
  error?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getAccessToken() {
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string) {
  if (window.sessionStorage.getItem(TOKEN_KEY) !== token) window.sessionStorage.removeItem("voiceReservationConversation");
  window.sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearSession() {
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem("isLoggedIn");
  window.sessionStorage.removeItem("isStaff");
  window.sessionStorage.removeItem("showTravelHistory");
  window.sessionStorage.removeItem("showReservationOptions");
  window.sessionStorage.removeItem("voiceReservationConversation");
}

function readMessage(body: unknown, fallback: string) {
  if (body && typeof body === "object") {
    const envelope = body as ApiEnvelope<unknown>;
    if (typeof envelope.message === "string" && envelope.message) return envelope.message;
    if (typeof envelope.error === "string" && envelope.error) return envelope.error;
  }
  return fallback;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, timeoutMs = REQUEST_TIMEOUT_MS): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");

  let response: Response;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("서버 응답이 없습니다. API 서버가 실행 중인지 확인해 주세요.", 0);
    }
    throw new ApiError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.", 0);
  } finally {
    window.clearTimeout(timeoutId);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const body: unknown = response.status === 204
    ? undefined
    : contentType.includes("application/json")
      ? await response.json().catch(() => undefined)
      : await response.text().catch(() => undefined);

  if (!response.ok) {
    if (response.status === 401) clearSession();
    throw new ApiError(readMessage(body, `요청을 처리하지 못했습니다. (${response.status})`), response.status);
  }

  if (body && typeof body === "object" && "data" in body) {
    return (body as ApiEnvelope<T>).data as T;
  }
  return body as T;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "요청을 처리하지 못했습니다.";
}
