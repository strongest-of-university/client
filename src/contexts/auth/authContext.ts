import { createContext, useContext } from "react";
import type { SessionRole } from "../../api/client";

export type AuthContextValue = {
  accessToken: string | null;
  role: SessionRole | null;
  isAuthenticated: boolean;
  isCustomer: boolean;
  isStaff: boolean;
  signIn: (loginId: string, password: string) => Promise<SessionRole>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
