import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { reportService } from "@/services/reportService";
import { useAuth } from "@/hooks/useAuth";

interface CommentVoteProps {
  reportId: string;
}

export default function CommentVote({ reportId }: CommentVoteProps) {
  const { userId } = useAuth(); // ID do usuário logado
  const [votes, setVotes] = useState<number>(0);
  const [userVote, setUserVote] = useState<"up" | null>(null);
  const [loading, setLoading] = useState(false);

  // Busca os votos do backend e se o usuário votou
  const fetchVotes = async () => {
    try {
      const comment = await reportService.getReport(reportId);
      setVotes(comment.votesCount || 0);

      // Aqui definimos se o usuário atual já votou
      const hasUserVoted = comment.voters?.some(
        (v: { userId: string | null }) => v.userId === userId
      );
      setUserVote(hasUserVoted ? "up" : null);
    } catch (err) {
      console.error("Erro ao buscar votos do comentário:", err);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, [reportId]);

  // Função para votar/desvotar
  const handleVote = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (userVote === "up") {
        // Já votou, então remove o voto
        await reportService.deleteVote(reportId);
        setUserVote(null);
      } else {
        // Não votou, então adiciona o voto
        await reportService.vote(reportId);
        setUserVote("up");
      }

      await fetchVotes(); // Atualiza a contagem real do backend
    } catch (err) {
      console.error("Erro ao votar:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={handleVote}
        disabled={loading}
        className={`flex items-center gap-1 text-sm cursor-pointer ${
          userVote === "up" ? "text-green-600 font-semibold" : "text-gray-500"
        }`}
      >
        <ThumbsUp size={16} /> {votes}
      </button>
    </div>
  );
}
