import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu } from "lucide-react";

interface NavBarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const privateLinks = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Mapa" },
  { href: "/details", label: "Detalhes" },
];

export default function NavBar({ isAuthenticated, onLogout }: NavBarProps) {
  const navigationLinks = isAuthenticated ? privateLinks : [];

  return (
    <header className="border-b bg-white sticky top-0 z-50 px-4 md:px-6">
      <div className="flex h-16 items-center justify-between">
        {/* Lado esquerdo */}
        <div className="flex items-center gap-3">
          {/* LOGO */}
          <Link
            to="/"
            className="text-lg font-semibold text-primary hover:text-primary/90"
          >
            MyApp
          </Link>

          {/* Menu Desktop */}
          {isAuthenticated && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-4">
                {navigationLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>

        {/* Lado direito */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Botão de Logout (desktop e mobile) */}
              <Button
                onClick={onLogout}
                size="sm"
                className="text-sm bg-red-500 hover:bg-red-600"
              >
                Sair
              </Button>

              {/* Menu Mobile */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-gray-700"
                  >
                    <Menu size={22} />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  className="w-40 p-2 md:hidden bg-white shadow-md rounded-xl"
                >
                  <nav className="flex flex-col gap-1">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="text-sm text-gray-700 hover:text-primary py-1.5"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="text-sm">
                <Link to="/register">Registrar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
