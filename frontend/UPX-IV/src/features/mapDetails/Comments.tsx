import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import CommentVote from "./CommentVote";
import { useAuthContext } from "@/context/useAuthContext";
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
  const { userId } = useAuthContext();
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

  const handleDelete = async (commentToDelete: Report) => {
    try {
      await reportService.deleteReport(commentToDelete.id);
      onCommentsUpdate();
    } catch (err) {
      console.error("Erro ao deletar comentário:", err);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="lg:text-2xl text-base font-semibold text-gray-800 dark:text-white mb-4">
        Comentários
      </h2>
      {!comments.length && (
        <p className="text-gray-600 dark:text-gray-300">Nenhum comentário disponível.</p>
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
                <div className="space-y-[2px] leading-[0.9]">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-base">
                    {comment.user.name}
                  </h3>
                  <span className="text-base text-gray-600 dark:text-gray-300">
                    {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                  <p className="text-gray-800 dark:text-white text-base mt-3 leading-[1.5]">
                    {comment.description}
                  </p>
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
