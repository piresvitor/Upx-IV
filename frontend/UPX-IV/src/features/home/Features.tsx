import {
  Map,
  MessageSquare,
  ThumbsUp,
  BarChart3,
  Lock,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Map,
    title: "Mapeamento de Locais",
    description:
      "Integração com Google Maps para localização precisa e visualização intuitiva de todos os pontos de acessibilidade.",
  },
  {
    icon: MessageSquare,
    title: "Sistema de Relatos",
    description:
      "Compartilhe suas experiências sobre acessibilidade de qualquer local público de forma rápida e fácil.",
  },
  {
    icon: ThumbsUp,
    title: "Votação Comunitária",
    description:
      "A comunidade valida e classifica relatos, garantindo informações confiáveis e atualizadas.",
  },
  {
    icon: BarChart3,
    title: "Estatísticas em Tempo Real",
    description:
      "Análise de dados para entender padrões de acessibilidade e identificar áreas que precisam de melhorias.",
  },
  {
    icon: Lock,
    title: "Autenticação Segura",
    description:
      "Sistema de login protegido com JWT e criptografia de senhas para garantir sua privacidade.",
  },
  {
    icon: Users,
    title: "Gestão de Usuários",
    description:
      "Perfis personalizáveis e controle de acesso para uma experiência única e segura.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Funcionalidades que fazem a{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              diferença
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Tecnologia de ponta para democratizar informações sobre
            acessibilidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
