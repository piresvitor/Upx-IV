import { createContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (token: string, id: string) => void;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
