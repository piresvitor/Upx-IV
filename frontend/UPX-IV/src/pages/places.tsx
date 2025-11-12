import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Heart, MapPin, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { placeService, type PlaceWithReports } from "@/services/placeService";
import { useNavigate } from "react-router-dom";

export default function Places() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<PlaceWithReports[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });

  const fetchPlaces = async (page: number = 1, search?: string) => {
    try {
      setLoading(true);
      const data = await placeService.getPlacesWithReports(page, 15, search);
      setPlaces(data.places);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Erro ao buscar locais:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces(currentPage, searchTerm || undefined);
  }, [currentPage, searchTerm]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPlaces(1, searchTerm || undefined);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePlaceClick = (placeId: string) => {
    navigate(`/details/${placeId}`);
  };

  if (loading && places.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Carregando locais...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Locais com Comentários</h1>

      {/* Campo de Busca */}
      <Card className="p-6 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar locais por nome ou endereço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>
            Buscar
          </Button>
        </div>
      </Card>

      {/* Lista de Locais */}
      {places.length === 0 ? (
        <Card className="p-6">
          <p className="text-gray-600 text-center py-8">
            {searchTerm
              ? "Nenhum local encontrado com esse termo de busca."
              : "Nenhum local com comentários encontrado."}
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {places.map((place) => (
              <Card
                key={place.id}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handlePlaceClick(place.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {place.name}
                    </h3>
                    {place.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{place.address}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {place.rating && (
                        <span>⭐ {place.rating.toFixed(1)}</span>
                      )}
                      {place.types && place.types.length > 0 && (
                        <span className="capitalize">
                          {place.types[0].replace(/_/g, " ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 md:gap-6">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Comentários</p>
                        <p className="text-lg font-bold text-gray-800">
                          {place.reportsCount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <Heart size={20} className="text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Votos</p>
                        <p className="text-lg font-bold text-gray-800">
                          {place.votesCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Página {pagination.page} de {pagination.totalPages} ({pagination.total} locais)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Próxima
                    <ChevronRight size={16} className="ml-1" />
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

