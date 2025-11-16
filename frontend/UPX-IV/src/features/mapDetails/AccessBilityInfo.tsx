import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accessibility, Eye, ParkingSquare, Building2, CheckCircle2, XCircle } from "lucide-react";
import { placeService } from "@/services/placeService";
import type { AccessibilityResponse } from "@/services/placeService";

interface AccessibilityInfoProps {
  placeId: string;
}

export default function AccessibilityInfo({ placeId }: AccessibilityInfoProps) {
  const [stats, setStats] = useState<AccessibilityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await placeService.getAccessibilityStats(placeId);
        setStats(data);
      } catch (err) {
        console.error("Erro ao carregar estatísticas de acessibilidade:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [placeId]);

  if (loading) return <p className="dark:text-white">Carregando acessibilidade...</p>;
  if (!stats) return <p className="dark:text-white">Não foi possível carregar os dados.</p>;

  const {
    rampaAcesso,
    banheiroAcessivel,
    estacionamentoAcessivel,
    acessibilidadeVisual,
  } = stats.accessibilityStats;

  const accessibilityItems = [
    {
      id: "rampa",
      label: "Rampa de acesso",
      description: "Rampa disponível para facilitar o acesso de cadeirantes e pessoas com mobilidade reduzida.",
      icon: Accessibility,
      hasMajority: rampaAcesso.hasMajority,
      color: "blue",
    },
    {
      id: "banheiro",
      label: "Banheiro acessível",
      description: "Banheiro adaptado com barras de apoio e espaço adequado para cadeira de rodas.",
      icon: Building2,
      hasMajority: banheiroAcessivel.hasMajority,
      color: "green",
    },
    {
      id: "vagas",
      label: "Vagas PCD",
      description: "Vagas reservadas próximas à entrada para pessoas com deficiência ou mobilidade reduzida.",
      icon: ParkingSquare,
      hasMajority: estacionamentoAcessivel.hasMajority,
      color: "purple",
    },
    {
      id: "visual",
      label: "Acessibilidade visual",
      description: "Sinalização e recursos visuais para melhor orientação de pessoas com deficiência visual.",
      icon: Eye,
      hasMajority: acessibilidadeVisual.hasMajority,
      color: "orange",
    },
  ];

  const getColorClasses = (color: string, hasMajority: boolean) => {
    const colorMap: Record<string, { 
      border: string; 
      bg: string; 
      iconBg: string;
      icon: string;
    }> = {
      blue: {
        border: hasMajority ? "border-blue-500 dark:border-blue-400" : "border-gray-300 dark:border-gray-600",
        bg: hasMajority ? "bg-blue-50 dark:bg-blue-900/20" : "bg-gray-50 dark:bg-gray-800/50",
        iconBg: hasMajority ? "bg-blue-100 dark:bg-blue-900/40" : "bg-gray-200 dark:bg-gray-700",
        icon: hasMajority ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400",
      },
      green: {
        border: hasMajority ? "border-green-500 dark:border-green-400" : "border-gray-300 dark:border-gray-600",
        bg: hasMajority ? "bg-green-50 dark:bg-green-900/20" : "bg-gray-50 dark:bg-gray-800/50",
        iconBg: hasMajority ? "bg-green-100 dark:bg-green-900/40" : "bg-gray-200 dark:bg-gray-700",
        icon: hasMajority ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400",
      },
      purple: {
        border: hasMajority ? "border-purple-500 dark:border-purple-400" : "border-gray-300 dark:border-gray-600",
        bg: hasMajority ? "bg-purple-50 dark:bg-purple-900/20" : "bg-gray-50 dark:bg-gray-800/50",
        iconBg: hasMajority ? "bg-purple-100 dark:bg-purple-900/40" : "bg-gray-200 dark:bg-gray-700",
        icon: hasMajority ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400",
      },
      orange: {
        border: hasMajority ? "border-orange-500 dark:border-orange-400" : "border-gray-300 dark:border-gray-600",
        bg: hasMajority ? "bg-orange-50 dark:bg-orange-900/20" : "bg-gray-50 dark:bg-gray-800/50",
        iconBg: hasMajority ? "bg-orange-100 dark:bg-orange-900/40" : "bg-gray-200 dark:bg-gray-700",
        icon: hasMajority ? "text-orange-600 dark:text-orange-400" : "text-gray-500 dark:text-gray-400",
      },
    };
    
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="flex justify-center flex-col items-center gap-4 sm:gap-6 pb-6 sm:pb-10 w-full">
      <h1 className="lg:text-2xl text-lg font-semibold text-gray-800 dark:text-white text-center sm:text-left">
        Informações de Acessibilidade
      </h1>

      <Card className="w-full max-w-4xl lg:p-8 p-4 sm:p-6">
        {/* Mobile Layout - Cards individuais */}
        <div className="block lg:hidden space-y-3 sm:space-y-4">
          {accessibilityItems.map((item) => {
            const Icon = item.icon;
            const colors = getColorClasses(item.color, item.hasMajority);
            const StatusIcon = item.hasMajority ? CheckCircle2 : XCircle;
            
            return (
              <div
                key={item.id}
                className={`
                  rounded-lg border-2 p-4 transition-all
                  ${colors.border} ${colors.bg}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                    ${colors.iconBg}
                  `}>
                    <Icon size={24} className={colors.icon} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {item.label}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusIcon 
                          size={18} 
                          className={item.hasMajority ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}
                        />
                        <Badge
                          variant={
                            item.hasMajority
                              ? "hasAccessibility"
                              : "hasntAccessibility"
                          }
                          className="rounded-full px-2.5 py-0.5 text-xs sm:text-sm"
                        >
                          {item.hasMajority ? "Disponível" : "Indisponível"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Layout - Grid 2 colunas */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div>
            <ul className="space-y-6">
              {accessibilityItems.slice(0, 2).map((item) => {
                const Icon = item.icon;
                const colors = getColorClasses(item.color, item.hasMajority);
                const StatusIcon = item.hasMajority ? CheckCircle2 : XCircle;
                
                return (
                  <li key={item.id} className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${colors.iconBg}
                      `}>
                        <Icon size={20} className={colors.icon} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                        {item.label}
                      </h3>
                      <div className="flex items-center gap-2">
                        <StatusIcon 
                          size={18} 
                          className={item.hasMajority ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}
                        />
                        <Badge
                          variant={
                            item.hasMajority
                              ? "hasAccessibility"
                              : "hasntAccessibility"
                          }
                          className="rounded-full px-3 py-1"
                        >
                          {item.hasMajority ? "Disponível" : "Indisponível"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed pl-[52px]">
                      {item.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <ul className="space-y-6">
              {accessibilityItems.slice(2).map((item) => {
                const Icon = item.icon;
                const colors = getColorClasses(item.color, item.hasMajority);
                const StatusIcon = item.hasMajority ? CheckCircle2 : XCircle;
                
                return (
                  <li key={item.id} className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${colors.iconBg}
                      `}>
                        <Icon size={20} className={colors.icon} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                        {item.label}
                      </h3>
                      <div className="flex items-center gap-2">
                        <StatusIcon 
                          size={18} 
                          className={item.hasMajority ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}
                        />
                        <Badge
                          variant={
                            item.hasMajority
                              ? "hasAccessibility"
                              : "hasntAccessibility"
                          }
                          className="rounded-full px-3 py-1"
                        >
                          {item.hasMajority ? "Disponível" : "Indisponível"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed pl-[52px]">
                      {item.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
