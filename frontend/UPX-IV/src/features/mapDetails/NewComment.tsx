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
  const [error, setError] = useState(""); // para descrição

  const handleSubmit = async () => {
    // valida descrição
    if (!description.trim()) {
      setError("Digite algum comentário antes de enviar.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const newReport = {
        title: "Relato do usuário",
        description,
        type: selectedTypes.length > 0 ? "accessibility" : "report",
        rampaAcesso: selectedTypes.includes("rampaAcesso"),
        banheiroAcessivel: selectedTypes.includes("banheiroAcessivel"),
        estacionamentoAcessivel: selectedTypes.includes(
          "estacionamentoAcessivel"
        ),
        acessibilidadeVisual: selectedTypes.includes("acessibilidadeVisual"),
      };

      await reportService.create(placeId, newReport);

      setDescription("");
      setSelectedTypes([]);
      onSuccess?.();
    } catch (err) {
      const error = err as { response?: { data?: unknown } } | Error;
      console.error("Erro ao criar relato:", (error as { response?: { data?: unknown } }).response?.data || error);
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
        onChange={(e) => {
          setDescription(e.target.value);
          if (error) setError("");
        }}
        placeholder="Escreva aqui sobre sua experiência..."
      />

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      <div className="mt-5">
        <p className="text-sm text-gray-600 mb-3">
          Selecione as opções de acessibilidade que este local possui (opcional):
        </p>
        <CommentCheckBox
          selectedTypes={selectedTypes}
          onChange={(types) => {
            setSelectedTypes(types);
          }}
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
