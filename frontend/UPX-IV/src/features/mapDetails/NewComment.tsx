import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reportService } from "@/services/reportService";
import CommentCheckBox from "@/components/comp-139";

interface NewCommentProps {
  placeId: string;
  onSuccess?: () => void;
}

export default function NewComment({ placeId, onSuccess }: NewCommentProps) {
  const [description, setDescription] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setLoading(true);

    try {
      const newReport = {
        title: "Relato do usuário",
        description,
        type: selectedTypes.join(", ") || "comentário",
        rampaAcesso: selectedTypes.includes("rampaAcesso"),
        banheiroAcessivel: selectedTypes.includes("banheiroAcessível"),
        estacionamentoAcessivel: selectedTypes.includes(
          "estacionamentoAcessível"
        ),
        acessibilidadeVisual: selectedTypes.includes("acessibilidadeVisual"),
      };

      // placeId vai na URL, token já no header via axios
      const response = await reportService.create(placeId, newReport);

      console.log("Relato criado:", response.report);
      setDescription("");
      setSelectedTypes([]);
      onSuccess?.();
    } catch (err: any) {
      console.error("Erro ao criar relato:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <h1 className="lg:text-2xl text-base font-semibold text-gray-800 mb-4">
        Compartilhe sua experiência
      </h1>

      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Escreva aqui sobre sua experiência..."
      />

      <div className="mt-5">
        <p className="text-sm text-gray-600 mb-3">
          Selecione as opções de acessibilidade que este local possui:
        </p>
        <CommentCheckBox
          selectedTypes={selectedTypes}
          onChange={setSelectedTypes}
        />
      </div>

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
