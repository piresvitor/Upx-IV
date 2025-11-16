import { CheckCircle2, XCircle, Minus } from "lucide-react";

interface ReportTypeSelectorProps {
  value: string;
  onChange: (type: string) => void;
  required?: boolean;
}

export function ReportTypeSelector({ value, onChange, required = true }: ReportTypeSelectorProps) {
  const types = [
    { 
      value: "positive", 
      label: "Experiência Positiva", 
      icon: CheckCircle2, 
      color: "green",
      description: "Local acessível e recomendado"
    },
    { 
      value: "negative", 
      label: "Experiência Negativa", 
      icon: XCircle, 
      color: "red",
      description: "Problemas de acessibilidade"
    },
    { 
      value: "neutral", 
      label: "Informativo/Neutro", 
      icon: Minus, 
      color: "gray",
      description: "Informações gerais"
    },
  ];

  const getTypeStyles = (typeColor: string, isSelected: boolean) => {
    const colorMap: Record<string, { 
      border: string; 
      bg: string; 
      text: string; 
      icon: string;
      textSecondary: string;
    }> = {
      green: {
        border: isSelected ? "border-green-500 dark:border-green-400" : "border-gray-200 dark:border-gray-700",
        bg: isSelected ? "bg-green-50 dark:bg-green-900/20" : "bg-white dark:bg-gray-800",
        text: isSelected ? "text-green-900 dark:text-green-200" : "text-gray-800 dark:text-gray-200",
        icon: isSelected ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500",
        textSecondary: isSelected ? "text-green-700 dark:text-green-300" : "text-gray-600 dark:text-gray-400",
      },
      red: {
        border: isSelected ? "border-red-500 dark:border-red-400" : "border-gray-200 dark:border-gray-700",
        bg: isSelected ? "bg-red-50 dark:bg-red-900/20" : "bg-white dark:bg-gray-800",
        text: isSelected ? "text-red-900 dark:text-red-200" : "text-gray-800 dark:text-gray-200",
        icon: isSelected ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-gray-500",
        textSecondary: isSelected ? "text-red-700 dark:text-red-300" : "text-gray-600 dark:text-gray-400",
      },
      gray: {
        // Usar azul para neutral para melhor visibilidade quando selecionado
        border: isSelected ? "border-blue-500 dark:border-blue-400" : "border-gray-200 dark:border-gray-700",
        bg: isSelected ? "bg-blue-50 dark:bg-blue-900/20" : "bg-white dark:bg-gray-800",
        text: isSelected ? "text-blue-900 dark:text-blue-200" : "text-gray-800 dark:text-gray-200",
        icon: isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500",
        textSecondary: isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-600 dark:text-gray-400",
      },
    };
    
    return colorMap[typeColor] || colorMap.gray;
  };

  return (
    <div className="space-y-2.5 lg:space-y-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Tipo de Relatório {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 lg:gap-3">
        {types.map((type) => {
          const Icon = type.icon;
          const isSelected = value === type.value;
          const styles = getTypeStyles(type.color, isSelected);
          
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={`
                p-3 lg:p-3.5 rounded-lg border-2 transition-all text-left
                hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm
                ${styles.border} ${styles.bg}
              `}
            >
              <div className="flex items-center gap-2.5 lg:gap-3">
                <Icon 
                  size={20} 
                  className={`flex-shrink-0 ${styles.icon}`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-xs lg:text-sm ${styles.text}`}>
                    {type.label}
                  </p>
                  <p className={`text-xs mt-0.5 lg:mt-1 leading-tight ${styles.textSecondary}`}>
                    {type.description}
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

