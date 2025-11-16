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
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavBarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const privateLinks = [
  { href: "/map", label: "Mapa" },
  { href: "/places", label: "Locais" },
  { href: "/stats", label: "Estatísticas" },
];

// Links que ficam no menu suspenso no mobile (todos exceto Mapa)
const mobileMenuLinks = [
  { href: "/places", label: "Locais" },
  { href: "/stats", label: "Estatísticas" },
];

export default function NavBar({ isAuthenticated, onLogout }: NavBarProps) {
  const navigationLinks = isAuthenticated ? privateLinks : [];
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 sticky top-0 z-50 px-3 md:px-6">
      <div className="flex h-16 md:h-24 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
          <Link
            to="/"
            className="text-lg md:text-2xl font-semibold text-primary hover:text-primary/90 truncate"
          >
            MobiAccess
          </Link>

          {isAuthenticated && (
            <>
              {/* Menu Desktop - todos os links */}
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList className="gap-4 md:gap-6">
                  {navigationLinks.map((link) => (
                    <NavigationMenuItem key={link.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={link.href}
                          className="text-base md:text-lg text-muted-foreground hover:text-primary dark:hover:text-primary font-medium transition-colors"
                        >
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              {/* Link Mapa visível no mobile */}
              <Link
                to="/map"
                className="sm:hidden text-base text-muted-foreground hover:text-primary dark:hover:text-primary font-medium transition-colors ml-2"
              >
                Mapa
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 md:gap-4 flex-shrink-0">
          {/* Toggle de Tema */}
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              {/* Botão de Favoritos - oculto no mobile, aparece no menu */}
              <button
                onClick={() => navigate("/favorites")}
                className="hidden sm:flex w-9 h-9 md:w-12 md:h-12 rounded-full bg-gray-200 dark:bg-gray-200 items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-300 transition"
                title="Meus Favoritos"
              >
                <Star size={18} className="md:w-6 md:h-6 text-gray-700 dark:text-gray-700" />
              </button>

              {/* Botão de Avatar - oculto no mobile, aparece no menu */}
              <button
                onClick={() => navigate("/profile")}
                className="hidden sm:flex w-9 h-9 md:w-12 md:h-12 rounded-full bg-gray-200 dark:bg-gray-200 items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-300 transition"
                title="Meu Perfil"
              >
                <User size={18} className="md:w-6 md:h-6 text-gray-700 dark:text-gray-700" />
              </button>

              {/* Botão Sair - oculto no mobile */}
              <Button
                onClick={onLogout}
                size="default"
                className="hidden sm:flex text-sm md:text-lg bg-gray-400 dark:bg-gray-400 hover:bg-gray-500 dark:hover:bg-gray-500 cursor-pointer text-white dark:text-white px-3 md:px-4"
              >
                Sair
              </Button>

              {/* Menu Mobile */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:hidden text-gray-700 dark:text-gray-700 w-9 h-9 p-0"
                  >
                    <Menu size={20} />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  className="w-48 p-3 bg-white dark:bg-gray-800 shadow-md rounded-xl border-gray-200 dark:border-gray-700"
                >
                  <nav className="flex flex-col gap-2">
                    {/* Links do menu (Locais e Estatísticas) - Mapa fica visível fora do menu */}
                    {mobileMenuLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="text-base text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary py-2"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        navigate("/favorites");
                      }}
                      className="text-base text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary py-2 text-left flex items-center gap-2"
                    >
                      <Star size={18} />
                      Meus Favoritos
                    </button>
                    <button
                      onClick={() => {
                        navigate("/profile");
                      }}
                      className="text-base text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary py-2 text-left flex items-center gap-2"
                    >
                      <User size={18} />
                      Meu Perfil
                    </button>
                    <button
                      onClick={onLogout}
                      className="text-base text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary py-2 text-left"
                    >
                      Sair
                    </button>
                  </nav>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="default" className="text-sm md:text-lg px-2 md:px-4">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="default" className="text-sm md:text-lg px-2 md:px-4">
                <Link to="/account/register">Registrar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
