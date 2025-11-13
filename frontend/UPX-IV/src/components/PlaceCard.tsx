import { Card } from "@/components/ui/card";
import { FileText, Heart, MapPin } from "lucide-react";

interface PlaceCardProps {
  id: string;
  name: string;
  address?: string;
  rating?: number;
  types?: string[];
  reportsCount: number;
  votesCount: number;
  onClick: (placeId: string) => void;
}

export default function PlaceCard({
  id,
  name,
  address,
  rating,
  types,
  reportsCount,
  votesCount,
  onClick,
}: PlaceCardProps) {
  return (
    <Card
      className="p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(id)}
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-1.5 sm:mb-2 line-clamp-2">
              {name}
            </h3>
            {address && (
              <div className="flex items-start gap-1.5 sm:gap-2 text-base text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                <MapPin size={18} className="text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0 sm:w-6 sm:h-6" />
                <span className="line-clamp-2">{address}</span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-base text-gray-600 dark:text-gray-300">
              {rating && (
                <span>⭐ {rating.toFixed(1)}</span>
              )}
              {types && types.length > 0 && (
                <span className="capitalize">
                  {types[0].replace(/_/g, " ")}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 self-center">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <FileText size={22} className="text-blue-600 dark:text-blue-400 sm:w-8 sm:h-8" />
              <span className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                {reportsCount}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <Heart size={22} className="text-red-600 dark:text-red-400 sm:w-8 sm:h-8" />
              <span className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                {votesCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

