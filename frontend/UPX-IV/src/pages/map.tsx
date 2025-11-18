import { useState } from "react";
import MapContainer from "@/features/map/MapContainer";
import SearchPlaceInput from "@/components/SearchPlaceInput";
import PinsToggleButton from "@/components/PinsToggleButton";
import MapHelpButton from "@/components/MapHelpButton";
import MapHeader from "@/components/MapHeader";
import { placeService } from "@/services/placeService";

interface PlaceResult {
  id: string | null;
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export default function MapPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showPins, setShowPins] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<{
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    placeId: string;
  } | null>(null);

  const handleSearch = async (query: string): Promise<PlaceResult[]> => {
    if (query.length < 3) {
      return [];
    }

    try {
      // Obter posição atual do mapa (ou usar centro padrão de Sorocaba)
      const center = { lat: -23.529, lng: -47.4686 };
      
      const result = await placeService.searchByText(
        query,
        center.lat,
        center.lng,
        5000 // raio de 5km
      );

      // Bounds de Sorocaba para filtro adicional no frontend
      const sorocabaBounds = {
        north: -23.400,
        south: -23.600,
        east: -47.300,
        west: -47.600,
      };

      // Filtrar lugares do backend por bounds
      const backendPlaces = result.places
        .filter(p => {
          // Verificar se está dentro dos bounds de Sorocaba
          return (
            p.latitude >= sorocabaBounds.south &&
            p.latitude <= sorocabaBounds.north &&
            p.longitude >= sorocabaBounds.west &&
            p.longitude <= sorocabaBounds.east
          );
        })
        .map(p => ({
          id: p.id,
          placeId: p.placeId,
          name: p.name,
          address: p.address || "",
          latitude: p.latitude,
          longitude: p.longitude,
        }));

      // Criar um Set com os placeIds dos lugares do backend para verificar duplicatas
      const backendPlaceIds = new Set(backendPlaces.map(p => p.placeId));

      // Filtrar lugares do Google Maps por bounds e remover duplicatas
      const googlePlaces = result.googlePlaces
        .filter(gp => {
          const lat = gp.geometry.location.lat;
          const lng = gp.geometry.location.lng;
          // Verificar bounds e se o endereço contém Sorocaba
          const withinBounds = (
            lat >= sorocabaBounds.south &&
            lat <= sorocabaBounds.north &&
            lng >= sorocabaBounds.west &&
            lng <= sorocabaBounds.east
          );
          const addressContainsSorocaba = 
            gp.formatted_address?.toLowerCase().includes('sorocaba') ||
            gp.formatted_address?.toLowerCase().includes('sorocaba, sp') ||
            gp.formatted_address?.toLowerCase().includes('sorocaba - sp');
          
          return withinBounds && (addressContainsSorocaba || !gp.formatted_address);
        })
        .filter(gp => !backendPlaceIds.has(gp.place_id)) // Remover duplicatas que já estão no backend
        .map(gp => ({
          id: null,
          placeId: gp.place_id,
          name: gp.name,
          address: gp.formatted_address || "",
          latitude: gp.geometry.location.lat,
          longitude: gp.geometry.location.lng,
        }));

      // Combinar lugares do backend e do Google (sem duplicatas)
      const allPlaces: PlaceResult[] = [...backendPlaces, ...googlePlaces];

      return allPlaces;
    } catch (error) {
      console.error("Erro ao buscar locais:", error);
      return [];
    }
  };

  const handlePlaceSelect = async (place: PlaceResult) => {
    // Se o lugar não existe no backend, criar/verificar
    if (!place.id) {
      try {
        const createdPlace = await placeService.checkOrCreate(place.placeId);
        setSelectedPlace({
          id: createdPlace.id,
          name: createdPlace.name,
          address: createdPlace.address,
          latitude: createdPlace.latitude,
          longitude: createdPlace.longitude,
          placeId: createdPlace.placeId,
        });
      } catch (error) {
        console.error("Erro ao verificar/criar local:", error);
        // Não definir se não conseguir criar
      }
    } else {
      setSelectedPlace({
        id: place.id,
        name: place.name,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        placeId: place.placeId,
      });
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 pt-2 sm:pt-3 pb-3 sm:pb-4 md:pb-6 relative min-h-screen">
      <MapHeader />

      {/* Campo de Busca com Toggle de Pins */}
      <div className="mb-3 sm:mb-4 md:mb-6 max-w-2xl mx-auto w-full">
        <div className="flex gap-1.5 sm:gap-2 md:gap-3 items-center">
          <div className="flex-1 min-w-0">
            <SearchPlaceInput
              onPlaceSelect={handlePlaceSelect}
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
          <PinsToggleButton
            showPins={showPins}
            onToggle={() => setShowPins(!showPins)}
          />
        </div>
      </div>
      
      <MapHelpButton isOpen={isHelpOpen} onOpenChange={setIsHelpOpen} />

      <MapContainer selectedPlace={selectedPlace} showPins={showPins} />
    </div>
  );
}
