import { GoogleMap, useLoadScript, InfoBox } from "@react-google-maps/api";
import { useState, useCallback } from "react";

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
}

const containerStyle = {
  width: "100%",
  height: "500px",
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
        <InfoBox
          position={infoBoxData.position}
          options={{
            enableEventPropagation: true,
            pixelOffset: new google.maps.Size(-125, -100),
          }}
        >
          <div className="bg-white p-5 rounded-2xl flex flex-row ">
            <div className="w-[350px]">
              <div className="mb-2">
                <h2 className="text-xl">{infoBoxData.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {infoBoxData.address}
                </p>
              </div>
              <Button variant={"default"} className="cursor-pointer">
                Ver Detalhes
              </Button>
            </div>
            <div className="items-start flex">
              <button
                onClick={() => setInfoBoxData(null)}
                className="cursor-pointer "
              >
                <X height={20} width={20} />
              </button>
            </div>
          </div>
        </InfoBox>
      )}
    </GoogleMap>
  );
}
