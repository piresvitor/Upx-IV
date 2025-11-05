import { useEffect, useState } from "react";
import { reportService } from "@/services/reportService";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";

interface CommentVoteProps {
  reportId: string;
}

export default function CommentVote({ reportId }: CommentVoteProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [votesCount, setVotesCount] = useState(0);

  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        const report = await reportService.getReport(reportId);
        setVotesCount(report.votesCount || 0);

        const votedReports = JSON.parse(
          localStorage.getItem("votedReports") || "[]"
        );
        setHasVoted(votedReports.includes(reportId));
      } catch (err) {
        console.error("Erro ao carregar voto:", err);
      }
    };
    fetchVoteStatus();
  }, [reportId]);

  const handleVote = async () => {
    try {
      if (hasVoted) {
        await reportService.deleteVote(reportId);
        setVotesCount((prev) => Math.max(prev - 1, 0));
        setHasVoted(false);
        updateLocalStorage(false);
      } else {
        await reportService.vote(reportId);
        setVotesCount((prev) => prev + 1);
        setHasVoted(true);
        updateLocalStorage(true);
      }
    } catch (err: any) {
      console.error("Erro ao votar:", err);
    }
  };

  const updateLocalStorage = (voted: boolean) => {
    const votedReports = JSON.parse(
      localStorage.getItem("votedReports") || "[]"
    );
    const updated = voted
      ? [...votedReports, reportId]
      : votedReports.filter((id: string) => id !== reportId);
    localStorage.setItem("votedReports", JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col items-start mt-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleVote}
        className={`h-6 px-1.5 py-0.5 text-[11px] leading-none flex items-center gap-1 rounded-sm ${
          hasVoted ? "text-yellow-500" : "text-gray-500"
        }`}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        {votesCount}
      </Button>
    </div>
  );
}
