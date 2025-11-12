import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, ChevronLeft, ChevronRight, Filter, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { placeService, type PlaceWithReports } from "@/services/placeService";
import { useNavigate } from "react-router-dom";
import PlaceCard from "@/components/PlaceCard";

type SortBy = 'reportsCount' | 'votesCount' | 'createdAt';
type SortOrder = 'asc' | 'desc';

// Tipos de locais comuns do Google Maps
const PLACE_TYPES = [
  { value: '', label: 'Todos os tipos' },
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'school', label: 'Escola' },
  { value: 'store', label: 'Loja' },
  { value: 'pharmacy', label: 'Farmácia' },
  { value: 'bank', label: 'Banco' },
  { value: 'gas_station', label: 'Posto de Gasolina' },
  { value: 'parking', label: 'Estacionamento' },
  { value: 'gym', label: 'Academia' },
  { value: 'library', label: 'Biblioteca' },
  { value: 'museum', label: 'Museu' },
  { value: 'church', label: 'Igreja' },
  { value: 'supermarket', label: 'Supermercado' },
];

export default function Places() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<PlaceWithReports[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });

  const fetchPlaces = async (
    page: number = 1,
    search?: string,
    type?: string,
    sortBy: SortBy = 'createdAt',
    sortOrder: SortOrder = 'desc'
  ) => {
    try {
      setLoading(true);
      const data = await placeService.getPlacesWithReports(page, 15, search, type, sortBy, sortOrder);
      setPlaces(data.places);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Erro ao buscar locais:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces(currentPage, searchTerm || undefined, selectedType || undefined, sortBy, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedType, sortBy, sortOrder]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPlaces(1, searchTerm || undefined, selectedType || undefined, sortBy, sortOrder);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
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
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">Locais com Comentários</h1>

      {/* Campo de Busca */}
      <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar locais por nome ou endereço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-9 sm:pl-10 text-base"
            />
          </div>
          <Button onClick={handleSearch} className="w-full sm:w-auto">
            Buscar
          </Button>
        </div>
      </Card>

      {/* Filtros e Ordenação */}
      <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="space-y-4">
          {/* Botão para expandir/colapsar */}
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div className="flex items-center gap-2 text-base font-medium text-gray-800">
              <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="text-base">Filtros e Ordenação</span>
            </div>
            {isFiltersOpen ? (
              <ChevronUp size={18} className="text-gray-500 sm:w-5 sm:h-5" />
            ) : (
              <ChevronDown size={18} className="text-gray-500 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Conteúdo colapsável */}
          {isFiltersOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-3 border-t">
              {/* Filtro por Tipo */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="type-filter" className="flex items-center gap-1.5 sm:gap-2 text-base font-medium text-gray-800">
                  <Filter size={14} className="sm:w-4 sm:h-4" />
                  Tipo de Local
                </Label>
                <select
                  id="type-filter"
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    handleFilterChange();
                  }}
                  className="w-full h-11 sm:h-11 rounded-md border border-gray-300 bg-white px-3 sm:px-4 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {PLACE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenação por Campo */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="sort-by" className="flex items-center gap-1.5 sm:gap-2 text-base font-medium text-gray-800">
                  <ArrowUpDown size={14} className="sm:w-4 sm:h-4" />
                  Ordenar por
                </Label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortBy);
                    handleFilterChange();
                  }}
                  className="w-full h-11 sm:h-11 rounded-md border border-gray-300 bg-white px-3 sm:px-4 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="createdAt">Mais Recentes</option>
                  <option value="reportsCount">Mais Comentários</option>
                  <option value="votesCount">Mais Votos</option>
                </select>
              </div>

              {/* Ordem (Asc/Desc) */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="sort-order" className="text-base font-medium text-gray-800">
                  Ordem
                </Label>
                <select
                  id="sort-order"
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value as SortOrder);
                    handleFilterChange();
                  }}
                  className="w-full h-11 sm:h-11 rounded-md border border-gray-300 bg-white px-3 sm:px-4 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="desc">Decrescente</option>
                  <option value="asc">Crescente</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Lista de Locais */}
      {places.length === 0 ? (
        <Card className="p-4 sm:p-6">
          <p className="text-base text-gray-700 text-center py-6 sm:py-8">
            {searchTerm
              ? "Nenhum local encontrado com esse termo de busca."
              : "Nenhum local com comentários encontrado."}
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                id={place.id}
                name={place.name}
                address={place.address}
                rating={place.rating}
                types={place.types}
                reportsCount={place.reportsCount}
                votesCount={place.votesCount}
                onClick={handlePlaceClick}
              />
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <Card className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                <div className="text-base text-gray-700 text-center sm:text-left">
                  <span className="hidden sm:inline">Página {pagination.page} de {pagination.totalPages} ({pagination.total} locais)</span>
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

