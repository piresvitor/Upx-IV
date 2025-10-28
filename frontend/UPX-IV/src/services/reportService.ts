// reportService.ts
import { api } from "./api";

export interface ReportUser {
  id: string;
  name: string;
  email: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
  user: ReportUser;
  rampaAcesso: boolean;
  banheiroAcessivel: boolean;
  estacionamentoAcessivel: boolean;
  acessibilidadeVisual: boolean;
  votesCount?: number;
}

export interface Place {
  id: string;
  placeId: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  types: string[];
  rating: number | null;
  userRatingsTotal: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReportsResponse {
  place: Place;
  reports: Report[];
  pagination: Pagination;
}

export interface NewReport {
  title: string;
  description: string;
  type: string;
  rampaAcesso?: boolean;
  banheiroAcessivel?: boolean;
  estacionamentoAcessivel?: boolean;
  acessibilidadeVisual?: boolean;
}

export interface ReportUpdateData {
  title: string;
  description: string;
  type: string;
  rampaAcesso: boolean;
  banheiroAcessivel: boolean;
  estacionamentoAcessivel: boolean;
  acessibilidadeVisual: boolean;
}

// Adicione no reportService.ts
export const reportService = {
  create: async (placeId: string, data: NewReport) => {
    const res = await api.post(`/places/${placeId}/reports`, data);
    return res.data;
  },

  list: async (placeId: string): Promise<ReportsResponse> => {
    const res = await api.get(`/places/${placeId}/reports`);
    return res.data;
  },

  async updateReport(reportId: string, data: ReportUpdateData) {
    const res = await api.put(`/reports/${reportId}`, data);
    return res.data;
  },

  async deleteReport(reportId: string) {
    const res = await api.delete(`/reports/${reportId}`);
    return res.data;
  },

  async vote(reportId: string) {
    const response = await api.post(`/reports/${reportId}/votes`);
    return response.data;
  },

  async deleteVote(reportId: string) {
    const response = await api.delete(`/reports/${reportId}/votes`);
    return response.data;
  },
};
