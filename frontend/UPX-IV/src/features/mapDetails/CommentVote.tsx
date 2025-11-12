import { useEffect, useState } from "react";
import { reportService } from "@/services/reportService";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface CommentVoteProps {
  reportId: string;
  initialVotesCount?: number;
  initialUserVoted?: boolean;
}

export default function CommentVote({ 
  reportId, 
  initialVotesCount, 
  initialUserVoted 
}: CommentVoteProps) {
  const [hasVoted, setHasVoted] = useState(initialUserVoted ?? false);
  const [votesCount, setVotesCount] = useState(initialVotesCount ?? 0);

  useEffect(() => {
    // Se valores iniciais foram fornecidos (vindos da lista de comentários), usar eles
    if (initialVotesCount !== undefined || initialUserVoted !== undefined) {
      if (initialVotesCount !== undefined) {
        setVotesCount(initialVotesCount);
      }
      if (initialUserVoted !== undefined) {
        setHasVoted(initialUserVoted);
      }
    } else {
      // Se não tiver valores iniciais (quando usado isoladamente), buscar do backend
      const fetchVoteStatus = async () => {
        try {
          const report = await reportService.getReport(reportId);
          setVotesCount(report.votesCount || 0);
          setHasVoted(report.userVoted || false);
        } catch (err) {
          console.error("Erro ao carregar voto:", err);
        }
      };
      fetchVoteStatus();
    }
  }, [reportId, initialVotesCount, initialUserVoted]);

  const handleVote = async () => {
    try {
      if (hasVoted) {
        await reportService.deleteVote(reportId);
        setVotesCount((prev) => Math.max(prev - 1, 0));
        setHasVoted(false);
      } else {
        await reportService.vote(reportId);
        setVotesCount((prev) => prev + 1);
        setHasVoted(true);
      }
      // Recarregar o status do voto do backend para garantir sincronização
      const report = await reportService.getReport(reportId);
      setVotesCount(report.votesCount || 0);
      setHasVoted(report.userVoted || false);
    } catch (err) {
      const error = err as { response?: { data?: unknown } } | Error;
      console.error("Erro ao votar:", error);
    }
  };

  return (
    <div className="flex flex-col items-start mt-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleVote}
        className={`h-6 px-1.5 py-0.5 text-[11px] leading-none flex items-center gap-1 rounded-sm ${
          hasVoted ? "text-red-600" : "text-gray-500"
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${hasVoted ? "fill-red-600" : ""}`} />
        {votesCount}
      </Button>
    </div>
  );
}
