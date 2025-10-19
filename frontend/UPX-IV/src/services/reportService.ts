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
  placeId: string;
  userId: string;
}

export const reportService = {
  async create(report: NewReport) {
    const res = await api.post(`/places/${report.placeId}/reports`, report);
    return res.data;
  },

  async list(placeId: string): Promise<ReportsResponse> {
    const res = await api.get(`/places/${placeId}/reports`);
    return res.data;
  },
};
