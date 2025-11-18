import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MapInfoBoxProps {
  name: string;
  address: string;
  placeId: string;
  onClose: () => void;
  isMobile?: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function MapInfoBox({
  name,
  address,
  placeId,
  onClose,
  isMobile = false,
  containerRef,
}: MapInfoBoxProps) {
  const navigate = useNavigate();

  const content = (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl w-full max-w-lg flex flex-row items-start border-2 border-gray-300 dark:border-gray-600">
      <div className="flex-1 min-w-0 pr-1.5 sm:pr-2">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-1 sm:mb-1.5 md:mb-2 line-clamp-2 leading-tight">
          {name}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 address-text leading-relaxed mb-2 sm:mb-2.5 md:mb-3 line-clamp-2">
          {address}
        </p>
        <Button
          variant="default"
          className="mt-1.5 sm:mt-2 md:mt-3 cursor-pointer text-xs sm:text-sm md:text-base w-full sm:w-auto h-9 sm:h-10 md:h-11 px-3 sm:px-4"
          onClick={() => navigate(`/details/${placeId}`)}
        >
          Ver Detalhes
        </Button>
      </div>
      <button
        onClick={onClose}
        className="ml-1.5 sm:ml-2 flex-shrink-0 cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        aria-label="Fechar"
      >
        <X size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className="relative mt-3 sm:mt-4 w-full flex justify-center px-2 sm:px-3 md:px-4 pointer-events-auto"
      >
        {content}
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 w-full flex justify-center px-3 sm:px-4 pb-3 sm:pb-4 z-[1000] pointer-events-auto">
      {content}
    </div>
  );
}

