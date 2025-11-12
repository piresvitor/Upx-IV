import { useEffect, useState } from "react";
import { MapPin, MessageCircle } from "lucide-react";
import type { Place } from "@/services/placeService";
import { useGoogleMapsApi } from "@/hooks/useGoogleMapsApi";

interface PlaceDetailsProps {
  place: Place;
}

export default function PlaceDetails({ place }: PlaceDetailsProps) {
  const googleLoaded = useGoogleMapsApi();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // ✅ Ao montar, tenta recuperar do localStorage
  useEffect(() => {
    if (!place?.placeId) return;

    const cached = localStorage.getItem(`photo_${place.placeId}`);
    if (cached) setPhotoUrl(cached);
  }, [place]);

  useEffect(() => {
    if (!place?.placeId || !googleLoaded) return;

    const mapDiv = document.createElement("div");
    const map = new window.google.maps.Map(mapDiv);
    const service = new window.google.maps.places.PlacesService(map);

    service.getDetails(
      {
        placeId: place.placeId,
        fields: ["photos"],
      },
      (result, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          result?.photos?.length
        ) {
          const url = result.photos[0].getUrl({
            maxWidth: 900,
            maxHeight: 400,
          });

          setPhotoUrl(url);

          // ✅ Salva cache da imagem por placeId
          localStorage.setItem(`photo_${place.placeId}`, url);
        }
      }
    );
  }, [place, googleLoaded]);

  return (
    <div className="pb-10">
      <div className="grid lg:grid-cols-2 lg:gap-10 gap-5 items-start">
        <div className="w-full flex items-center justify-center">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={place.name}
              className="w-full h-auto object-contain rounded-2xl"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-2xl">
              Sem imagem disponível
            </div>
          )}
        </div>

        <div className="space-y-5">
          <h1 className="lg:text-2xl text-base font-semibold text-gray-800">
            {place.name ?? "Sem nome disponível"}
          </h1>

          <div className="space-y-1">
            <div className="flex flex-row gap-2">
              <div className="max-w-[20px]">
                <MapPin height={20} width={20} color="#2d8bba" />
              </div>
              <p className="text-gray-800 mb-2 text-base">
                {place.address ?? "Não informado"}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-row gap-2">
              <div className="max-w-[20px]">
                <MessageCircle height={20} width={20} color="#2d8bba" />
              </div>
              <p className="text-gray-800 mb-2 text-base">
                Total de comentários:
              </p>
              <p className="text-gray-800 mb-2 text-base">
                {place.reportsCount ?? "Não informado"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
