import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-11 h-11 md:w-12 md:h-12 rounded-full bg-gray-200 dark:bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-300 transition"
          title="Alternar tema"
          aria-label="Alternar entre tema claro e escuro"
        >
          <Sun className="h-5 w-5 md:h-6 md:w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-700 dark:text-gray-700" />
          <Moon className="absolute h-5 w-5 md:h-6 md:w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-700 dark:text-gray-700" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-48 p-2 bg-white dark:bg-gray-800 shadow-md rounded-xl border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setTheme("light")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              theme === "light"
                ? "bg-primary text-primary-foreground"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            aria-pressed={theme === "light"}
          >
            <Sun className="h-4 w-4" />
            <span>Claro</span>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              theme === "dark"
                ? "bg-primary text-primary-foreground"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            aria-pressed={theme === "dark"}
          >
            <Moon className="h-4 w-4" />
            <span>Escuro</span>
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              theme === "system"
                ? "bg-primary text-primary-foreground"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            aria-pressed={theme === "system"}
          >
            <Monitor className="h-4 w-4" />
            <span>Sistema</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

