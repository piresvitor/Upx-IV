import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { reportService } from "@/services/reportService";
import { useAuth } from "@/hooks/useAuth";

interface CommentVoteProps {
  reportId: string;
}

export default function CommentVote({ reportId }: CommentVoteProps) {
  const { userId } = useAuth();
  const [votes, setVotes] = useState<number>(0);
  const [userVote, setUserVote] = useState<"up" | null>(null);
  const [loading, setLoading] = useState(false);

  // Busca votos e verifica se o usuário já votou
  const fetchVotes = async () => {
    try {
      const comment = await reportService.getReport(reportId);
      setVotes(comment.votesCount || 0);

      // Checa se o usuário atual votou
      const hasUserVoted = comment.voters?.some(
        (v: { userId: string }) => v.userId === userId
      );
      setUserVote(hasUserVoted ? "up" : null);
    } catch (err) {
      console.error("Erro ao buscar votos do comentário:", err);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, [reportId]);

  const handleVote = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (userVote === "up") {
        // Já votou → desfaz o voto
        await reportService.deleteVote(reportId);
        setVotes((prev) => prev - 1);
        setUserVote(null);
      } else {
        // Não votou → adiciona voto
        await reportService.vote(reportId);
        setVotes((prev) => prev + 1);
        setUserVote("up");
      }
    } catch (err: any) {
      console.error("Erro ao votar/desvotar:", err.response?.data || err);
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
