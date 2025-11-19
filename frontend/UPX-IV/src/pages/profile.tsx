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
import { User, Edit2, FileText, Heart, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { userService, type User as UserType, type UserStats } from "@/services/userService";
import { useAuthContext } from "@/context/useAuthContext";
import { useNavigate } from "react-router-dom";
import { reportService } from "@/services/reportService";
import { ReportTypeBadge } from "@/components/ReportTypeBadge";

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
  
  // Estados para exclusão
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);

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
      setStats({ totalReports: 0, totalVotes: 0, totalFavorites: 0, reports: [] });
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
    if (!deletePassword) {
      setDeleteError("Por favor, insira sua senha para confirmar a exclusão");
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      await userService.deleteMe(deletePassword);
      logout();
      navigate("/");
    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);
      const errorMessage = error.response?.data?.message || "Erro ao excluir conta. Tente novamente.";
      setDeleteError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm("Tem certeza que deseja excluir este relato?")) return;
    
    try {
      await reportService.deleteReport(reportId);
      await fetchStats();
    } catch (error) {
      console.error("Erro ao excluir relato:", error);
      alert("Erro ao excluir relato. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-300">Carregando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500 dark:text-red-400">Erro ao carregar perfil</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Meu Perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Perfil */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mb-4">
                <User size={48} className="text-gray-600 dark:text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user.name}</h2>
              <p className="text-base text-gray-700 dark:text-gray-300">{user.email}</p>
              <p className="text-base text-gray-600 dark:text-gray-400 mt-1 capitalize">{user.role}</p>
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

        {/* Estatísticas e Relatos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estatísticas */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Estatísticas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                  <FileText size={26} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-base text-gray-700 dark:text-gray-300 mb-1">Relatos Criados</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats?.totalReports || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                  <Heart size={26} className="text-red-600 dark:text-red-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-base text-gray-700 dark:text-gray-300 mb-1">Total de Votos Recebidos</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats?.totalVotes || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <div className="w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center flex-shrink-0">
                  <Star size={26} className="text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-base text-gray-700 dark:text-gray-300 mb-1">Locais Favoritos</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stats?.totalFavorites || 0}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Meus Relatos */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Meus Relatos
            </h3>
            {!stats?.reports || stats.reports.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 text-center py-8">
                Você ainda não criou nenhum relato.
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
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                            {report.title || "Sem título"}
                          </h4>
                          <p className="text-base text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                            {report.description || "Sem descrição"}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-base text-gray-600 dark:text-gray-300">
                            {report.type ? (
                              <ReportTypeBadge type={report.type} size="sm" />
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">N/A</span>
                            )}
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
                          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
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
      <Dialog open={isDeleteModalOpen} onOpenChange={(open) => {
        setIsDeleteModalOpen(open);
        if (!open) {
          setDeletePassword("");
          setDeleteError(null);
          setShowDeletePassword(false);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Conta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-gray-600 dark:text-gray-300">
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
              Todos os seus relatos e dados serão permanentemente removidos.
            </p>
            <div>
              <Label htmlFor="delete-password" className="text-gray-700 dark:text-gray-300">
                Digite sua senha para confirmar:
              </Label>
              <div className="relative mt-1">
                <Input
                  id="delete-password"
                  type={showDeletePassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    setDeleteError(null);
                  }}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                  aria-label={showDeletePassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showDeletePassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {deleteError && (
                <p className="text-red-600 dark:text-red-400 text-base mt-1">{deleteError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletePassword("");
                setDeleteError(null);
                setShowDeletePassword(false);
              }}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={deleting || !deletePassword}
              style={{ backgroundColor: "#ef4444", color: "white" }}
            >
              {deleting ? "Excluindo..." : "Excluir Conta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

