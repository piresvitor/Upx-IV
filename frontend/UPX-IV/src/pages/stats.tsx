import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  statsService,
  type GeneralStats,
  type ReportsByTypeResponse,
  type ReportsTrendsResponse,
  type AccessibilityFeaturesResponse,
} from "@/services/statsService";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, FileText, MapPin, Heart, TrendingUp } from "lucide-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
];

export default function Stats() {
  const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null);
  const [reportsByType, setReportsByType] =
    useState<ReportsByTypeResponse | null>(null);
  const [trends, setTrends] = useState<ReportsTrendsResponse | null>(null);
  const [accessibilityFeatures, setAccessibilityFeatures] =
    useState<AccessibilityFeaturesResponse | null>(null);
  const [trendPeriod, setTrendPeriod] = useState<"day" | "week" | "month">("day");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllStats();
  }, []);

  useEffect(() => {
    if (trendPeriod) {
      fetchTrends();
    }
  }, [trendPeriod]);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      const [general, byType, trendsData, accessibilityData] = await Promise.all([
        statsService.getGeneralStats(),
        statsService.getReportsByType(10),
        statsService.getReportsTrends(trendPeriod, 30),
        statsService.getAccessibilityFeatures(),
      ]);
      setGeneralStats(general);
      setReportsByType(byType);
      setTrends(trendsData);
      setAccessibilityFeatures(accessibilityData);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async () => {
    try {
      const trendsData = await statsService.getReportsTrends(trendPeriod, 30);
      setTrends(trendsData);
    } catch (error) {
      console.error("Erro ao buscar tendências:", error);
    }
  };

  const formatDate = (dateStr: string, period: string) => {
    if (period === "day") {
      return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    } else if (period === "week") {
      return dateStr;
    } else {
      return new Date(dateStr + "-01").toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Carregando estatísticas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Estatísticas do Sistema
      </h1>

      {/* Cards de Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Usuários</p>
              <p className="text-2xl font-bold text-gray-800">
                {generalStats?.totalUsers || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <FileText size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Relatórios</p>
              <p className="text-2xl font-bold text-gray-800">
                {generalStats?.totalReports || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <MapPin size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Locais</p>
              <p className="text-2xl font-bold text-gray-800">
                {generalStats?.totalPlaces || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Heart size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Votos</p>
              <p className="text-2xl font-bold text-gray-800">
                {generalStats?.totalVotes || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico de Tendências */}
      <Card className="p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp size={24} />
            Tendências de Relatórios
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTrendPeriod("day")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                trendPeriod === "day"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setTrendPeriod("week")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                trendPeriod === "week"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setTrendPeriod("month")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                trendPeriod === "month"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Mês
            </button>
          </div>
        </div>
        {trends && trends.data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trends.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => formatDate(value, trendPeriod)}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => formatDate(value, trendPeriod)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#0088FE"
                strokeWidth={2}
                name="Relatórios"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-600 text-center py-8">
            Não há dados de tendências disponíveis.
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Pizza - Características de Acessibilidade */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Características de Acessibilidade
          </h2>
          {accessibilityFeatures && accessibilityFeatures.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={accessibilityFeatures.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ feature, percentage }) =>
                    `${feature}: ${percentage.toFixed(1)}%`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {accessibilityFeatures.data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Não há dados de acessibilidade disponíveis.
            </p>
          )}
        </Card>

        {/* Gráfico de Barras - Características de Acessibilidade */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Distribuição de Características de Acessibilidade
          </h2>
          {accessibilityFeatures && accessibilityFeatures.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={accessibilityFeatures.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="feature"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#00C49F" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Não há dados de acessibilidade disponíveis.
            </p>
          )}
        </Card>
      </div>

      {/* Gráficos de Relatórios por Tipo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Gráfico de Pizza - Relatórios por Tipo */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Relatórios por Tipo
          </h2>
          {reportsByType && reportsByType.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={reportsByType.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }) =>
                    `${type}: ${percentage.toFixed(1)}%`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {reportsByType.data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Não há dados de tipos disponíveis.
            </p>
          )}
        </Card>

        {/* Gráfico de Barras - Relatórios por Tipo */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Distribuição de Relatórios por Tipo
          </h2>
          {reportsByType && reportsByType.data.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={reportsByType.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="type"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0088FE" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Não há dados de tipos disponíveis.
            </p>
          )}
        </Card>
      </div>

      {/* Tabelas de Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Tabela de Características de Acessibilidade */}
        {accessibilityFeatures && accessibilityFeatures.data.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Detalhes de Acessibilidade
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Característica
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Quantidade
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Percentual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accessibilityFeatures.data.map((item, index) => (
                    <tr key={item.feature} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{item.feature}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {item.count}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.percentage.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Tabela de Relatórios por Tipo */}
        {reportsByType && reportsByType.data.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Detalhes por Tipo
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Tipo
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Quantidade
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Percentual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportsByType.data.map((item, index) => (
                    <tr key={item.type} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 capitalize">{item.type}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {item.count}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.percentage.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

