import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import PlaceDetails from "@/features/mapDetails/PlaceDetails";
import AccessibilityInfo from "@/features/mapDetails/AccessBilityInfo";
import CommentList from "@/features/mapDetails/Comments";
import NewComment from "@/features/mapDetails/NewComment";
import { placeService, type Place } from "@/services/placeService";
import { reportService, type Report } from "@/services/reportService";

export default function MapDetails() {
  const navigate = useNavigate();
  const { placeId } = useParams<{ placeId: string }>();

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [allComments, setAllComments] = useState<Report[]>([]);

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
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [placeId]);

  if (loading) return <p>Carregando informações...</p>;
  if (!place)
    return (
      <p className="text-red-500 text-center mt-10">
        Não foi possível carregar os detalhes do local.
      </p>
    );

  return (
    <main className="lg:px-20 px-5">
      <Button
        onClick={() => navigate("/map")}
        variant="ghost"
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao mapa
      </Button>

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
