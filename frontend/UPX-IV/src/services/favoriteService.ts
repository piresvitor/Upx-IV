import { api } from "./api";

export interface FavoritePlace {
  id: string;
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
  createdAt: string;
  updatedAt: string;
  reportsCount: number;
  votesCount: number;
  favoritedAt: string;
}

export interface FavoritesResponse {
  places: FavoritePlace[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const favoriteService = {
  async toggleFavorite(placeId: string): Promise<{ isFavorite: boolean; message: string }> {
    const res = await api.post(`/places/${placeId}/favorites`);
    return res.data;
  },

  async checkFavorite(placeId: string): Promise<{ isFavorite: boolean }> {
    const res = await api.get(`/places/${placeId}/favorites/check`);
    return res.data;
  },

  async getFavorites(page: number = 1, limit: number = 15): Promise<FavoritesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const res = await api.get(`/users/me/favorites?${params.toString()}`);
    return res.data;
  },
};

