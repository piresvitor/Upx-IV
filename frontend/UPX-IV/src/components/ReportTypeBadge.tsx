import { CheckCircle2, XCircle, Minus, Accessibility } from "lucide-react";

interface ReportTypeBadgeProps {
  type: string;
  size?: "sm" | "md" | "lg";
}

export function ReportTypeBadge({ type, size = "md" }: ReportTypeBadgeProps) {
  const typeConfig: Record<string, { 
    label: string; 
    icon: typeof CheckCircle2; 
    className: string;
  }> = {
    positive: { 
      label: "Positivo", 
      icon: CheckCircle2, 
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700" 
    },
    negative: { 
      label: "Negativo", 
      icon: XCircle, 
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-700" 
    },
    neutral: { 
      label: "Neutro", 
      icon: Minus, 
      className: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600" 
    },
    accessibility: { 
      label: "Acessibilidade", 
      icon: Accessibility, 
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700" 
    },
    report: {
      label: "Geral",
      icon: Minus,
      className: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600"
    }
  };

  const config = typeConfig[type.toLowerCase()] || typeConfig.neutral;
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 gap-1",
    md: "text-sm px-2 py-1 gap-1.5",
    lg: "text-base px-3 py-1.5 gap-2",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium border
      ${config.className} 
      ${sizeClasses[size]}
    `}>
      <Icon size={iconSizes[size]} className="flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}

