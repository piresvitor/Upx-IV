"use client";

import { useState } from "react";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LoginData } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const router = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof LoginData, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token } = await authService.login(form);

      // Decodifica o JWT para pegar o userId (sub)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub; // normalmente o id do usuário está em 'sub'

      login(token, userId);
      router("/map");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-primary lg:bg-amber-50">
      <div className="lg:w-2/5 bg-primary flex flex-col items-center justify-center p-12 text-white ">
        <h1 className="text-4xl font-extrabold mb-4 text-center">
          Olá de novo!
        </h1>
        <p className="lg:text-lg text-amber-100 text-center max-w-xs text-sm">
          Acesse sua conta e continue sua jornada conosco.
        </p>
        <Button
          variant="outline"
          size="lg"
          className=" hidden lg:flex mt-8 border-white text-amber-50 hover:bg-white/20 transition-colors cursor-pointer"
          onClick={() => router("/account/register")}
        >
          Criar Conta
        </Button>
        <Button
          type="button"
          variant="link"
          onClick={() => router("/login")}
          className="lg:hidden flex text-white font-semibold underline hover:text-amber-200 transition-colors pt-7"
        >
          Criar Conta
        </Button>
      </div>

      <div className="lg:w-3/5 flex items-center justify-center p-8 lg:p-1 bg-gray-50 rounded-t-[35px] lg:rounded-none">
        <Card className="w-full max-w-md lg:p-8 rounded-2xl lg:shadow-xl border-none shadow-none lg:border-1 bg-gray-50 lg:bg-white ">
          <CardHeader className="text-center mb-4">
            <CardTitle className="text-2xl font-medium text-primary">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <Label
                  htmlFor="email"
                  className="text-gray-700 text-sm font-medium"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="password"
                  className="text-gray-700 text-sm font-medium"
                >
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-amber-400"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1 text-center">{error}</p>
              )}
              <Button
                type="submit"
                className="cursor-pointer w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
