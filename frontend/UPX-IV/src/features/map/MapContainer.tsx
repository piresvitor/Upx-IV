import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useState, useCallback, useEffect, useRef } from "react";

import MapInfoBox from "./MapInfoBox";

import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_LIBRARIES,
} from "@/services/googleMaps";
import { placeService } from "@/services/placeService";
import type { Place, PlaceWithReports } from "@/services/placeService";

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
  showPins?: boolean;
  onInfoBoxChange?: (hasInfoBox: boolean) => void;
}

const containerStyle = { width: "100%", height: "100%", borderRadius: "8px" };
const center = { lat: -23.529, lng: -47.4686 }; // Av. Domingos Júlio, Campolim, Sorocaba - SP
const campolimBounds = {
  north: -23.460,  
  south: -23.595,  
  east: -47.380,   
  west: -47.568,   
};

export default function MapContainer({ selectedPlace, onPlaceSelected, showPins = false, onInfoBoxChange }: MapContainerProps = {}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES, // Usar diretamente a constante (já contém "places")
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoBoxData, setInfoBoxData] = useState<InfoBoxData | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [placesWithReports, setPlacesWithReports] = useState<PlaceWithReports[]>([]);
  const infoBoxRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const markerClickRef = useRef<boolean>(false);

  // Notificar o componente pai quando o infoBox mudar
  useEffect(() => {
    onInfoBoxChange?.(infoBoxData !== null);
  }, [infoBoxData, onInfoBoxChange]);

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

  // Buscar lugares com relatórios quando os pins são ativados
  useEffect(() => {
    if (!showPins || !isLoaded) {
      // Se os pins estão desativados, limpar marcadores
      markersRef.current.forEach(marker => {
        google.maps.event.clearListeners(marker, "click");
        marker.setMap(null);
      });
      markersRef.current = [];
      setPlacesWithReports([]);
      return;
    }

    const loadPlacesWithReports = async () => {
      try {
        // Buscar todos os lugares com relatórios (sem limite de página para mostrar todos)
        let allPlaces: PlaceWithReports[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const result = await placeService.getPlacesWithReports(page, 15); // Limite máximo é 15
          allPlaces = [...allPlaces, ...result.places];
          
          if (page >= result.pagination.totalPages) {
            hasMore = false;
          } else {
            page++;
          }
        }

        // Filtrar apenas lugares com relatórios (reportsCount > 0)
        const placesWithReportsOnly = allPlaces.filter(p => p.reportsCount > 0);
        setPlacesWithReports(placesWithReportsOnly);
      } catch (error) {
        console.error("Erro ao carregar lugares com relatórios:", error);
        setPlacesWithReports([]);
      }
    };

    loadPlacesWithReports();
  }, [showPins, isLoaded]);

  // Criar marcadores para lugares com relatórios
  useEffect(() => {
    if (!map || !isLoaded || !showPins || placesWithReports.length === 0) {
      // Limpar marcadores se não deve mostrar ou não há lugares
      markersRef.current.forEach(marker => {
        google.maps.event.clearListeners(marker, "click");
        marker.setMap(null);
      });
      markersRef.current = [];
      return;
    }

    // Limpar marcadores anteriores
    markersRef.current.forEach(marker => {
      google.maps.event.clearListeners(marker, "click");
      marker.setMap(null);
    });
    markersRef.current = [];

    // Criar novos marcadores apenas para lugares com relatórios
    const newMarkers = placesWithReports.map(place => {
      const marker = new google.maps.Marker({
        position: { lat: place.latitude, lng: place.longitude },
        map: map,
        title: `${place.name} - ${place.reportsCount} relatório(s)`,
        animation: google.maps.Animation.DROP,
      });

      // Adicionar listener de clique no marcador
      marker.addListener("click", () => {
        // Marcar que foi um clique no marcador
        markerClickRef.current = true;
        
        const position = new google.maps.LatLng(place.latitude, place.longitude);
        setInfoBoxData({
          position,
          name: place.name,
          address: place.address || "",
          placeId: place.id,
        });
        
        // Centralizar no marcador
        map.panTo(position);
        map.setZoom(17);
        
        // Resetar a flag após um pequeno delay
        setTimeout(() => {
          markerClickRef.current = false;
        }, 100);
      });

      return marker;
    });

    markersRef.current = newMarkers;

    return () => {
      markersRef.current.forEach(marker => {
        google.maps.event.clearListeners(marker, "click");
        marker.setMap(null);
      });
      markersRef.current = [];
    };
  }, [map, isLoaded, showPins, placesWithReports]);


  // Efeito para atualizar mapa quando um lugar é selecionado (busca)
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
    if (!map || !event.latLng) {
      // Se clicar em área vazia, fechar popup
      setInfoBoxData(null);
      return;
    }

    // Se foi um clique em um marcador, ignorar o clique do mapa
    if (markerClickRef.current) {
      return;
    }

    // Se clicar em um lugar do Google Maps (com placeId), criar/verificar
    if (event.placeId) {
      if (event.stop) {
        event.stop();
      }

      try {
        const place: Place = await placeService.checkOrCreate(event.placeId);

        const position = new google.maps.LatLng(place.latitude, place.longitude);

        setInfoBoxData({
          position,
          name: place.name,
          address: place.address || "",
          placeId: place.id,
        });
      } catch (err) {
        console.error("Erro ao verificar/criar local:", err);
        setInfoBoxData(null);
      }
    } else {
      // Se clicar em área vazia do mapa, fechar popup
      setInfoBoxData(null);
    }
  };

  if (loadError) return <p className="text-base text-gray-800 dark:text-gray-100">Erro ao carregar o mapa</p>;
  if (!isLoaded) return <p className="text-base text-gray-800 dark:text-gray-100">Carregando...</p>;

  return (
    <div className="relative">
      <div className="h-[500px] sm:h-[600px] md:h-[650px] lg:h-[700px] w-full lg:w-[90%] lg:mx-auto rounded-lg overflow-hidden relative">
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
          <MapInfoBox
            name={infoBoxData.name}
            address={infoBoxData.address}
            placeId={infoBoxData.placeId}
            onClose={() => setInfoBoxData(null)}
            isMobile={false}
          />
        )}
      </div>
      {isMobile && infoBoxData && (
        <MapInfoBox
          name={infoBoxData.name}
          address={infoBoxData.address}
          placeId={infoBoxData.placeId}
          onClose={() => setInfoBoxData(null)}
          isMobile={true}
          containerRef={infoBoxRef}
        />
      )}
    </div>
  );
}
