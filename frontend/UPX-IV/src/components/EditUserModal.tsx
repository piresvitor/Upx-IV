import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EditUserModal({ open, onClose }: EditUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Carrega dados do usuário autenticado quando o modal abre
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(response.data.name || "");
        setEmail(response.data.email || "");
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    if (open) fetchUser();
  }, [open]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await api.put(
        "/users/me",
        { name, email, password: password || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoading(false);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Nova senha (opcional)</label>
            <Input
              type="password"
              placeholder="Digite uma nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
