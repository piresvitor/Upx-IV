import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Star } from "lucide-react";

import { placeService } from "@/services/placeService";
import type { Place } from "@/services/placeService";

interface PlaceDetailsProps {
  onPlaceLoaded?: (place: Place) => void;
}

export default function PlaceDetails({ onPlaceLoaded }: PlaceDetailsProps) {
  const { placeId } = useParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [googlePlacePhotos, setGooglePlacePhotos] = useState<
    google.maps.places.PlacePhoto[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!placeId) return;

    const fetchPlace = async () => {
      try {
        // 1. Buscar detalhes do backend
        const data = await placeService.getDetails(placeId);
        setPlace(data);
        if (onPlaceLoaded) onPlaceLoaded(data);

        // 2. Buscar fotos do Google Places
        if (window.google) {
          const mapDiv = document.createElement("div");
          const map = new window.google.maps.Map(mapDiv);
          const service = new window.google.maps.places.PlacesService(map);

          service.getDetails(
            {
              placeId: data.placeId,
              fields: ["photos"],
            },
            (result, status) => {
              if (
                status === window.google.maps.places.PlacesServiceStatus.OK &&
                result?.photos
              ) {
                setGooglePlacePhotos(result.photos);
              }
            }
          );
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes do local:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [placeId]);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Carregando detalhes...</p>
    );

  if (!place)
    return (
      <p className="text-center text-red-500 mt-10">
        Não foi possível carregar os detalhes do local.
      </p>
    );

  return (
    <div className="pb-10">
      <div className="grid lg:grid-cols-2 lg:gap-10 gap-5 items-start">
        {/* Imagem do local */}
        <div className="w-full flex items-center justify-center">
          {googlePlacePhotos?.length ? (
            <img
              src={googlePlacePhotos[0].getUrl({
                maxWidth: 900,
                maxHeight: 400,
              })}
              alt={place.name}
              className="w-full h-auto object-contain rounded-2xl"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-2xl">
              Sem imagem disponível
            </div>
          )}
        </div>

        {/* Informações do local */}
        <div className="space-y-5">
          <h1 className="lg:text-2xl text-base font-semibold text-gray-800">
            {place.name ?? "Sem nome disponível"}
          </h1>

          <div className="space-y-1">
            {/* Endereço */}
            <div className="flex flex-row gap-2">
              <div className="max-w-[20px]">
                <MapPin height={20} width={20} color="#2d8bba" />
              </div>
              <p className="text-gray-700 mb-2 lg:text-base text-sm">
                {place.address ?? "Não informado"}
              </p>
            </div>

            <div className="flex flex-row gap-2">
              <div className="max-w-[20px]">
                <Star height={20} width={20} color="#2d8bba" />
              </div>
              <p className="text-gray-700 mb-2 lg:text-base text-sm">
                {place.rating ?? "Não informado"} ({place.userRatingsTotal ?? 0}
                )
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
