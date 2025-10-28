import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CommentCheckBoxProps {
  selectedTypes: string[];
  onChange: (types: string[]) => void;
}

export default function CommentCheckBox({
  selectedTypes,
  onChange,
}: CommentCheckBoxProps) {
  const id = useId();

  const options = [
    { id: `${id}-a`, label: "Rampa de acesso", value: "rampaAcesso" },
    { id: `${id}-b`, label: "Banheiro acessível", value: "banheiroAcessível" },
    {
      id: `${id}-c`,
      label: "Estacionamento",
      value: "estacionamentoAcessivel",
    },
    {
      id: `${id}-d`,
      label: "Acessibilidade visual",
      value: "acessibilidadeVisual",
    },
  ];

  const handleToggle = (value: string) => {
    const updated = selectedTypes.includes(value)
      ? selectedTypes.filter((t) => t !== value)
      : [...selectedTypes, value];

    onChange(updated);
  };

  return (
    <div className="lg:flex lg:flex-row grid grid-cols-1 gap-6">
      {options.map((option) => (
        <div key={option.id} className="flex items-center gap-2">
          <Checkbox
            id={option.id}
            checked={selectedTypes.includes(option.value)}
            onCheckedChange={() => handleToggle(option.value)}
          />
          <Label htmlFor={option.id}>{option.label}</Label>
        </div>
      ))}
    </div>
  );
}
