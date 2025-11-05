import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold">Acesso restrito</h1>
      <p className="text-muted-foreground">
        Para acessar esta página, faça login na sua conta.
      </p>

      <div className="flex gap-3">
        <Button asChild>
          <Link to="/login">Fazer Login</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/account/register">Criar Conta</Link>
        </Button>
      </div>
    </div>
  );
}
