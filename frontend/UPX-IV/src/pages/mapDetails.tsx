import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import PlaceDetails from "@/features/mapDetails/PlaceDetails";
import AccessibilityInfo from "@/features/mapDetails/AccessBilityInfo";
import CommentList from "@/features/mapDetails/Comments";
import NewComment from "@/features/mapDetails/NewComment";
import { placeService, type Place } from "@/services/placeService";
import { reportService, type Report } from "@/services/reportService";
import { favoriteService } from "@/services/favoriteService";
import { useAuthContext } from "@/context/useAuthContext";

export default function MapDetails() {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  
  const handleBackToMap = () => {
    navigate('/map');
  };

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [allComments, setAllComments] = useState<Report[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(false);

  const fetchComments = async () => {
    if (!placeId) return;
    try {
      const data = await reportService.list(placeId);
      setAllComments(data.reports);
    } catch (err) {
      console.error("Erro ao carregar comentários:", err);
    }
  };

  const fetchDetails = async () => {
    if (!placeId) return;
    try {
      const data = await placeService.getDetails(placeId);
      setPlace(data);
    } catch (err) {
      console.error("Erro ao carregar detalhes:", err);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!placeId || !isAuthenticated) return;
    try {
      const result = await favoriteService.checkFavorite(placeId);
      setIsFavorite(result.isFavorite);
    } catch (err) {
      console.error("Erro ao verificar favorito:", err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!placeId) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setCheckingFavorite(true);
      const result = await favoriteService.toggleFavorite(placeId);
      setIsFavorite(result.isFavorite);
    } catch (err) {
      console.error("Erro ao favoritar local:", err);
    } finally {
      setCheckingFavorite(false);
    }
  };

  const handleCommentSuccess = async () => {
    const scrollY = window.scrollY;
    try {
      await fetchDetails();
      await fetchComments();
    } finally {
      window.scrollTo(0, scrollY);
    }
  };

  useEffect(() => {
    if (!placeId) return;

    const init = async () => {
      try {
        await fetchDetails();
        await fetchComments();
        await checkFavoriteStatus();
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeId, isAuthenticated]);

  if (loading) return <p className="dark:text-white">Carregando informações...</p>;
  if (!place)
    return (
      <p className="text-red-500 dark:text-red-400 text-center mt-10">
        Não foi possível carregar os detalhes do local.
      </p>
    );

  return (
    <main className="lg:px-20 px-5">
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={handleBackToMap}
          variant="ghost"
          className="flex items-center text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao mapa
        </Button>

        {isAuthenticated && (
          <Button
            onClick={handleToggleFavorite}
            variant="ghost"
            disabled={checkingFavorite}
            className="flex items-center gap-2 text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 cursor-pointer"
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Star 
              size={20} 
              className={`transition-colors ${
                isFavorite 
                  ? "text-yellow-500 fill-yellow-500" 
                  : "text-gray-400 dark:text-gray-300 hover:text-yellow-500"
              }`} 
            />
            <span className="hidden sm:inline">
              {isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            </span>
          </Button>
        )}
      </div>

      <PlaceDetails place={place} />
      <AccessibilityInfo placeId={placeId!} />

      <CommentList
        placeId={placeId!}
        comments={allComments}
        onCommentsUpdate={fetchComments}
      />

      <NewComment placeId={placeId!} onSuccess={handleCommentSuccess} />
    </main>
  );
}
