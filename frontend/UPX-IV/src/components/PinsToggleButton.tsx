import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PinsToggleButtonProps {
  showPins: boolean;
  onToggle: () => void;
}

export default function PinsToggleButton({
  showPins,
  onToggle,
}: PinsToggleButtonProps) {
  return (
    <Button
      variant={showPins ? "default" : "outline"}
      onClick={onToggle}
      className={`
        h-11 sm:h-12 px-3 sm:px-4 flex-shrink-0 gap-2
        transition-all duration-300 ease-in-out
        relative overflow-hidden
        ${showPins 
          ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl dark:shadow-xl dark:hover:shadow-2xl border-2 border-primary/20" 
          : "border-2 border-gray-300 dark:border-gray-600 hover:border-primary/60 hover:bg-accent/50 shadow-md hover:shadow-lg dark:shadow-lg dark:hover:shadow-xl bg-white dark:bg-gray-800"
        }
        group
        active:scale-95
      `}
      aria-label={showPins ? "Ocultar marcadores" : "Mostrar marcadores"}
      title={showPins ? "Ocultar marcadores" : "Mostrar marcadores"}
    >
      {/* Indicador de estado ativo */}
      {showPins && (
        <span className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
      )}
      
      <MapPin 
        className={`
          w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 relative z-10
          ${showPins 
            ? "fill-current scale-110 drop-shadow-sm" 
            : "group-hover:scale-110 group-hover:text-primary dark:group-hover:text-primary"
          }
        `} 
      />
      
      <span className={`
        text-sm sm:text-base font-semibold relative z-10
        transition-all duration-300
        hidden sm:inline-block
        ${showPins 
          ? "text-primary-foreground" 
          : "text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary"
        }
      `}>
        {showPins ? "Ocultar Pins" : "Mostrar Pins"}
      </span>
      
      <span className={`
        text-xs font-bold relative z-10 sm:hidden
        transition-all duration-300
        ${showPins 
          ? "text-primary-foreground" 
          : "text-gray-600 dark:text-gray-400"
        }
      `}>
        {showPins ? "ON" : "OFF"}
      </span>
    </Button>
  );
}

