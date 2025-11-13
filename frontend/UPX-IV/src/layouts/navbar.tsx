import { Outlet } from "react-router-dom";
import NavBar from "@/components/navbar";
import { useAuthContext } from "@/context/useAuthContext";
import { useEffect, useState } from "react";

export default function Layout() {
  const { isAuthenticated, logout } = useAuthContext();
  const [authState, setAuthState] = useState(isAuthenticated);

  // Sincroniza o estado local com o contexto e o localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuth = isAuthenticated || !!token;
    setAuthState(isAuth);
  }, [isAuthenticated]);

  // Verifica periodicamente o localStorage como fallback
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      const isAuth = isAuthenticated || !!token;
      if (isAuth !== authState) {
        setAuthState(isAuth);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isAuthenticated, authState]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavBar isAuthenticated={authState} onLogout={logout} />
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
}
