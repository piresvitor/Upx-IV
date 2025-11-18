import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useState, useCallback, useEffect, useRef } from "react";
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

interface MapContainerProps {
  selectedPlace?: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    placeId: string;
  } | null;
  onPlaceSelected?: () => void;
}

const containerStyle = { width: "100%", height: "100%", borderRadius: "8px" };
const center = { lat: -23.529, lng: -47.4686 }; // Av. Domingos Júlio, Campolim, Sorocaba - SP
const campolimBounds = {
  north: -23.460,  
  south: -23.595,  
  east: -47.380,   
  west: -47.568,   
};

export default function MapContainer({ selectedPlace, onPlaceSelected }: MapContainerProps = {}) {
  const navigate = useNavigate();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places", ...GOOGLE_MAPS_LIBRARIES],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoBoxData, setInfoBoxData] = useState<InfoBoxData | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const infoBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll automático para o InfoBox no mobile quando ele aparecer
  useEffect(() => {
    if (infoBoxData && isMobile && infoBoxRef.current) {
      setTimeout(() => {
        infoBoxRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "end",
          inline: "nearest"
        });
      }, 100);
    }
  }, [infoBoxData, isMobile]);

  // Efeito para atualizar mapa quando um lugar é selecionado
  useEffect(() => {
    if (selectedPlace && map) {
      const position = new google.maps.LatLng(
        selectedPlace.latitude,
        selectedPlace.longitude
      );

      // Centralizar mapa no local com animação suave
      map.panTo(position);
      map.setZoom(17);

      // Abrir popup do local
      setInfoBoxData({
        position,
        name: selectedPlace.name,
        address: selectedPlace.address,
        placeId: selectedPlace.id,
      });

      // Callback opcional
      if (onPlaceSelected) {
        onPlaceSelected();
      }
    }
  }, [selectedPlace, map, onPlaceSelected]);

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

  if (loadError) return <p className="text-base text-gray-800 dark:text-gray-100">Erro ao carregar o mapa</p>;
  if (!isLoaded) return <p className="text-base text-gray-800 dark:text-gray-100">Carregando...</p>;

  return (
    <div className="relative">
      <div className="h-[600px] sm:h-[650px] lg:h-[700px] w-full lg:w-[90%] lg:mx-auto rounded-lg overflow-hidden relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={isMobile ? 15 : 16}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            restriction: { latLngBounds: campolimBounds, strictBounds: true },
            disableDefaultUI: false,
            gestureHandling: "greedy", // Melhor controle de gestos no mobile
            zoomControl: true,
            fullscreenControl: false,
          }}
        />
        {!isMobile && infoBoxData && (
          <div className="absolute bottom-0 left-0 right-0 w-full flex justify-center px-3 sm:px-4 pb-3 sm:pb-4 z-[1000] pointer-events-auto">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg flex flex-row items-start border-2 border-gray-300 dark:border-gray-600">
              <div className="flex-1 min-w-0 pr-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-1.5 sm:mb-2 line-clamp-2">{infoBoxData.name}</h2>
                <p className="text-sm sm:text-base text-gray-700 address-text leading-[1.5] mb-2 sm:mb-3 line-clamp-2">
                  {infoBoxData.address}
                </p>
                <Button
                  variant="default"
                  className="mt-2 sm:mt-3 cursor-pointer text-sm sm:text-base w-full sm:w-auto h-10 sm:h-11"
                  onClick={() => navigate(`/details/${infoBoxData.placeId}`)}
                >
                  Ver Detalhes
                </Button>
              </div>
              <button
                onClick={() => setInfoBoxData(null)}
                className="ml-2 flex-shrink-0 cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label="Fechar"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
      {isMobile && infoBoxData && (
        <div 
          ref={infoBoxRef}
          className="relative mt-4 w-full flex justify-center px-3 sm:px-4 pointer-events-auto"
        >
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg flex flex-row items-start border-2 border-gray-300 dark:border-gray-600">
            <div className="flex-1 min-w-0 pr-2">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-1.5 sm:mb-2 line-clamp-2">{infoBoxData.name}</h2>
              <p className="text-sm sm:text-base text-gray-700 address-text leading-[1.5] mb-2 sm:mb-3 line-clamp-2">
                {infoBoxData.address}
              </p>
              <Button
                variant="default"
                className="mt-2 sm:mt-3 cursor-pointer text-sm sm:text-base w-full sm:w-auto h-10 sm:h-11"
                onClick={() => navigate(`/details/${infoBoxData.placeId}`)}
              >
                Ver Detalhes
              </Button>
            </div>
            <button
              onClick={() => setInfoBoxData(null)}
              className="ml-2 flex-shrink-0 cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Fechar"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
