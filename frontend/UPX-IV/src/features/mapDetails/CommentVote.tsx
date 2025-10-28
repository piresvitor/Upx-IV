import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reportService } from "@/services/reportService";

interface CommentVoteProps {
  reportId: string;
  initialCount?: number;
}

export default function CommentVote({
  reportId,
  initialCount = 0,
}: CommentVoteProps) {
  const [count, setCount] = useState(initialCount);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVote = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await reportService.vote(reportId);
      setCount((prev) => prev + 1);
      setHasVoted(true);
    } catch (err: any) {
      // se o backend retorna que o usuário já votou, interpretamos como "toggle"
      if (err?.response?.data?.message?.includes("Você já votou")) {
        try {
          await reportService.deleteVote(reportId);
          setCount((prev) => Math.max(prev - 1, 0));
          setHasVoted(false);
        } catch (deleteErr) {
          console.error("Erro ao remover voto:", deleteErr);
        }
      } else {
        console.error("Erro ao votar:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleVote}
        disabled={loading}
        className={`w-6 h-6 transition-colors ${
          hasVoted ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
        }`}
      >
        <ThumbsUp size={14} />
      </Button>
      <span className="text-xs text-gray-600">{count}</span>
    </div>
  );
}
