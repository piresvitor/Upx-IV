import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reportService } from "@/services/reportService";
import CommentCheckBox from "@/components/comp-139";
import { ReportTypeSelector } from "@/components/ReportTypeSelector";

interface NewCommentProps {
  placeId: string;
  onSuccess?: () => void;
}

export default function NewComment({ placeId, onSuccess }: NewCommentProps) {
  const [description, setDescription] = useState("");
  const [reportType, setReportType] = useState<string>("positive");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // para descrição
  const [typeError, setTypeError] = useState(""); // para tipo

  const handleSubmit = async () => {
    // valida descrição
    if (!description.trim()) {
      setError("Digite algum comentário antes de enviar.");
      return;
    }

    // valida tipo
    if (!reportType) {
      setTypeError("Selecione o tipo de relatório.");
      return;
    }

    setError("");
    setTypeError("");
    setLoading(true);

    try {
      const newReport = {
        title: "Relato do usuário",
        description,
        type: reportType, // Usa o tipo selecionado pelo usuário
        rampaAcesso: selectedTypes.includes("rampaAcesso"),
        banheiroAcessivel: selectedTypes.includes("banheiroAcessivel"),
        estacionamentoAcessivel: selectedTypes.includes(
          "estacionamentoAcessivel"
        ),
        acessibilidadeVisual: selectedTypes.includes("acessibilidadeVisual"),
      };

      await reportService.create(placeId, newReport);

      setDescription("");
      setReportType("positive"); // Reset para positivo
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
    <div className="mt-8 lg:mt-10">
      <h1 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white mb-4 lg:mb-6">
        Compartilhe sua experiência
      </h1>

      {/* Textarea e Botão */}
      <div className="mb-5 lg:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1 w-full">
            <Textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError("");
              }}
              placeholder="Escreva aqui sobre sua experiência..."
              className="min-h-24 lg:min-h-28 text-base lg:text-lg"
            />
            {error && <p className="text-sm lg:text-base text-red-600 dark:text-red-400 mt-1.5">{error}</p>}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer h-11 lg:h-12 px-6 lg:px-8 text-base lg:text-lg font-semibold whitespace-nowrap w-full sm:w-auto"
          >
            {loading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </div>

      {/* Layout Desktop: 2 colunas | Mobile: Empilhado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        {/* Coluna 1: Tipo de Relatório */}
        <div>
          <ReportTypeSelector
            value={reportType}
            onChange={(type) => {
              setReportType(type);
              if (typeError) setTypeError("");
            }}
            required={true}
          />
          {typeError && <p className="text-sm lg:text-base text-red-600 dark:text-red-400 mt-2">{typeError}</p>}
        </div>

        {/* Coluna 2: Opções de Acessibilidade */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            Características de Acessibilidade <span className="text-gray-500 dark:text-gray-500 text-xs font-normal">(opcional)</span>
          </label>
          <CommentCheckBox
            selectedTypes={selectedTypes}
            onChange={(types) => {
              setSelectedTypes(types);
            }}
          />
        </div>
      </div>
    </div>
  );
}
