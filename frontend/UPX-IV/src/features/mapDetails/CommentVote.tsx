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
    if (loading || hasVoted) return;
    setLoading(true);
    try {
      await reportService.vote(reportId);
      setCount((prev) => prev + 1);
      setHasVoted(true);
    } catch (err) {
      console.error("Erro ao votar:", err);
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
        disabled={loading || hasVoted}
        className={`w-6 h-6 ${hasVoted ? "text-blue-600" : "text-gray-500"}`}
      >
        <ThumbsUp size={14} />
      </Button>
      <span className="text-xs text-gray-600">{count}</span>
    </div>
  );
}
