import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_LIBRARIES,
} from "@/services/googleMaps";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
interface InfoBoxData {
  position: google.maps.LatLng;
  name: string;
  address: string;
  placeId: string;
}

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "8px",
};

const center = {
  lat: -23.5425,
  lng: -47.4561,
};

const campolimBounds = {
  north: -23.535,
  south: -23.55,
  east: -47.445,
  west: -47.465,
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

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  interface MapMouseEventWithPlaceId extends google.maps.MapMouseEvent {
    placeId?: string;
  }

  const handleMapClick = (event: MapMouseEventWithPlaceId) => {
    if (event.placeId && map && event.latLng) {
      event.stop();

      const position = new google.maps.LatLng(
        event.latLng.lat(),
        event.latLng.lng()
      );

      const service = new google.maps.places.PlacesService(map);
      service.getDetails(
        {
          placeId: event.placeId,
          fields: ["name", "formatted_address"],
        },
        (place, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place &&
            place.formatted_address &&
            place.name
          ) {
            setInfoBoxData({
              position,
              name: place.name,
              address: place.formatted_address,
              placeId: event.placeId!,
            });
          } else {
            console.error("Erro ao buscar detalhes do local:", status);
            setInfoBoxData(null);
          }
        }
      );
    } else {
      setInfoBoxData(null);
    }
  };

  if (loadError) return <p>Erro ao carregar o mapa</p>;
  if (!isLoaded) return <p>Carregando...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
      options={{
        restriction: {
          latLngBounds: campolimBounds,
          strictBounds: true,
        },
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
  );
}
