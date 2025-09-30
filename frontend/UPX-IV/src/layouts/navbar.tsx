import { Outlet } from "react-router-dom";
import NavBar from "@/components/navbar";
import { isAuthenticated } from "@/routes";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar isAuthenticated={isAuthenticated} onLogout={() => {}} />

      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
}
