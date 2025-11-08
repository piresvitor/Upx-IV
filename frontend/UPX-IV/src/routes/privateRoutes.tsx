import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/useAuthContext";

export default function PrivateRoute() {
  const { isAuthenticated } = useAuthContext();

  // Verifica também o localStorage diretamente como fallback
  const token = localStorage.getItem("token");
  const isAuth = isAuthenticated || !!token;

  // Sempre retorna Outlet para manter o contexto do Router
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
