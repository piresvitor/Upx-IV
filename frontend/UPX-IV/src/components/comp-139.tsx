import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accessibility, Building2, Eye, Car } from "lucide-react";

interface CommentCheckBoxProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
  onTouched?: () => void; // chamada quando o usuário interage
}

export default function CommentCheckBox({
  selectedTypes,
  onChange,
  onTouched,
}: CommentCheckBoxProps) {
  const id = useId();

  const options = [
    { 
      id: `${id}-a`, 
      label: "Rampa de acesso", 
      value: "rampaAcesso",
      icon: Accessibility,
      color: "blue",
      description: "Rampa para acesso ao local"
    },
    { 
      id: `${id}-b`, 
      label: "Banheiro acessível", 
      value: "banheiroAcessivel",
      icon: Building2,
      color: "green",
      description: "Banheiro adaptado"
    },
    {
      id: `${id}-c`,
      label: "Vagas PCD",
      value: "estacionamentoAcessivel",
      icon: Car,
      color: "purple",
      description: "Vagas de estacionamento"
    },
    {
      id: `${id}-d`,
      label: "Acessibilidade visual",
      value: "acessibilidadeVisual",
      icon: Eye,
      color: "orange",
      description: "Sinalização e recursos visuais"
    },
  ];

  const handleToggle = (value: string) => {
    onTouched?.(); // informa o pai que houve interação
    const updated = selectedTypes.includes(value)
      ? selectedTypes.filter((t) => t !== value)
      : [...selectedTypes, value];

    onChange(updated);
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap: Record<string, { 
      border: string; 
      bg: string; 
      iconBg: string;
      icon: string;
    }> = {
      blue: {
        border: isSelected ? "border-blue-500 dark:border-blue-400" : "border-gray-200 dark:border-gray-700",
        bg: isSelected ? "bg-blue-50 dark:bg-blue-900/20" : "bg-white dark:bg-gray-800",
        iconBg: isSelected ? "bg-blue-100 dark:bg-blue-900/40" : "bg-gray-100 dark:bg-gray-700",
        icon: isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400",
      },
      green: {
        border: isSelected ? "border-green-500 dark:border-green-400" : "border-gray-200 dark:border-gray-700",
        bg: isSelected ? "bg-green-50 dark:bg-green-900/20" : "bg-white dark:bg-gray-800",
        iconBg: isSelected ? "bg-green-100 dark:bg-green-900/40" : "bg-gray-100 dark:bg-gray-700",
        icon: isSelected ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400",
      },
      purple: {
        border: isSelected ? "border-purple-500 dark:border-purple-400" : "border-gray-200 dark:border-gray-700",
        bg: isSelected ? "bg-purple-50 dark:bg-purple-900/20" : "bg-white dark:bg-gray-800",
        iconBg: isSelected ? "bg-purple-100 dark:bg-purple-900/40" : "bg-gray-100 dark:bg-gray-700",
        icon: isSelected ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400",
      },
      orange: {
        border: isSelected ? "border-orange-500 dark:border-orange-400" : "border-gray-200 dark:border-gray-700",
        bg: isSelected ? "bg-orange-50 dark:bg-orange-900/20" : "bg-white dark:bg-gray-800",
        iconBg: isSelected ? "bg-orange-100 dark:bg-orange-900/40" : "bg-gray-100 dark:bg-gray-700",
        icon: isSelected ? "text-orange-600 dark:text-orange-400" : "text-gray-500 dark:text-gray-400",
      },
    };
    
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedTypes.includes(option.value);
          const colors = getColorClasses(option.color, isSelected);
          
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleToggle(option.value)}
              className={`
                p-4 rounded-lg border-2 transition-all text-left
                hover:shadow-md hover:scale-[1.02]
                ${colors.border} ${colors.bg}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${colors.iconBg}
                `}>
                  <Icon size={20} className={colors.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Checkbox
                      id={option.id}
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(option.value)}
                      className="pointer-events-none"
                    />
                    <Label 
                      htmlFor={option.id}
                      className={`
                        font-semibold text-sm cursor-pointer
                        ${isSelected 
                          ? 'text-gray-900 dark:text-gray-100' 
                          : 'text-gray-700 dark:text-gray-300'
                        }
                      `}
                    >
                      {option.label}
                    </Label>
                  </div>
                  <p className={`
                    text-xs
                    ${isSelected 
                      ? 'text-gray-600 dark:text-gray-400' 
                      : 'text-gray-500 dark:text-gray-500'
                    }
                  `}>
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
