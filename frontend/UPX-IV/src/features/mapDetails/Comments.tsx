import { useEffect, useState } from "react";
import { reportService, type Report } from "@/services/reportService";

interface CommentListProps {
  placeId: string;
}

export default function CommentList({ placeId }: CommentListProps) {
  const [comments, setComments] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await reportService.list(placeId);
        setComments(data.reports);
      } catch (err) {
        console.error("Erro ao carregar comentários:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [placeId]);

  if (loading)
    return (
      <p className="text-gray-500 text-sm mt-2">Carregando comentários...</p>
    );

  if (comments.length === 0)
    return (
      <p className="text-gray-500 text-sm mt-2">
        Nenhum comentário encontrado.
      </p>
    );

  return (
    <div>
      <h1 className="lg:text-2xl text-base font-semibold text-gray-800 mb-4">
        Comentários
      </h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {comments.map((comment) => (
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
                <h3 className="font-semibold text-gray-700  text-sm lg:text-base">
                  {comment.user.name}
                </h3>
              </div>
              <span className="text-sm text-gray-500 lg:text-base">
                {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <p className="text-gray-700">{comment.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
