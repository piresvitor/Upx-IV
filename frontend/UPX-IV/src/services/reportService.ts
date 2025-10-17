import { api } from "./api";

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
};
