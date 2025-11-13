import "@/config/recharts"; // Configuração do Recharts (deve ser importado primeiro)
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchAllStats();
  }, []);

  useEffect(() => {
    if (trendPeriod) {
      fetchTrends();
    }
  }, [trendPeriod]);

  // Função para converter dados de UTC para timezone local e reagrupar
  const convertTrendsToLocalTimezone = (
    trendsData: ReportsTrendsResponse | null
  ): ReportsTrendsResponse | null => {
    if (!trendsData || !trendsData.data || trendsData.data.length === 0) {
      return trendsData;
    }

    // Timezone do Brasil (America/Sao_Paulo)
    const timezone = "America/Sao_Paulo";

    // Reagrupar dados convertendo de UTC para timezone local
    const groupedByLocalDate = new Map<string, number>();

    trendsData.data.forEach((item) => {
      if (trendsData.period === "day") {
        // Converter data UTC para timezone local
        // Assumir que a data vem como YYYY-MM-DD em UTC (meio-dia UTC)
        const utcDate = new Date(item.date + "T12:00:00Z");
        
        // Converter para timezone local
        const localDateStr = utcDate.toLocaleDateString("en-CA", {
          timeZone: timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }); // Formato: YYYY-MM-DD

        // Agrupar contagens por data local
        const currentCount = groupedByLocalDate.get(localDateStr) || 0;
        groupedByLocalDate.set(localDateStr, currentCount + item.count);
      } else {
        // Para semana e mês, manter como está (será convertido na formatação)
        groupedByLocalDate.set(item.date, item.count);
      }
    });

    // Converter Map para array e ordenar
    const convertedData = Array.from(groupedByLocalDate.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      ...trendsData,
      data: convertedData,
    };
  };

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
      // Converter dados de tendências de UTC para timezone local
      setTrends(convertTrendsToLocalTimezone(trendsData));
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
      // Converter dados de tendências de UTC para timezone local
      setTrends(convertTrendsToLocalTimezone(trendsData));
    } catch (error) {
      console.error("Erro ao buscar tendências:", error);
    }
  };

  const formatDate = (dateStr: string, period: string) => {
    if (!dateStr) return "";
    
    try {
      if (period === "day") {
        // Formato esperado: YYYY-MM-DD (em timezone local após conversão)
        const parts = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (parts) {
          const [, , month, day] = parts;
          return `${day}/${month}`; // Retorna DD/MM
        }
        return dateStr;
      } else if (period === "week") {
        // Formato esperado: YYYY-WWW (ex: 2024-W01)
        const match = dateStr.match(/^(\d{4})-W(\d{2})$/);
        if (match) {
          const year = match[1];
          const week = match[2];
          return `Sem ${week}/${year}`;
        }
        return dateStr; // Retorna original se não corresponder ao formato
      } else if (period === "month") {
        // Formato esperado: YYYY-MM
        const date = new Date(dateStr + "-01");
        if (isNaN(date.getTime())) {
          return dateStr; // Retorna original se inválido
        }
        return date.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        });
      }
      return dateStr;
    } catch (error) {
      console.error("Erro ao formatar data:", error, dateStr, period);
      return dateStr;
    }
  };

  const formatFeatureName = (feature: string): string => {
    // Captura todas as variações possíveis de "estacionamento"
    // O backend retorna "Estacionamento Acessível"
    const normalized = feature.toLowerCase().trim();
    if (normalized.includes("estacionamento")) {
      return "Vagas PCD";
    }
    return feature;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Carregando estatísticas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
        Estatísticas do Sistema
      </h1>

      {/* Cards de Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="p-4 sm:p-6">
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

        <Card className="p-4 sm:p-6">
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

        <Card className="p-4 sm:p-6">
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

        <Card className="p-4 sm:p-6">
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
      <Card className="p-4 sm:p-6 mb-6 sm:mb-8 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp size={20} className="sm:w-6 sm:h-6" />
            Tendências de Relatórios
          </h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setTrendPeriod("day")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                trendPeriod === "day"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setTrendPeriod("week")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                trendPeriod === "week"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setTrendPeriod("month")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                trendPeriod === "month"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Mês
            </button>
          </div>
        </div>
        {trends && trends.data && trends.data.length > 0 ? (
          <div className="w-full" style={{ minHeight: '300px', height: '300px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={trends.data}
                margin={{ top: 10, right: 10, left: -10, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatDate(value, trends.period || trendPeriod)}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 10 }}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  labelFormatter={(value) => formatDate(value, trends.period || trendPeriod)}
                  formatter={(value: number) => [value, "Relatórios"]}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0088FE"
                  strokeWidth={2}
                  name="Relatórios"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : trends && trends.data && trends.data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-2">
              Não há dados de tendências disponíveis para o período selecionado.
            </p>
            <p className="text-sm text-gray-500">
              Período: {trendPeriod === "day" ? "Dia" : trendPeriod === "week" ? "Semana" : "Mês"}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando dados de tendências...</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Gráfico de Pizza - Características de Acessibilidade */}
        <Card className="p-4 sm:p-6 overflow-hidden">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Características de Acessibilidade
          </h2>
          {accessibilityFeatures && accessibilityFeatures.data.length > 0 ? (
            <div className="w-full" style={{ minHeight: isMobile ? '380px' : '360px', height: isMobile ? '380px' : '360px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height={isMobile ? 380 : 360}>
                <PieChart>
                  <Pie
                    data={accessibilityFeatures.data as any}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={false}
                    outerRadius={isMobile ? 70 : 100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {accessibilityFeatures.data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, _name: any, props: any) => [
                      `${value} (${props.payload.percentage.toFixed(1)}%)`,
                      formatFeatureName(props.payload.feature)
                    ]}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={isMobile ? 100 : 70}
                    iconSize={isMobile ? 14 : 16}
                    formatter={(_value, entry: any) => 
                      `${formatFeatureName(entry.payload.feature)} (${entry.payload.percentage.toFixed(1)}%)`
                    }
                    wrapperStyle={{ 
                      paddingTop: '20px',
                      paddingBottom: '10px',
                      fontSize: isMobile ? '13px' : '14px',
                      lineHeight: '1.6',
                      fontWeight: '500'
                    }}
                    layout={isMobile ? "vertical" : "horizontal"}
                    align="center"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Não há dados de acessibilidade disponíveis.
            </p>
          )}
        </Card>

        {/* Gráfico de Barras - Características de Acessibilidade */}
        <Card className="p-4 sm:p-6 overflow-hidden">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Distribuição de Características de Acessibilidade
          </h2>
          {accessibilityFeatures && accessibilityFeatures.data.length > 0 ? (
            <div className="w-full" style={{ minHeight: isMobile ? '320px' : '450px', height: isMobile ? '320px' : '450px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height={isMobile ? 320 : 450}>
                <BarChart 
                  data={accessibilityFeatures.data}
                  margin={{ top: 10, right: 10, left: -10, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="feature"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fontSize: 10 }}
                    tickFormatter={formatFeatureName}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value: any, _name: any, props: any) => [
                      `${value} (${props.payload.percentage.toFixed(1)}%)`,
                      formatFeatureName(props.payload.feature)
                    ]}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#00C49F" name="" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Não há dados de acessibilidade disponíveis.
            </p>
          )}
        </Card>
      </div>

      {/* Gráficos de Relatórios por Tipo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mt-6 sm:mt-8">
        {/* Gráfico de Pizza - Relatórios por Tipo */}
        <Card className="p-4 sm:p-6 overflow-hidden">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Relatórios por Tipo
          </h2>
          {reportsByType && reportsByType.data.length > 0 ? (
            <div className="w-full" style={{ minHeight: isMobile ? '380px' : '360px', height: isMobile ? '380px' : '360px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height={isMobile ? 380 : 360}>
                <PieChart>
                  <Pie
                    data={reportsByType.data as any}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={false}
                    outerRadius={isMobile ? 70 : 100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {reportsByType.data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, _name: any, props: any) => [
                      `${value} (${props.payload.percentage.toFixed(1)}%)`,
                      props.payload.type
                    ]}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={isMobile ? 100 : 70}
                    iconSize={isMobile ? 14 : 16}
                    formatter={(_value, entry: any) => 
                      `${entry.payload.type} (${entry.payload.percentage.toFixed(1)}%)`
                    }
                    wrapperStyle={{ 
                      paddingTop: '20px',
                      paddingBottom: '10px',
                      fontSize: isMobile ? '13px' : '14px',
                      lineHeight: '1.6',
                      fontWeight: '500'
                    }}
                    layout={isMobile ? "vertical" : "horizontal"}
                    align="center"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Não há dados de tipos disponíveis.
            </p>
          )}
        </Card>

        {/* Gráfico de Barras - Relatórios por Tipo */}
        <Card className="p-4 sm:p-6 overflow-hidden">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Distribuição de Relatórios por Tipo
          </h2>
          {reportsByType && reportsByType.data.length > 0 ? (
            <div className="w-full" style={{ minHeight: isMobile ? '320px' : '450px', height: isMobile ? '320px' : '450px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height={isMobile ? 320 : 450}>
                <BarChart 
                  data={reportsByType.data}
                  margin={{ top: 10, right: 10, left: -10, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="type"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value: any, _name: any, props: any) => [
                      `${value} (${props.payload.percentage.toFixed(1)}%)`,
                      props.payload.type
                    ]}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#0088FE" name="" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Não há dados de tipos disponíveis.
            </p>
          )}
        </Card>
      </div>

      {/* Tabelas de Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mt-6 sm:mt-8">
        {/* Tabela de Características de Acessibilidade */}
        {accessibilityFeatures && accessibilityFeatures.data.length > 0 && (
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Detalhes de Acessibilidade
            </h2>
            
            {/* Layout Mobile - Cards */}
            <div className="block sm:hidden space-y-3">
              {accessibilityFeatures.data.map((item) => (
                <div
                  key={item.feature}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-800 text-sm flex-1 pr-2">
                      {formatFeatureName(item.feature)}
                    </p>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 text-base">
                        {item.count}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {item.percentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Layout Desktop - Tabela */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      Característica
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">
                      Quantidade
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">
                      Percentual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accessibilityFeatures.data.map((item) => (
                    <tr key={item.feature} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{formatFeatureName(item.feature)}</td>
                      <td className="py-3 px-4 text-right font-medium text-sm">
                        {item.count}
                      </td>
                      <td className="py-3 px-4 text-right text-sm">
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
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Detalhes por Tipo
            </h2>
            
            {/* Layout Mobile - Cards */}
            <div className="block sm:hidden space-y-3">
              {reportsByType.data.map((item) => (
                <div
                  key={item.type}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-800 text-sm flex-1 pr-2 capitalize">
                      {item.type}
                    </p>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900 text-base">
                        {item.count}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {item.percentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Layout Desktop - Tabela */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      Tipo
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">
                      Quantidade
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">
                      Percentual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportsByType.data.map((item) => (
                    <tr key={item.type} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 capitalize text-sm">{item.type}</td>
                      <td className="py-3 px-4 text-right font-medium text-sm">
                        {item.count}
                      </td>
                      <td className="py-3 px-4 text-right text-sm">
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

