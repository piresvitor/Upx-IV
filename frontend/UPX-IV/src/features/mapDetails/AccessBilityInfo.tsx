import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { AccessibilityIcon, Eye, ParkingSquare, Users } from "lucide-react";

interface AccessbilityInfoProps {
  hasRamp?: boolean;
  hasAccessibleBathroom?: boolean;
  hasAccessibleParking?: boolean;
  hasVisualAccessibility?: boolean;
  hasSensoryZone?: boolean;
}

export default function AccessBilityInfo({
  hasRamp = false,
  hasAccessibleBathroom = true,
  hasAccessibleParking = true,
  hasVisualAccessibility = false,
}: AccessbilityInfoProps) {
  return (
    <div className=" flex justify-center  flex-col items-center gap-6 pb-10">
      <h1 className="lg:text-2xl text-base font-semibold text-gray-800">
        Informações de Acessibilidade
      </h1>
      <Card title="Acessibilidade" className="max-w-200 lg:p-8 p-4">
        <div className="grid lg:grid-cols-2 lg:space-y-0 space-y-5 lg:gap-15">
          <div>
            <ul className="space-y-5 text-gray-700">
              <li className=" flex flex-col  gap-1">
                <div className="flex flex-row gap-1">
                  <AccessibilityIcon
                    height={18}
                    color={hasRamp ? "#2d8bba" : "#404040"}
                  />
                  <p className="lg:text-base text-sm font-medium text-neutral-700 mr-3">
                    Rampa de acesso
                  </p>
                  <Badge
                    variant={
                      hasRamp ? "hasAccessibility" : "hasntAccessibility"
                    }
                    className="rounded-xl px-1 py-0.15 "
                  >
                    <p className="text-[12px]">
                      {hasRamp ? "Disponível" : "Indisponível"}
                    </p>
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Rampa disponível para facilitar o acesso de cadeirantes e
                  pessoas com mobilidade reduzida.
                </p>
              </li>
              <li className=" flex flex-col  gap-1">
                <div className="flex flex-row gap-1">
                  <Users
                    height={18}
                    color={hasAccessibleBathroom ? "#2d8bba" : "#404040"}
                  />
                  <p className="lg:text-base text-sm font-medium text-neutral-700 mr-3">
                    Banheiro acessível
                  </p>
                  <Badge
                    variant={
                      hasAccessibleBathroom
                        ? "hasAccessibility"
                        : "hasntAccessibility"
                    }
                    className="rounded-xl"
                  >
                    <p className="text-xs">
                      {hasAccessibleBathroom ? "Disponível" : "Indisponível"}
                    </p>
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Banheiro adaptado com barras de apoio e espaço adequado para
                  cadeira de rodas.{" "}
                </p>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-5 text-gray-700">
              <li className=" flex flex-col  gap-1">
                <div className="flex flex-row gap-1">
                  <ParkingSquare
                    height={18}
                    color={hasAccessibleParking ? "#2d8bba" : "#404040"}
                  />
                  <p className="lg:text-base text-sm font-medium text-neutral-700 mr-3">
                    Estacionamento
                  </p>
                  <Badge
                    variant={
                      hasAccessibleParking
                        ? "hasAccessibility"
                        : "hasntAccessibility"
                    }
                    className="rounded-xl"
                  >
                    <p className="text-xs">
                      {hasAccessibleParking ? "Disponível" : "Indisponível"}
                    </p>
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 ">
                  Vagas reservadas próximas à entrada para pessoas com
                  deficiência ou mobilidade reduzida.
                </p>
              </li>
              <li className=" flex flex-col  gap-1">
                <div className="flex flex-row gap-1">
                  <Eye
                    height={18}
                    color={hasVisualAccessibility ? "#2d8bba" : "#404040"}
                  />
                  <p className="lg:text-base text-sm font-medium text-neutral-700 mr-3">
                    Visual
                  </p>
                  <Badge
                    variant={
                      hasVisualAccessibility
                        ? "hasAccessibility"
                        : "hasntAccessibility"
                    }
                    className="rounded-xl"
                  >
                    <p className="text-xs">
                      {hasVisualAccessibility ? "Disponível" : "Indisponível"}
                    </p>
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {" "}
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
