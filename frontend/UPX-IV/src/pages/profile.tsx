import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { User, Edit2, FileText, Heart, Trash2 } from "lucide-react";
import { userService, type User as UserType, type UserStats } from "@/services/userService";
import { useAuthContext } from "@/context/useAuthContext";
import { useNavigate } from "react-router-dom";
import { reportService } from "@/services/reportService";

export default function Profile() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Estados para edição
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await userService.getMe();
      setUser(userData);
      setEditName(userData.name);
      setEditEmail(userData.email);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await userService.getMyStats();
      setStats(statsData);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      // Definir stats vazio em caso de erro para não quebrar a UI
      setStats({ totalReports: 0, totalVotes: 0, reports: [] });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await userService.updateMe({
        name: editName,
        email: editEmail,
        password: editPassword || undefined,
      });
      await fetchUserData();
      setIsEditModalOpen(false);
      setEditPassword("");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar perfil. Verifique os dados e tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteMe();
      logout();
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      alert("Erro ao excluir conta. Tente novamente.");
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm("Tem certeza que deseja excluir este relatório?")) return;
    
    try {
      await reportService.deleteReport(reportId);
      await fetchStats();
    } catch (error) {
      console.error("Erro ao excluir relatório:", error);
      alert("Erro ao excluir relatório. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Carregando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Erro ao carregar perfil</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Perfil */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <User size={48} className="text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1 capitalize">{user.role}</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full"
                variant="outline"
              >
                <Edit2 size={16} className="mr-2" />
                Editar Perfil
              </Button>
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full"
                variant="outline"
                style={{ color: "#ef4444", borderColor: "#ef4444" }}
              >
                <Trash2 size={16} className="mr-2" />
                Excluir Conta
              </Button>
            </div>
          </Card>
        </div>

        {/* Estatísticas e Relatórios */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estatísticas */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Relatórios Criados</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats?.totalReports || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Heart size={24} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Votos Recebidos</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats?.totalVotes || 0}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Meus Relatórios */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Meus Relatórios
            </h3>
            {!stats?.reports || stats.reports.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                Você ainda não criou nenhum relatório.
              </p>
            ) : (
              <div className="space-y-4">
                {stats.reports.map((report) => {
                  // Garantir que createdAt seja tratado corretamente
                  let dateStr = "";
                  try {
                    if (report.createdAt) {
                      const date = typeof report.createdAt === 'string' 
                        ? new Date(report.createdAt) 
                        : report.createdAt;
                      dateStr = date instanceof Date && !isNaN(date.getTime())
                        ? date.toLocaleDateString("pt-BR")
                        : "Data inválida";
                    }
                  } catch (error) {
                    console.error("Erro ao formatar data:", error);
                    dateStr = "Data inválida";
                  }

                  return (
                    <div
                      key={report.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {report.title || "Sem título"}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {report.description || "Sem descrição"}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <span className="capitalize">{report.type || "N/A"}</span>
                            {report.place && report.place.name && (
                              <span>📍 {report.place.name}</span>
                            )}
                            <span>
                              ❤️ {report.votesCount || 0} votos
                            </span>
                            {dateStr && <span>{dateStr}</span>}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReport(report.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Nova Senha (opcional)</Label>
              <Input
                id="password"
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Deixe em branco para não alterar"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditPassword("");
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Exclusão */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Conta</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 py-4">
            Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
            Todos os seus relatórios e dados serão permanentemente removidos.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteAccount}
              style={{ backgroundColor: "#ef4444", color: "white" }}
            >
              Excluir Conta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

