// userService.ts
import { api } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserStats {
  totalReports: number;
  totalVotes: number;
  totalFavorites: number;
  reports: Array<{
    id: string;
    title: string;
    description: string;
    type: string;
    createdAt: string;
    place: { id: string; name: string } | null;
    votesCount: number;
  }>;
}

export const userService = {
  getMe: async (): Promise<User> => {
    const res = await api.get("/users/me");
    return res.data;
  },

  updateMe: async (data: { name?: string; email?: string; password?: string }) => {
    const res = await api.put("/users/me", data);
    return res.data;
  },

  deleteMe: async (password: string) => {
    // Axios pode não enviar body em DELETE por padrão
    // Usar config explícita para garantir que o body seja enviado
    const res = await api.delete("/users/me", {
      data: { password },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  },

  getMyReports: async (page: number = 1, limit: number = 10, userId?: string) => {
    // Se userId não foi fornecido, buscar do token (fallback para compatibilidade)
    let finalUserId = userId;
    
    if (!finalUserId) {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Não autenticado");
      
      // Buscar o ID do usuário apenas se não foi fornecido
      const userRes = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      finalUserId = userRes.data.id;
    }

    // Buscar relatos do usuário
    const reportsRes = await api.get("/reports", {
      params: { user_id: finalUserId, page, limit },
    });

    return reportsRes.data;
  },

  getMyStats: async (reportsLimit: number = 50): Promise<UserStats> => {
    try {
      // Usar a nova rota otimizada que retorna tudo em uma única chamada
      const res = await api.get("/users/me/stats", {
        params: { reportsLimit },
      });

      const data = res.data;

      // Formatar relatos garantindo que createdAt seja uma string
      const reportsFormatted = (data.reports || []).map((report: any) => {
        let createdAt = "";
        if (report.createdAt) {
          if (typeof report.createdAt === 'string') {
            createdAt = report.createdAt;
          } else if (report.createdAt instanceof Date) {
            createdAt = report.createdAt.toISOString();
          } else {
            try {
              const date = new Date(report.createdAt);
              if (!isNaN(date.getTime())) {
                createdAt = date.toISOString();
              } else {
                createdAt = new Date().toISOString();
              }
            } catch {
              createdAt = new Date().toISOString();
            }
          }
        } else {
          createdAt = new Date().toISOString();
        }

        return {
          id: report.id || "",
          title: report.title || "",
          description: report.description || "",
          type: report.type || "",
          createdAt,
          votesCount: report.votesCount || 0,
          place: report.place || null,
        };
      });

      return {
        totalReports: data.totalReports || 0,
        totalVotes: data.totalVotes || 0,
        totalFavorites: data.totalFavorites || 0,
        reports: reportsFormatted,
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw error;
    }
  },
};

