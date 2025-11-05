import { createContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
