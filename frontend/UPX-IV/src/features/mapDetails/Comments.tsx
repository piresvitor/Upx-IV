// CommentList.tsx
import { useEffect, useState } from "react";
import {
  reportService,
  type Report,
  type ReportsResponse,
  type ReportUpdateData,
} from "@/services/reportService";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CommentListProps {
  placeId: string;
}

export default function CommentList({ placeId }: CommentListProps) {
  const { userId } = useAuth();
  const [comments, setComments] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<Report | null>(null);
  const [newDescription, setNewDescription] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data: ReportsResponse = await reportService.list(placeId);
      setTotalPages(Math.ceil(data.pagination.total / limit));
      const start = (page - 1) * limit;
      const end = start + limit;
      setComments(data.reports.slice(start, end));
    } catch (err) {
      console.error("Erro ao carregar comentários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [placeId, page]);

  const openEditModal = (comment: Report) => {
    setEditingComment(comment);
    setNewDescription(comment.description);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingComment) return;

    try {
      const updateData: ReportUpdateData = {
        title: editingComment.title,
        description: newDescription,
        type: editingComment.type,
        rampaAcesso: editingComment.rampaAcesso,
        banheiroAcessivel: editingComment.banheiroAcessivel,
        estacionamentoAcessivel: editingComment.estacionamentoAcessivel,
        acessibilidadeVisual: editingComment.acessibilidadeVisual,
      };
      await reportService.updateReport(editingComment.id, updateData);
      setIsModalOpen(false);
      fetchComments();
    } catch (err) {
      console.error("Erro ao atualizar comentário:", err);
    }
  };

  const handleDelete = async () => {
    if (!editingComment) return;
    try {
      await reportService.deleteReport(editingComment.id);
      setIsModalOpen(false);
      fetchComments();
    } catch (err) {
      console.error("Erro ao deletar comentário:", err);
    }
  };

  if (loading)
    return (
      <p className="text-gray-500 text-sm mt-2">Carregando comentários...</p>
    );

  return (
    <div>
      <h1 className="lg:text-2xl text-base font-semibold text-gray-800 mb-4">
        Comentários
      </h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {comments.length === 0 ? (
          <p>Nenhum comentário disponível.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="lg:w-10 lg:h-10 w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-700 font-bold text-sm lg:text-base">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-700 text-sm lg:text-base">
                    {comment.user.name}
                  </h3>
                </div>
                <span className="text-sm text-gray-500 lg:text-base">
                  {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <p className="text-gray-700">{comment.description}</p>

              {comment.user.id === userId && (
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(comment)}
                  >
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Deletar
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Paginação */}
      <div className="flex justify-center mt-6 gap-2">
        <Button
          variant="outline"
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
        >
          Anterior
        </Button>
        <span className="flex items-center px-3">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => page < totalPages && setPage(page + 1)}
          disabled={page === totalPages}
        >
          Próximo
        </Button>
      </div>

      {/* Modal de edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Comentário</DialogTitle>
          </DialogHeader>
          <Input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="mt-2"
          />
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
