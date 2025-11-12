import { Link, useNavigate } from "react-router-dom";
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
import { Menu, User, Star } from "lucide-react";

interface NavBarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const privateLinks = [
  { href: "/map", label: "Mapa" },
  { href: "/places", label: "Locais" },
  { href: "/stats", label: "Estatísticas" },
];

export default function NavBar({ isAuthenticated, onLogout }: NavBarProps) {
  const navigationLinks = isAuthenticated ? privateLinks : [];
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white sticky top-0 z-50 px-4 md:px-6">
      <div className="flex h-20 md:h-24 items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <Link
            to="/"
            className="text-xl md:text-2xl font-semibold text-primary hover:text-primary/90"
          >
            MobiAccess
          </Link>

          {isAuthenticated && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-4 md:gap-6">
                {navigationLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={link.href}
                        className="text-base md:text-lg text-muted-foreground hover:text-primary font-medium transition-colors"
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

        <div className="flex items-center gap-3 md:gap-4">
          {isAuthenticated ? (
            <>
              {/* Botão de Favoritos */}
              <button
                onClick={() => navigate("/favorites")}
                className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
                title="Meus Favoritos"
              >
                <Star size={22} className="md:w-6 md:h-6 text-gray-700" />
              </button>

              {/* Botão de Avatar */}
              <button
                onClick={() => navigate("/profile")}
                className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
                title="Meu Perfil"
              >
                <User size={22} className="md:w-6 md:h-6 text-gray-700" />
              </button>

              {/* Botão Sair */}
              <Button
                onClick={onLogout}
                size="default"
                className="text-base md:text-lg bg-gray-400 hover:bg-gray-500 cursor-pointer"
              >
                Sair
              </Button>

              {/* Menu Mobile */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-gray-700 w-11 h-11"
                  >
                    <Menu size={24} />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  className="w-48 p-3 md:hidden bg-white shadow-md rounded-xl"
                >
                  <nav className="flex flex-col gap-2">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="text-base text-gray-700 hover:text-primary py-2"
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
              <Button asChild variant="ghost" size="default" className="text-base md:text-lg">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="default" className="text-base md:text-lg">
                <Link to="/account/register">Registrar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
