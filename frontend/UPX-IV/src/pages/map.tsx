import { useState } from "react";
import { HelpCircle } from "lucide-react";
import MapContainer from "@/features/map/MapContainer";
import SearchPlaceInput from "@/components/SearchPlaceInput";
import { placeService } from "@/services/placeService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

      // Combinar lugares do backend e do Google, filtrando por bounds
      const allPlaces: PlaceResult[] = [
        ...result.places
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
          })),
        ...result.googlePlaces
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
          .map(gp => ({
            id: null,
            placeId: gp.place_id,
            name: gp.name,
            address: gp.formatted_address || "",
            latitude: gp.geometry.location.lat,
            longitude: gp.geometry.location.lng,
          })),
      ];

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
    <div className="px-3 sm:px-4 md:px-6 pt-3 pb-4 sm:pb-6 relative">
      <div className="items-center flex flex-col pb-4 sm:pb-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white text-center px-2">
          Mapa de Acessibilidade
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-200 leading-[1.5] text-center px-2">
          Encontre estabelecimentos e locais acessíveis na cidade de{" "}
          <span className="font-bold">Sorocaba/SP</span>
        </p>
      </div>

      {/* Campo de Busca */}
      <div className="mb-4 sm:mb-6 max-w-2xl mx-auto w-full">
        <SearchPlaceInput
          onPlaceSelect={handlePlaceSelect}
          onSearch={handleSearch}
          className="w-full"
        />
      </div>
      
      {/* Botão de Ajuda */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="rounded-full w-12 h-12 sm:w-14 sm:h-14 
                shadow-lg hover:shadow-xl 
                dark:shadow-2xl dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]
                transition-all duration-300
                bg-primary hover:bg-primary-dark 
                dark:bg-blue-600 dark:hover:bg-blue-500
                text-white dark:text-white
                border-2 border-transparent
                dark:border-blue-400/30
                hover:scale-110 active:scale-95
                backdrop-blur-sm"
              aria-label="Como usar o mapa"
            >
              <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm dark:drop-shadow-md" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl dark:text-white">
                Como usar o mapa
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed pt-2 space-y-3 text-gray-700 dark:text-white">
                <p>
                  Navegue pelo mapa para encontrar o local que você deseja visualizar.
                </p>
                <p>
                  Ao clicar em um marcador no mapa, um popup será exibido com informações básicas sobre aquele local.
                </p>
                <p>
                  Clique no popup para ser redirecionado à página de detalhes, onde você poderá:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-gray-700 dark:text-white">
                  <li>Ver informações completas sobre acessibilidade</li>
                  <li>Visualizar comentários e avaliações de outros usuários</li>
                  <li>Deixar seu próprio comentário e avaliação</li>
                </ul>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <MapContainer selectedPlace={selectedPlace} />
    </div>
  );
}
