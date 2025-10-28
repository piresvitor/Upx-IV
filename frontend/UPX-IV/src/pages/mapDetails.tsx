import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import PlaceDetails from "@/features/mapDetails/PlaceDetails";
import AccessibilityInfo from "@/features/mapDetails/AccessBilityInfo";
import CommentList from "@/features/mapDetails/Comments";
import NewComment from "@/features/mapDetails/NewComment";
import { placeService, type Place } from "@/services/placeService";

export default function MapDetails() {
  const navigate = useNavigate();
  const { placeId } = useParams<{ placeId: string }>();

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!placeId) return;

    const fetchDetails = async () => {
      try {
        const data = await placeService.getDetails(placeId);
        setPlace(data);
      } catch (error) {
        console.error("Erro ao carregar os detalhes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [placeId]);

  return (
    <main className="lg:px-20 px-5">
      <Button
        onClick={() => navigate("/map")}
        variant="ghost"
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao mapa
      </Button>

      {loading && <p>Carregando informações...</p>}

      {!loading && place && (
        <>
          <PlaceDetails onPlaceLoaded={setPlace} />
          <AccessibilityInfo placeId={placeId!} />
          <CommentList placeId={placeId!} />
          <NewComment
            placeId={placeId!}
            onSuccess={() => window.location.reload()}
          />
        </>
      )}
    </main>
  );
}
