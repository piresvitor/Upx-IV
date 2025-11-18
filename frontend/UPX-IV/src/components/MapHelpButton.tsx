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
    <div className="fixed bottom-6 right-6 z-50">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="rounded-full w-12 h-12 sm:w-14 sm:h-14 
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
            <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm dark:drop-shadow-md" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl dark:text-white">
              Como usar o mapa
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-2 space-y-3 text-gray-700 dark:text-white">
              <p>
                Navegue pelo mapa para encontrar o local que você deseja visualizar.
              </p>
              <p>
                Ao clicar em um marcador no mapa, um popup será exibido com informações básicas sobre aquele local.
              </p>
              <p>
                Clique no popup para ser redirecionado à página de detalhes, onde você poderá:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-gray-700 dark:text-white">
                <li>Ver informações completas sobre acessibilidade</li>
                <li>Visualizar comentários e avaliações de outros usuários</li>
                <li>Deixar seu próprio comentário e avaliação</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

