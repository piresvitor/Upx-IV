import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_LIBRARIES,
} from "@/services/googleMaps";
import { placeService } from "@/services/placeService";
import type { Place } from "@/services/placeService";

interface InfoBoxData {
  position: google.maps.LatLng;
  name: string;
  address: string;
  placeId: string; // UUID do backend
}

const containerStyle = { width: "100%", height: "100%", borderRadius: "8px" };
const center = { lat: -23.529, lng: -47.4686 }; // Av. Domingos Júlio, Campolim, Sorocaba - SP
const campolimBounds = {
  north: -23.520,
  south: -23.540,
  east: -47.460,
  west: -47.485,
};

export default function MapContainer() {
  const navigate = useNavigate();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places", ...GOOGLE_MAPS_LIBRARIES],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoBoxData, setInfoBoxData] = useState<InfoBoxData | null>(null);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => setMap(null), []);

  interface MapMouseEventWithPlaceId extends google.maps.MapMouseEvent {
    placeId?: string;
  }

  const handleMapClick = async (event: MapMouseEventWithPlaceId) => {
    if (!event.placeId || !map || !event.latLng) {
      setInfoBoxData(null);
      return;
    }

    event.stop();

    try {
      const place: Place = await placeService.checkOrCreate(event.placeId);

      const position = new google.maps.LatLng(place.latitude, place.longitude);

      setInfoBoxData({
        position,
        name: place.name,
        address: place.address,
        placeId: place.id,
      });
    } catch (err) {
      console.error("Erro ao verificar/criar local:", err);
      setInfoBoxData(null);
    }
  };

  if (loadError) return <p>Erro ao carregar o mapa</p>;
  if (!isLoaded) return <p>Carregando...</p>;

  return (
    <div className="h-[500px] lg:h-[700px] w-full lg:w-[90%] lg:mx-auto rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          restriction: { latLngBounds: campolimBounds, strictBounds: true },
          disableDefaultUI: false,
        }}
      >
      {infoBoxData && (
        <div className="absolute bottom-0 left-0 w-full flex justify-start px-4 pb-4">
          <div className="bg-white p-5 rounded-2xl shadow-lg w-[90%] max-w-lg flex flex-row items-start">
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{infoBoxData.name}</h2>
              <p className="text-sm text-muted-foreground">
                {infoBoxData.address}
              </p>
              <Button
                variant="default"
                className="mt-3 cursor-pointer"
                onClick={() => navigate(`/details/${infoBoxData.placeId}`)}
              >
                Ver Detalhes
              </Button>
            </div>
            <button
              onClick={() => setInfoBoxData(null)}
              className="ml-3 mt-1 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
      </GoogleMap>
    </div>
  );
}
