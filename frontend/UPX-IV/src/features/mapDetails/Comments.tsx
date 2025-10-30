import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import CommentVote from "./CommentVote";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  reportService,
  type Report,
  type ReportUpdateData,
} from "@/services/reportService";

interface CommentListProps {
  placeId: string;
  comments: Report[];
  onCommentsUpdate: () => void;
}

export default function CommentList({
  comments,
  onCommentsUpdate,
}: CommentListProps) {
  const { userId } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 4;
  const totalPages = Math.ceil(comments.length / limit);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<Report | null>(null);
  const [newDescription, setNewDescription] = useState("");

  const start = (page - 1) * limit;
  const end = start + limit;
  const currentComments = comments.slice(start, end);

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
      onCommentsUpdate();
    } catch (err) {
      console.error("Erro ao atualizar comentário:", err);
    }
  };

  const handleDelete = async () => {
    if (!editingComment) return;
    try {
      await reportService.deleteReport(editingComment.id);
      setIsModalOpen(false);
      onCommentsUpdate();
    } catch (err) {
      console.error("Erro ao deletar comentário:", err);
    }
  };

  if (!comments.length) return <p>Nenhum comentário disponível.</p>;

  return (
    <div className="mt-6">
      <h2 className="lg:text-2xl text-base font-semibold text-gray-800 mb-4">
        Comentários
      </h2>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {currentComments.map((comment) => (
          <div
            key={comment.id}
            className="border rounded-lg p-4 shadow-sm bg-white space-y-2"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-start gap-2">
                <div className="lg:w-10 lg:h-10 w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-bold text-sm lg:text-base">
                    {comment.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="space-y-[2px] leading-[0.9]">
                  <h3 className="font-semibold text-gray-700 text-sm lg:text-base">
                    {comment.user.name}
                  </h3>
                  <span className="text-[12px] text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <p className="text-gray-700 text-sm mt-3">
                    {comment.description}
                  </p>
                  <CommentVote
                    reportId={comment.id}
                    initialCount={comment.votesCount || 0}
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
                    onClick={handleDelete}
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
          <span className="flex items-center px-3">
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
