import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccessibilityIcon, Eye, ParkingSquare, Users } from "lucide-react";
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

  if (loading) return <p>Carregando acessibilidade...</p>;
  if (!stats) return <p>Não foi possível carregar os dados.</p>;

  const {
    rampaAcesso,
    banheiroAcessivel,
    estacionamentoAcessivel,
    acessibilidadeVisual,
  } = stats.accessibilityStats;

  return (
    <div className="flex justify-center flex-col items-center gap-6 pb-10">
      <h1 className="lg:text-2xl text-base font-semibold text-gray-800">
        Informações de Acessibilidade
      </h1>

      <Card title="Acessibilidade" className="max-w-200 lg:p-8 p-4">
        <div className="grid lg:grid-cols-2 lg:space-y-0 space-y-5 lg:gap-15">
          <div>
            <ul className="space-y-5 text-gray-700">
              <li className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 items-center">
                  <AccessibilityIcon
                    height={18}
                    color={rampaAcesso.hasMajority ? "#2d8bba" : "#404040"}
                  />
                  <p className="text-base font-medium text-gray-800 mr-3">
                    Rampa de acesso
                  </p>
                  <Badge
                    variant={
                      rampaAcesso.hasMajority
                        ? "hasAccessibility"
                        : "hasntAccessibility"
                    }
                    className="rounded-xl px-1 py-0.15"
                  >
                    <p className="text-base">
                      {rampaAcesso.hasMajority ? "Disponível" : "Indisponível"}
                    </p>
                  </Badge>
                </div>
                <p className="text-base text-gray-700 leading-[1.5]">
                  Rampa disponível para facilitar o acesso de cadeirantes e
                  pessoas com mobilidade reduzida.
                </p>
              </li>

              <li className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 items-center">
                  <Users
                    height={18}
                    color={
                      banheiroAcessivel.hasMajority ? "#2d8bba" : "#404040"
                    }
                  />
                  <p className="text-base font-medium text-gray-800 mr-3">
                    Banheiro acessível
                  </p>
                  <Badge
                    variant={
                      banheiroAcessivel.hasMajority
                        ? "hasAccessibility"
                        : "hasntAccessibility"
                    }
                    className="rounded-xl"
                  >
                    <p className="text-base">
                      {banheiroAcessivel.hasMajority
                        ? "Disponível"
                        : "Indisponível"}
                    </p>
                  </Badge>
                </div>
                <p className="text-base text-gray-700 leading-[1.5]">
                  Banheiro adaptado com barras de apoio e espaço adequado para
                  cadeira de rodas.
                </p>
              </li>
            </ul>
          </div>

          <div>
            <ul className="space-y-5 text-gray-700">
              <li className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 items-center">
                  <ParkingSquare
                    height={18}
                    color={
                      estacionamentoAcessivel.hasMajority
                        ? "#2d8bba"
                        : "#404040"
                    }
                  />
                  <p className="text-base font-medium text-gray-800 mr-3">
                    Estacionamento
                  </p>
                  <Badge
                    variant={
                      estacionamentoAcessivel.hasMajority
                        ? "hasAccessibility"
                        : "hasntAccessibility"
                    }
                    className="rounded-xl"
                  >
                    <p className="text-base">
                      {estacionamentoAcessivel.hasMajority
                        ? "Disponível"
                        : "Indisponível"}
                    </p>
                  </Badge>
                </div>
                <p className="text-base text-gray-700 leading-[1.5]">
                  Vagas reservadas próximas à entrada para pessoas com
                  deficiência ou mobilidade reduzida.
                </p>
              </li>

              <li className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 items-center">
                  <Eye
                    height={18}
                    color={
                      acessibilidadeVisual.hasMajority ? "#2d8bba" : "#404040"
                    }
                  />
                  <p className="text-base font-medium text-gray-800 mr-3">
                    Visual
                  </p>
                  <Badge
                    variant={
                      acessibilidadeVisual.hasMajority
                        ? "hasAccessibility"
                        : "hasntAccessibility"
                    }
                    className="rounded-xl"
                  >
                    <p className="text-base">
                      {acessibilidadeVisual.hasMajority
                        ? "Disponível"
                        : "Indisponível"}
                    </p>
                  </Badge>
                </div>
                <p className="text-base text-gray-700 leading-[1.5]">
                  Sinalização e recursos visuais para melhor orientação de
                  pessoas com deficiência visual.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
