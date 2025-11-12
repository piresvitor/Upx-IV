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

  getMyReports: async (page: number = 1, limit: number = 10) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Não autenticado");

    // Primeiro, buscar o ID do usuário
    const userRes = await api.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userId = userRes.data.id;

    // Buscar relatórios do usuário
    const reportsRes = await api.get("/reports", {
      params: { user_id: userId, page, limit },
      headers: { Authorization: `Bearer ${token}` },
    });

    return reportsRes.data;
  },

  getMyStats: async (): Promise<UserStats> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Não autenticado");

    try {
      // Buscar o ID do usuário
      const userRes = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = userRes.data.id;

      // Buscar todos os relatórios do usuário
      // O backend tem limite máximo de 50, então vamos buscar em lotes se necessário
      const limit = 50; // Limite máximo do backend
      const reportsRes = await api.get("/reports", {
        params: { user_id: userId, page: 1, limit },
      });

      const reports = reportsRes.data.reports || [];
    
      // Buscar quantidade de favoritos
      let totalFavorites = 0;
      try {
        const favoritesRes = await api.get("/users/me/favorites", {
          params: { page: 1, limit: 1 },
        });
        totalFavorites = favoritesRes.data.pagination?.total || 0;
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
        totalFavorites = 0;
      }

      if (!reports || reports.length === 0) {
        return {
          totalReports: 0,
          totalVotes: 0,
          totalFavorites,
          reports: [],
        };
      }
      
      // Contar votos totais (soma dos votesCount de cada relatório)
      // Buscar detalhes de cada relatório para obter votesCount
      let totalVotes = 0;
      const reportsWithVotes = await Promise.all(
        reports.map(async (report: any) => {
          try {
          const reportDetail = await api.get(`/reports/${report.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const votesCount = reportDetail.data.votesCount || 0;
          totalVotes += votesCount;
          
          // Garantir que createdAt seja uma string
          let createdAt = "";
          if (report.createdAt) {
            if (typeof report.createdAt === 'string') {
              createdAt = report.createdAt;
            } else if (report.createdAt instanceof Date) {
              createdAt = report.createdAt.toISOString();
            } else {
              // Tentar converter para Date e depois para ISO string
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
            votesCount,
            place: report.place || null,
          };
        } catch (error) {
          console.error(`Erro ao buscar detalhes do relatório ${report.id}:`, error);
          
          // Garantir que createdAt seja uma string mesmo em caso de erro
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
            votesCount: 0,
            place: report.place || null,
          };
          }
        })
      );

      return {
        totalReports: reports.length,
        totalVotes,
        totalFavorites,
        reports: reportsWithVotes,
      };
    } catch (error) {
      console.error("Erro completo ao buscar estatísticas:", error);
      throw error;
    }
  },
};

