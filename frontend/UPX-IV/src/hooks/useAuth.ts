import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");
    setIsAuthenticated(!!token);
    setUserId(id);
  }, []);

  const login = (token: string, id: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", id);
    setIsAuthenticated(true);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUserId(null);
    window.location.href = "/login";
  };

  return { isAuthenticated, userId, login, logout };
}
