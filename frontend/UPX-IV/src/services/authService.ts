import { api } from "./api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  token?: string;
}

export const authService = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
};
