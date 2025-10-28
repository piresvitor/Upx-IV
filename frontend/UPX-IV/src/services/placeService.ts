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

  // Acessibilidade
  hasRamp?: boolean;
  hasAccessibleBathroom?: boolean;
  hasAccessibleParking?: boolean;
  hasVisualAccessibility?: boolean;
}

interface SearchNearbyParams {
  latitude: number;
  longitude: number;
  radius?: number;
  type?: string;
  keyword?: string;
}

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

export const placeService = {
  async searchNearby(params: SearchNearbyParams): Promise<Place[]> {
    const { latitude, longitude, radius = 1000, type, keyword } = params;
    const res = await api.get("/places/search-nearby", {
      params: { latitude, longitude, radius, type, keyword },
    });
    return res.data.places as Place[];
  },

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
};
