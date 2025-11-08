// statsService.ts
import { api } from "./api";

export interface GeneralStats {
  totalUsers: number;
  totalReports: number;
  totalPlaces: number;
  totalVotes: number;
  lastUpdated: string;
}

export interface ReportsByType {
  type: string;
  count: number;
  percentage: number;
}

export interface ReportsByTypeResponse {
  data: ReportsByType[];
  total: number;
  uniqueTypes: number;
  lastUpdated: string;
}

export interface TrendData {
  date: string;
  count: number;
}

export interface ReportsTrendsResponse {
  period: "day" | "week" | "month";
  data: TrendData[];
  total: number;
  lastUpdated: string;
}

export interface AccessibilityFeature {
  feature: string;
  count: number;
  percentage: number;
}

export interface AccessibilityFeaturesResponse {
  data: AccessibilityFeature[];
  total: number;
  lastUpdated: string;
}

export const statsService = {
  getGeneralStats: async (): Promise<GeneralStats> => {
    const res = await api.get("/stats/general");
    return res.data;
  },

  getReportsByType: async (limit: number = 20): Promise<ReportsByTypeResponse> => {
    const res = await api.get("/stats/reports/by-type", {
      params: { limit },
    });
    return res.data;
  },

  getReportsTrends: async (
    period: "day" | "week" | "month" = "day",
    limit: number = 30
  ): Promise<ReportsTrendsResponse> => {
    const res = await api.get("/stats/reports/trends", {
      params: { period, limit },
    });
    return res.data;
  },

  getAccessibilityFeatures: async (): Promise<AccessibilityFeaturesResponse> => {
    const res = await api.get("/stats/reports/accessibility-features");
    return res.data;
  },
};

