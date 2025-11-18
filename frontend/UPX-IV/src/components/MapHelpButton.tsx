import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MapHelpButtonProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MapHelpButton({
  isOpen,
  onOpenChange,
}: MapHelpButtonProps) {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="rounded-full w-11 h-11 sm:w-14 sm:h-14 
              shadow-lg hover:shadow-xl 
              dark:shadow-2xl dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]
              transition-all duration-300
              bg-primary hover:bg-primary-dark 
              dark:bg-blue-600 dark:hover:bg-blue-500
              text-white dark:text-white
              border-2 border-transparent
              dark:border-blue-400/30
              hover:scale-110 active:scale-95
              backdrop-blur-sm"
            aria-label="Como usar o mapa"
          >
            <HelpCircle className="w-5 h-5 sm:w-7 sm:h-7 drop-shadow-sm dark:drop-shadow-md" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 m-4 sm:m-0">
          <DialogHeader className="space-y-3 sm:space-y-4">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl dark:text-white pr-6 sm:pr-0">
              Como usar o mapa
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base leading-relaxed pt-1 sm:pt-2 space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-200">
              {/* Busca de Locais */}
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                  🔍 Buscar Locais
                </h3>
                <p className="text-sm sm:text-base">
                  Use o campo de busca no topo da página para encontrar locais por nome ou endereço (ex: "Shopping", "Hospital", "Restaurante").
                </p>
                <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <li>Digite pelo menos 3 caracteres para iniciar a busca</li>
                  <li>Os resultados aparecem automaticamente enquanto você digita</li>
                  <li>Seu histórico de buscas recentes é salvo (até 5 buscas)</li>
                  <li>A busca é limitada à cidade de Sorocaba, SP</li>
                </ul>
              </div>

              {/* Sistema de Pins */}
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                  📍 Marcadores (Pins)
                </h3>
                <p className="text-sm sm:text-base">
                  Use o botão ao lado da busca para ativar ou desativar os marcadores no mapa.
                </p>
                <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <li>Os marcadores aparecem apenas em locais que possuem relatórios/comentários</li>
                  <li>Um marcador por local (sem duplicatas)</li>
                  <li>Clique em um marcador para ver informações do local</li>
                  <li>O mapa centraliza automaticamente ao clicar em um marcador</li>
                </ul>
              </div>

              {/* Navegação no Mapa */}
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                  🗺️ Navegação
                </h3>
                <p className="text-sm sm:text-base">
                  Você pode navegar pelo mapa de diferentes formas:
                </p>
                <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <li>Clique em qualquer lugar do mapa para criar ou visualizar um local</li>
                  <li>Clique em marcadores para ver informações detalhadas</li>
                  <li>Use os controles de zoom para aproximar ou afastar</li>
                </ul>
              </div>

              {/* Popup e Detalhes */}
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                  ℹ️ Informações do Local
                </h3>
                <p className="text-sm sm:text-base">
                  Ao clicar em um local ou marcador, um popup será exibido. Clique em "Ver Detalhes" para:
                </p>
                <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <li>Ver informações completas sobre acessibilidade</li>
                  <li>Visualizar comentários e avaliações de outros usuários</li>
                  <li>Deixar seu próprio comentário e avaliação</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

