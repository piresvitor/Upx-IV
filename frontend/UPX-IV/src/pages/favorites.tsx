import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { favoriteService, type FavoritePlace } from "@/services/favoriteService";
import { useNavigate } from "react-router-dom";
import PlaceCard from "@/components/PlaceCard";

export default function Favorites() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<FavoritePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });

  const fetchFavorites = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await favoriteService.getFavorites(page, 15);
      setPlaces(data.places);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites(currentPage);
  }, [currentPage]);

  const handlePlaceClick = (placeId: string) => {
    navigate(`/details/${placeId}`);
  };

  const handleRemoveFavorite = async (e: React.MouseEvent, placeId: string) => {
    e.stopPropagation(); // Prevenir navegação ao clicar no botão
    try {
      await favoriteService.toggleFavorite(placeId);
      await fetchFavorites(currentPage);
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  };

  if (loading && places.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Carregando favoritos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">Meus Locais Favoritos</h1>

      {/* Lista de Locais Favoritos */}
      {places.length === 0 ? (
        <Card className="p-4 sm:p-6">
          <div className="text-center py-8 sm:py-12">
            <Star size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-base text-gray-700 mb-2">
              Você ainda não tem locais favoritos.
            </p>
            <p className="text-base text-gray-600">
              Explore os locais e adicione aos favoritos para acesso rápido!
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            {places.map((place) => (
              <div key={place.id} className="relative">
                <PlaceCard
                  id={place.id}
                  name={place.name}
                  address={place.address}
                  rating={place.rating}
                  types={place.types}
                  reportsCount={place.reportsCount}
                  votesCount={place.votesCount}
                  onClick={handlePlaceClick}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(e, place.id);
                  }}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 z-10 p-1.5 sm:p-2"
                  title="Remover dos favoritos"
                >
                  <Star size={22} className="fill-yellow-500 sm:w-6 sm:h-6" />
                </Button>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <Card className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                <div className="text-base text-gray-700 text-center sm:text-left">
                  <span className="hidden sm:inline">Página {pagination.page} de {pagination.totalPages} ({pagination.total} favoritos)</span>
                  <span className="sm:hidden">{pagination.page}/{pagination.totalPages} ({pagination.total})</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex-1 sm:flex-initial text-base"
                  >
                    <ChevronLeft size={14} className="sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                    <span className="hidden sm:inline">Anterior</span>
                    <span className="sm:hidden">Ant</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentPage === pagination.totalPages}
                    className="flex-1 sm:flex-initial text-base"
                  >
                    <span className="hidden sm:inline">Próxima</span>
                    <span className="sm:hidden">Próx</span>
                    <ChevronRight size={14} className="sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

