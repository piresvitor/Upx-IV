import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Search, X, Loader2, Clock, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PlaceResult {
  id: string | null;
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface SearchPlaceInputProps {
  onPlaceSelect: (place: PlaceResult) => void;
  onSearch?: (query: string) => Promise<PlaceResult[]>;
  className?: string;
}

export interface SearchPlaceInputRef {
  clear: () => void;
}

const SEARCH_HISTORY_KEY = "place_search_history";
const MAX_HISTORY_ITEMS = 5;

const SearchPlaceInput = forwardRef<SearchPlaceInputRef, SearchPlaceInputProps>(({
  onPlaceSelect,
  onSearch,
  className = "",
}, ref) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState<PlaceResult[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Carregar histórico do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        const history = JSON.parse(stored) as PlaceResult[];
        setSearchHistory(history.slice(0, MAX_HISTORY_ITEMS));
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  }, []);

  // Salvar no histórico
  const saveToHistory = (place: PlaceResult) => {
    try {
      const history = [
        place,
        ...searchHistory.filter((h) => h.placeId !== place.placeId),
      ].slice(0, MAX_HISTORY_ITEMS);
      setSearchHistory(history);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Erro ao salvar histórico:", error);
    }
  };

  // Buscar lugares
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length < 3) {
      setResults([]);
      setIsLoading(false); // Resetar loading quando query é muito curta
      if (query.length === 0) {
        setShowResults(false);
      }
      return;
    }

    if (!onSearch) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const searchResults = await onSearch(query);
        setResults(searchResults);
        setShowResults(true);
      } catch (error) {
        console.error("Erro ao buscar:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      // Resetar loading ao limpar o timeout
      setIsLoading(false);
    };
  }, [query, onSearch]);

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPlace = (place: PlaceResult) => {
    saveToHistory(place);
    onPlaceSelect(place);
    setQuery(place.name);
    setShowResults(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    inputRef.current?.blur();
  };

  // Expor método clear através da ref
  useImperativeHandle(ref, () => ({
    clear: clearSearch,
  }));

  const handleInputFocus = () => {
    if (query.length === 0 && searchHistory.length > 0) {
      setShowResults(true);
    } else if (results.length > 0) {
      setShowResults(true);
    }
  };

  const displayResults = query.length === 0 ? searchHistory : results;
  const showHistoryLabel = query.length === 0 && searchHistory.length > 0;

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar local (ex: Shopping, Hospital, Restaurante...)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length >= 3) {
              setShowResults(true);
            }
          }}
          onFocus={handleInputFocus}
          className="pl-10 sm:pl-12 pr-10 sm:pr-12 h-11 sm:h-12 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary transition-colors"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Limpar busca"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </div>

      {showResults && displayResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1.5 sm:mt-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-56 sm:max-h-64 md:max-h-80 overflow-y-auto">
          {showHistoryLabel && (
            <div className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Buscas recentes
            </div>
          )}
          {displayResults.map((place, index) => (
            <button
              key={place.placeId || index}
              onClick={() => handleSelectPlace(place)}
              className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0 active:bg-gray-200 dark:active:bg-gray-600 touch-manipulation"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate leading-tight">
                    {place.name}
                  </div>
                  {place.address && (
                    <div 
                      className="text-xs sm:text-sm address-text mt-0.5 sm:mt-1 line-clamp-2 leading-relaxed" 
                      style={{ color: 'rgb(75 85 99)' }}
                    >
                      {place.address}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults &&
        query.length >= 3 &&
        results.length === 0 &&
        !isLoading && (
          <div className="absolute z-50 w-full mt-1.5 sm:mt-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 text-center">
              Nenhum local encontrado
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 text-center mt-0.5 sm:mt-1">
              Tente buscar com outros termos
            </p>
          </div>
        )}
    </div>
  );
});

SearchPlaceInput.displayName = "SearchPlaceInput";

export default SearchPlaceInput;