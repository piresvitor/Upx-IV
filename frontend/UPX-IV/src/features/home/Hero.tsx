import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import heroImage from "@/assets/hero-accessibility.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Pessoas diversas colaborando para mapear acessibilidade urbana"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Tornando a cidade mais{" "}
            <span className=" text-primary">acessível </span> para todos
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Compartilhe e descubra informações sobre acessibilidade de locais
            públicos. Juntos, criamos uma cidade mais inclusiva.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/account/register")}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Explorar Mapa
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
