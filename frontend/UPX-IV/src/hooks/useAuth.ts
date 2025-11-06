import { useEffect, useState, useCallback } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");
    setIsAuthenticated(!!token);
    setUserId(id);
  }, []);

  useEffect(() => {
    // Verifica autenticação na montagem
    checkAuth();

    // Listener para mudanças no localStorage (de outras abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "userId") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkAuth]);

  const login = useCallback((token: string, id: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", id);
    setIsAuthenticated(true);
    setUserId(id);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUserId(null);
    window.location.href = "/login";
  }, []);

  return { isAuthenticated, userId, login, logout };
}
