import { api } from "./api";

export interface NewReport {
  title: string;
  description: string;
  type: string;
}

export const reportService = {
  async create(placeId: string, report: NewReport) {
    const res = await api.post(`/places/${placeId}/reports`, { report });
    return res.data;
  },
};
