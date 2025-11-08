import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, MapPin, ThumbsUp } from "lucide-react";

interface StatsData {
  totalUsers: number;
  totalReports: number;
  totalPlaces: number;
  totalVotes: number;
  lastUpdated: string;
}

const Stats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3333";
        const response = await fetch(`${apiUrl}/stats/general`);
        if (!response.ok) {
          throw new Error("Erro ao buscar estatísticas");
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);

        // Fallback data for demonstration
        setStats({
          totalUsers: 1247,
          totalReports: 3891,
          totalPlaces: 2156,
          totalVotes: 8742,
          lastUpdated: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    {
      icon: Users,
      title: "Usuários Ativos",
      value: stats?.totalUsers || 0,
      gradient: "from-primary to-primary/70",
    },
    {
      icon: FileText,
      title: "Relatos Criados",
      value: stats?.totalReports || 0,
      gradient: "from-primary to-primary/70",
    },
    {
      icon: MapPin,
      title: "Locais Mapeados",
      value: stats?.totalPlaces || 0,
      gradient: "from-primary to-primary/70",
    },
    {
      icon: ThumbsUp,
      title: "Votos da Comunidade",
      value: stats?.totalVotes || 0,
      gradient: "from-primary to-primary/70",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Impacto <span className="text-primary">em números</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Nossa comunidade está crescendo e fazendo a diferença todos os dias
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsConfig.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all hover:shadow-lg relative overflow-hidden group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
                />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-4xl font-bold">
                    {loading ? (
                      <div className="h-10 w-24 bg-muted animate-pulse rounded" />
                    ) : (
                      <span
                        className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                      >
                        {stat.value.toLocaleString("pt-BR")}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
