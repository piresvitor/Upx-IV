import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil, Trash, Filter, Accessibility, Building2, Car, Eye } from "lucide-react";
import CommentVote from "./CommentVote";
import { useAuthContext } from "@/context/useAuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  reportService,
  type Report,
  type ReportUpdateData,
} from "@/services/reportService";
import { ReportTypeBadge } from "@/components/ReportTypeBadge";

interface CommentListProps {
  comments: Report[];
  onCommentsUpdate: () => void;
}

export default function CommentList({
  comments,
  onCommentsUpdate,
}: CommentListProps) {
  const { userId } = useAuthContext();
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<string | null>(null);
  const limit = 4;

  // Filtrar comentários por tipo
  const filteredComments = useMemo(() => {
    if (!filterType) return comments;
    return comments.filter(c => c.type?.toLowerCase() === filterType.toLowerCase());
  }, [comments, filterType]);

  const totalPages = Math.ceil(filteredComments.length / limit);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<Report | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [editReportType, setEditReportType] = useState<string>("positive");
  const [editSelectedTypes, setEditSelectedTypes] = useState<string[]>([]);

  const start = (page - 1) * limit;
  const end = start + limit;
  const currentComments = filteredComments.slice(start, end);

  // Resetar página quando filtrar
  const handleFilterChange = (type: string | null) => {
    setFilterType(type);
    setPage(1);
  };

  const openEditModal = (comment: Report) => {
    setEditingComment(comment);
    setNewDescription(comment.description);
    setEditReportType(comment.type || "positive");
    
    // Inicializar opções de acessibilidade baseado no comentário
    const selectedAccessibility: string[] = [];
    if (comment.rampaAcesso) selectedAccessibility.push("rampaAcesso");
    if (comment.banheiroAcessivel) selectedAccessibility.push("banheiroAcessivel");
    if (comment.estacionamentoAcessivel) selectedAccessibility.push("estacionamentoAcessivel");
    if (comment.acessibilidadeVisual) selectedAccessibility.push("acessibilidadeVisual");
    setEditSelectedTypes(selectedAccessibility);
    
    setIsModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingComment) return;

    // Validação
    if (!newDescription.trim()) {
      return;
    }

    if (!editReportType) {
      return;
    }

    try {
      const updateData: ReportUpdateData = {
        title: editingComment.title,
        description: newDescription,
        type: editReportType,
        rampaAcesso: editSelectedTypes.includes("rampaAcesso"),
        banheiroAcessivel: editSelectedTypes.includes("banheiroAcessivel"),
        estacionamentoAcessivel: editSelectedTypes.includes("estacionamentoAcessivel"),
        acessibilidadeVisual: editSelectedTypes.includes("acessibilidadeVisual"),
      };
      await reportService.updateReport(editingComment.id, updateData);
      setIsModalOpen(false);
      onCommentsUpdate();
    } catch (err) {
      console.error("Erro ao atualizar comentário:", err);
    }
  };

  const handleDelete = async (commentToDelete: Report) => {
    try {
      await reportService.deleteReport(commentToDelete.id);
      onCommentsUpdate();
    } catch (err) {
      console.error("Erro ao deletar comentário:", err);
    }
  };

  // Obter tipos únicos para filtro
  const uniqueTypes = useMemo(() => {
    const types = new Set(comments.map(c => c.type?.toLowerCase()).filter(Boolean));
    return Array.from(types);
  }, [comments]);

  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="lg:text-2xl text-base font-semibold text-gray-800 dark:text-white">
          Comentários {filteredComments.length !== comments.length && `(${filteredComments.length} de ${comments.length})`}
        </h2>
        
        {/* Filtros por tipo */}
        {uniqueTypes.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-gray-600 dark:text-gray-400" />
            <Button
              variant={filterType === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange(null)}
              className="text-xs"
            >
              Todos
            </Button>
            {uniqueTypes.map((type) => {
              const typeLabels: Record<string, string> = {
                positive: "Positivo",
                negative: "Negativo",
                neutral: "Neutro",
                accessibility: "Acessibilidade",
                report: "Geral",
              };
              const label = typeLabels[type] || type;
              
              return (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(type)}
                  className="text-xs"
                >
                  {label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
      
      {!comments.length && (
        <p className="text-gray-600 dark:text-gray-300">Nenhum comentário disponível.</p>
      )}
      
      {comments.length > 0 && filteredComments.length === 0 && (
        <p className="text-gray-600 dark:text-gray-300">
          Nenhum comentário encontrado para o filtro selecionado.
        </p>
      )}
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {currentComments.map((comment) => (
          <div
            key={comment.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800/50 space-y-2"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-start gap-2">
                <div className="lg:w-10 lg:h-10 w-7 h-7 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-gray-800 dark:text-white font-bold text-base">
                    {comment.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="space-y-[2px] leading-[0.9] flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-base">
                      {comment.user.name}
                    </h3>
                    {comment.type && (
                      <ReportTypeBadge type={comment.type} size="sm" />
                    )}
                  </div>
                  <span className="text-base text-gray-600 dark:text-gray-300">
                    {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <p className="text-gray-800 dark:text-white text-base mt-3 leading-[1.5]">
                    {comment.description}
                  </p>
                  
                  {/* Campos de Acessibilidade - Compacto no mobile */}
                  {(comment.rampaAcesso || comment.banheiroAcessivel || comment.estacionamentoAcessivel || comment.acessibilidadeVisual) && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                      {comment.rampaAcesso && (
                        <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded sm:rounded-md text-[10px] sm:text-xs">
                          <Accessibility size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">Rampa</span>
                        </div>
                      )}
                      {comment.banheiroAcessivel && (
                        <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded sm:rounded-md text-[10px] sm:text-xs">
                          <Building2 size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">Banheiro</span>
                        </div>
                      )}
                      {comment.estacionamentoAcessivel && (
                        <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded sm:rounded-md text-[10px] sm:text-xs">
                          <Car size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">Estacionamento</span>
                        </div>
                      )}
                      {comment.acessibilidadeVisual && (
                        <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded sm:rounded-md text-[10px] sm:text-xs">
                          <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">Visual</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <CommentVote 
                    reportId={comment.id} 
                    initialVotesCount={comment.votesCount || 0}
                    initialUserVoted={comment.userVoted || false}
                  />
                </div>
              </div>

              {comment.user.id === userId && (
                <div className="flex">
                  <Button
                    className="w-6 h-6"
                    variant="ghost"
                    onClick={() => openEditModal(comment)}
                  >
                    <Pencil size={10} />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(comment)}
                    className="w-6 h-6"
                  >
                    <Trash size={10} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft />
          </Button>
          <span className="flex items-center px-3 text-gray-800 dark:text-white">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg">Editar Comentário</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {/* Descrição */}
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                Descrição <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Escreva aqui sobre sua experiência..."
                className="min-h-20 text-sm"
              />
            </div>

            {/* Tipo de Relatório - Compacto */}
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                Tipo <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "positive", label: "Positivo", icon: "✓", color: "green" },
                  { value: "negative", label: "Negativo", icon: "✗", color: "red" },
                  { value: "neutral", label: "Neutro", icon: "−", color: "blue" },
                ].map((type) => {
                  const isSelected = editReportType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setEditReportType(type.value)}
                      className={`
                        px-3 py-2 rounded-md border text-xs font-medium transition-all
                        ${isSelected
                          ? type.color === "green"
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                            : type.color === "red"
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                            : "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300"
                        }
                      `}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Opções de Acessibilidade - Compacto */}
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                Acessibilidade <span className="text-gray-400 text-xs font-normal">(opcional)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "rampaAcesso", label: "Rampa" },
                  { value: "banheiroAcessivel", label: "Banheiro" },
                  { value: "estacionamentoAcessivel", label: "Estacionamento" },
                  { value: "acessibilidadeVisual", label: "Visual" },
                ].map((option) => {
                  const isSelected = editSelectedTypes.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        const updated = isSelected
                          ? editSelectedTypes.filter((t) => t !== option.value)
                          : [...editSelectedTypes, option.value];
                        setEditSelectedTypes(updated);
                      }}
                      className={`
                        px-3 py-2 rounded-md border text-xs font-medium transition-all text-left
                        ${isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleEditSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
