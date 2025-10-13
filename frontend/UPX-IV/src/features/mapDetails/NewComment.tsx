import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewComment() {
  const id = useId();
  return (
    <div className="*:not-first:mt-2 ">
      <Label
        htmlFor={id}
        className="lg:text-2xl text-base font-semibold text-gray-800"
      >
        Compartilhe a sua experiência
      </Label>
      <Textarea id={id} placeholder="Leave a comment" />
      <div className="flex justify-end">
        <Button variant="outline">Enviar</Button>
      </div>
    </div>
  );
}
