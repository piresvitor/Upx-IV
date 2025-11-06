import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/useAuthContext";
import { useEffect, useState } from "react";

export default function PrivateRoute() {
  const { isAuthenticated } = useAuthContext();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Aguarda um momento para garantir que o estado de autenticação seja verificado
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // Verifica também o localStorage diretamente como fallback
  const token = localStorage.getItem("token");
  const isAuth = isAuthenticated || !!token;

  if (!isReady) {
    return null; // ou um loading spinner
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
