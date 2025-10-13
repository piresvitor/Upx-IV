import PlaceDetails from "@/features/mapDetails/PlaceDetails";
import AccessibilityInfo from "@/features/mapDetails/AccessBilityInfo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewComment from "@/features/mapDetails/NewComment";
import CommentList from "@/features/mapDetails/Comments";

export default function MapDetails() {
  const navigate = useNavigate();

  return (
    <main className=" lg:px-20 px-5">
      <Button
        onClick={() => navigate("/map")}
        variant={"ghost"}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 cursor-pointer"
      >
        <ArrowLeft className=" h-4 w-4" /> Voltar ao mapa
      </Button>
      <PlaceDetails />
      <AccessibilityInfo />
      <CommentList />
      <NewComment />
    </main>
  );
}
