import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Phone } from "lucide-react";
import { Clock } from "lucide-react";

interface PlaceDetails {
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  opening_hours?: { weekday_text: string[] };
  photos?: google.maps.places.PlacePhoto[];
  website?: string;
  rating?: number;
  user_ratings_total?: number;
}

export default function PlaceDetails() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!placeId || !window.google) return;

    const mapDiv = document.createElement("div");
    const map = new window.google.maps.Map(mapDiv);
    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      placeId,
      fields: [
        "name",
        "formatted_address",
        "formatted_phone_number",
        "opening_hours",
        "photos",
        "website",
        "rating",
        "user_ratings_total",
      ],
    };

    service.getDetails(request, (result, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        result
      ) {
        setPlace({
          name: result.name,
          formatted_address: result.formatted_address,
          formatted_phone_number: result.formatted_phone_number,
          opening_hours: {
            weekday_text: result.opening_hours?.weekday_text ?? [],
          },
          photos: result.photos,
          website: result.website,
          rating: result.rating,
          user_ratings_total: result.user_ratings_total,
        });
      } else {
        console.error("Erro ao buscar detalhes:", status);
      }
      setLoading(false);
    });
  }, [placeId]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">Carregando detalhes...</p>
    );
  }

  if (!place) {
    return (
      <p className="text-center text-red-500 mt-10">
        Não foi possível carregar os detalhes do local.
      </p>
    );
  }

  return (
    <div className=" p-6 pb-10">
      <Button
        onClick={() => navigate("/map")}
        variant={"ghost"}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 cursor-pointer"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Voltar ao mapa
      </Button>
      <div className="grid grid-cols-2 gap-10">
        <div>
          {place.photos?.length ? (
            <img
              src={place.photos[0].getUrl({ maxWidth: 900, maxHeight: 400 })}
              alt={place.name}
              className="w-full h-90 object-cover rounded-2xl"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
              Sem imagem disponível
            </div>
          )}
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {place.name ?? "Sem nome disponível"}
            </h1>
          </div>
          <div className="space-y-1">
            <div className="flex flex-row gap-2">
              <MapPin height={20} width={20} color="#2d8bba" />
              <p className="text-gray-700 mb-2">
                {place.formatted_address ?? "Não informado"}
              </p>
            </div>

            <div className="flex flex-row gap-2">
              <Phone height={20} width={20} color="#2d8bba" />
              <p className="text-gray-700 mb-2">
                {place.formatted_phone_number ?? "Não informado"}
              </p>
            </div>

            <div className="flex flex-row gap-2">
              <Clock height={20} width={20} color="#2d8bba" />

              {place.opening_hours && (
                <div>
                  <ul>
                    {place.opening_hours.weekday_text.map((dia, i) => (
                      <li key={i} className="text-gray-700">
                        {dia}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
