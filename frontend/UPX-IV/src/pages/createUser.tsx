"use client";

import { useState } from "react";
import { authService } from "@/services/authService";
import type { RegisterData } from "@/services/authService";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterAccount() {
  const router = useNavigate();
  const [form, setForm] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleChange = (field: keyof RegisterData, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const formatErrorMessage = (message: string): string => {
    // Mensagens de erro mais amigáveis
    if (message.includes("password") && message.includes("Too small")) {
      return "A senha deve conter no mínimo 8 caracteres";
    }
    if (message.includes("name") && message.includes("Too small")) {
      return "O nome deve conter no mínimo 3 caracteres";
    }
    if (message.includes("email") && message.includes("Invalid")) {
      return "Por favor, insira um email válido";
    }
    if (message.includes("email") && message.includes("Required")) {
      return "O email é obrigatório";
    }
    if (message.includes("name") && message.includes("Required")) {
      return "O nome é obrigatório";
    }
    if (message.includes("password") && message.includes("Required")) {
      return "A senha é obrigatória";
    }
    // Retorna a mensagem original se não houver correspondência
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.register(form);
      router("/login");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || "Erro ao criar usuário";
      setError(formatErrorMessage(errorMessage));
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                    minLength={8}
                    className="focus:ring-2 focus:ring-amber-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {isPasswordFocused && (
                  <p className="text-xs text-gray-500 mt-1">
                    A senha deve conter no mínimo 8 caracteres
                  </p>
                )}
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
