// MapDetails.tsx
import { useState } from "react";
import PlaceDetails from "@/features/mapDetails/PlaceDetails";
import AccessibilityInfo from "@/features/mapDetails/AccessBilityInfo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewComment from "@/features/mapDetails/NewComment";
import CommentList from "@/features/mapDetails/Comments";
import type { Place } from "@/services/placeService";
import { useParams } from "react-router-dom";
export default function MapDetails() {
  const navigate = useNavigate();
  const [place, setPlace] = useState<Place | null>(null);

  const { placeId } = useParams<{ placeId: string }>();

  return (
    <main className="lg:px-20 px-5">
      <Button
        onClick={() => navigate("/map")}
        variant={"ghost"}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao mapa
      </Button>
      <PlaceDetails onPlaceLoaded={setPlace} />
      {place && <AccessibilityInfo {...place} />}
      {placeId && (
        <>
          <CommentList placeId={placeId} />
          <NewComment
            placeId={placeId}
            onSuccess={() => window.location.reload()} // atualiza lista após novo comentário
          />
        </>
      )}{" "}
    </main>
  );
}
