import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { NewReport } from "@/services/reportService";

import { reportService } from "@/services/reportService";
interface NewCommentProps {
  placeId: string;
  onSuccess?: () => void;
}

export default function NewComment({ placeId, onSuccess }: NewCommentProps) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const newReport: NewReport = {
        title: "Relato do usuário",
        description,
        type: "general",
        placeId,
        userId: localStorage.getItem("userId") || "",
      };
      await reportService.create(newReport);
      setDescription("");
      onSuccess?.();
    } catch (err) {
      console.error("Erro ao criar relato:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Compartilhe sua experiência"
      />
      <div className="flex justify-end mt-2">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="cursor-pointer"
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </div>
  );
}
