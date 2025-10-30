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

export interface LoginData {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
  };
}

export const authService = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const res = await api.post("/auth/register", data);
      return res.data;
    } catch (error) {
      console.error("Erro ao fazer cadastrar:", error);
      throw error;
    }
  },

  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const res = await api.post("/auth/login", data);
      return res.data;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  },
};
