import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="gap-5">
      <h1>Landing Page</h1>
      <Button onClick={() => navigate("/map")}>Ir pro mapa</Button>
    </div>
  );
}
