import { Outlet } from "react-router-dom";
import NavBar from "@/components/navbar";
import { useAuth } from "@/hooks/useAuth";

export default function Layout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar isAuthenticated={isAuthenticated} onLogout={logout} />
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
}
