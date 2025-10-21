"use client";

import { useState } from "react";
import { authService } from "@/services/authService";
import type { RegisterData } from "@/services/authService";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterAccount() {
  const router = useNavigate();
  const [form, setForm] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof RegisterData, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.register(form);
      router("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-primary lg:bg-amber-50">
      <div className="lg:w-2/5 bg-primary flex flex-col items-center justify-center p-12 text-white ">
        <h1 className="text-4xl font-extrabold mb-4 text-center">
          Bem-vindo(a)!
        </h1>
        <p className="lg:text-lg text-amber-100 text-center max-w-xs text-sm">
          Estamos felizes em ter você por aqui. Acesse sua conta e continue sua
          jornada conosco.
        </p>
        <Button
          variant="outline"
          size="lg"
          className=" hidden lg:flex mt-8 border-white text-amber-50 hover:bg-white/20 transition-colors cursor-pointer"
          onClick={() => router("/login")}
        >
          Fazer Login
        </Button>
        <Button
          type="button"
          variant="link"
          onClick={() => router("/login")}
          className="lg:hidden flex text-white font-semibold underline hover:text-amber-200 transition-colors pt-7"
        >
          Fazer Login
        </Button>
      </div>

      <div className="lg:w-3/5 flex items-center justify-center p-8 lg:p-1 bg-gray-50 rounded-t-[35px] lg:rounded-none">
        <Card className="w-full max-w-md lg:p-8 rounded-2xl lg:shadow-xl border-none shadow-none lg:border-1 bg-gray-50 lg:bg-white ">
          <CardHeader className="text-center mb-4">
            <CardTitle className="text-2xl font-medium text-gray-800">
              Não tem uma conta?
            </CardTitle>
            <p className=" mt- text-primary text-xl font-medium">
              Cadastre-se{" "}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <Label
                  htmlFor="name"
                  className="text-gray-700 text-sm font-medium"
                >
                  Nome
                </Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-amber-400"
                />
              </div>
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
                {loading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
