import { api } from "./api";

export interface Place {
  id: string;
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
  reportsCount: number;

  hasRamp?: boolean;
  hasAccessibleBathroom?: boolean;
  hasAccessibleParking?: boolean;
  hasVisualAccessibility?: boolean;
}

// interface SearchNearbyParams {
//   latitude: number;
//   longitude: number;
//   radius?: number;
//   type?: string;
//   keyword?: string;
// }

export interface AccessibilityStats {
  percentage: number;
  hasMajority: boolean;
  positiveCount: number;
  totalCount: number;
}

export interface AccessibilityResponse {
  place: { id: string; name: string; address: string };
  totalReports: number;
  accessibilityStats: {
    rampaAcesso: AccessibilityStats;
    banheiroAcessivel: AccessibilityStats;
    estacionamentoAcessivel: AccessibilityStats;
    acessibilidadeVisual: AccessibilityStats;
    [key: string]: AccessibilityStats;
  };
}

export interface PlaceWithReports extends Place {
  reportsCount: number;
  votesCount: number;
}

export interface PlacesWithReportsResponse {
  places: PlaceWithReports[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const placeService = {
  async checkOrCreate(placeId: string): Promise<Place> {
    const res = await api.post("/places/check-or-create", { placeId });
    return res.data.place as Place;
  },

  async getDetails(placeId: string): Promise<Place> {
    const res = await api.get(`/places/${placeId}`);
    return res.data as Place;
  },

  async getAccessibilityStats(placeId: string): Promise<AccessibilityResponse> {
    const res = await api.get(`/places/${placeId}/accessibility-stats`);
    return res.data;
  },

  async getPlacesWithReports(
    page: number = 1,
    limit: number = 15,
    search?: string,
    type?: string,
    sortBy: 'reportsCount' | 'votesCount' | 'createdAt' | 'lastReportDate' = 'lastReportDate',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<PlacesWithReportsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) {
      params.append('search', search);
    }
    if (type) {
      params.append('type', type);
    }
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);
    const res = await api.get(`/places/with-reports?${params.toString()}`);
    return res.data;
  },
};
