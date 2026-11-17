import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AUTH_SESSION_CHANGED_EVENT,
  clearSession,
  getAccessToken,
  getSessionRole,
  setAccessToken,
  setSessionRole,
  type SessionRole,
} from "../../api/client";
import { getMyProfile, login } from "../../api/services";
import { AuthContext, type AuthContextValue } from "./authContext";

function readSession() {
  const accessToken = getAccessToken();
  return {
    accessToken,
    role: accessToken ? getSessionRole() : null,
  };
}

function normalizeRole(role: unknown): SessionRole | null {
  if (typeof role !== "string") return null;
  const normalized = role.toUpperCase().replace(/^ROLE_/, "");
  return normalized === "STAFF" || normalized === "CUSTOMER" ? normalized : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(readSession);

  useEffect(() => {
    const syncSession = () => setSession(readSession());
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, syncSession);
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  const signIn = useCallback(async (loginId: string, password: string) => {
    clearSession();
    try {
      const auth = await login(loginId, password);
      setAccessToken(auth.accessToken);
      const profile = await getMyProfile();
      const role = normalizeRole(profile.role);
      if (!role) throw new Error("회원 역할을 확인할 수 없습니다. 관리자에게 문의해 주세요.");
      setSessionRole(role);
      setSession({ accessToken: auth.accessToken, role });
      return role;
    } catch (error) {
      clearSession();
      throw error;
    }
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession({ accessToken: null, role: null });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    accessToken: session.accessToken,
    role: session.role,
    isAuthenticated: Boolean(session.accessToken),
    isCustomer: Boolean(session.accessToken) && session.role === "CUSTOMER",
    isStaff: Boolean(session.accessToken) && session.role === "STAFF",
    signIn,
    signOut,
  }), [session, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
