import { MapPin, MessageSquareText, Users, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Explore o Mapa",
    description:
      "Navegue pelo mapa interativo e descubra informações sobre acessibilidade próximas a você.",
  },
  {
    icon: MessageSquareText,
    title: "Compartilhe sua Experiência",
    description:
      "Encontrou um local? Crie um relato detalhado sobre as condições de acessibilidade.",
  },
  {
    icon: Users,
    title: "Contribua com a Comunidade",
    description:
      "Vote e valide relatos de outros usuários, ajudando a manter informações precisas.",
  },
  {
    icon: CheckCircle,
    title: "Faça a Diferença",
    description:
      "Suas contribuições ajudam milhares de pessoas a se locomoverem com mais segurança.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Como <span className="text-primary">funciona</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Participar é simples e faz uma diferença real na vida das pessoas
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center group">
                    {/* Step Number */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-background border-4 border-primary flex items-center justify-center font-bold text-primary">
                        {index + 1}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
