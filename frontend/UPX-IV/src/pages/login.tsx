"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LoginData } from "@/services/authService";
import { useAuthContext } from "@/context/useAuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthContext();
  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Preencher email se vier como parâmetro da URL
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setForm((prev) => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const handleChange = (field: keyof LoginData, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token } = await authService.login(form);

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub;

      login(token, userId);
      
      // Aguarda o próximo ciclo de renderização para garantir que o estado seja atualizado
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(undefined);
        }, 0);
      });
      
      router("/map");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-white dark:bg-gray-900 lg:bg-amber-50">
      <div className="lg:w-2/5 bg-primary dark:bg-gray-800 flex flex-col items-center justify-center p-12 text-white dark:text-gray-100">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-center leading-[1.2] text-white dark:text-white">
          Olá de novo!
        </h1>
        <p className="lg:text-lg text-amber-50 dark:text-gray-200 text-center max-w-xs text-base leading-[1.5]">
          Acesse sua conta e continue sua jornada conosco.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="hidden lg:flex mt-6 border-2 border-white dark:border-gray-200 text-amber-50 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700 transition-colors cursor-pointer text-base px-5 py-3 h-auto font-semibold"
          onClick={() => router("/account/register")}
        >
          Criar Conta
        </Button>
        <Button
          type="button"
          variant="link"
          onClick={() => router("/account/register")}
          className="lg:hidden flex text-white dark:text-gray-200 font-semibold underline hover:text-amber-200 dark:hover:text-gray-300 transition-colors pt-6 text-base"
        >
          Criar Conta
        </Button>
      </div>

      <div className="lg:w-3/5 flex items-center justify-center p-8 lg:p-1 bg-gray-50 dark:bg-gray-900 rounded-t-[35px] lg:rounded-none">
        <Card className="w-full max-w-md lg:p-8 rounded-2xl lg:shadow-xl border-none shadow-none lg:border-1 bg-gray-50 dark:bg-gray-800 lg:bg-white dark:lg:bg-gray-800 ">
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-primary dark:text-primary">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-900 dark:text-gray-100 text-base font-semibold"
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
                  className="focus:ring-2 focus:ring-amber-400 h-11 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-900 dark:text-gray-100 text-base font-semibold"
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
                    required
                    className="focus:ring-2 focus:ring-amber-400 pr-12 h-11 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded p-1"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-red-700 dark:text-red-400 text-base mt-2 text-center font-medium">{error}</p>
              )}
              <Button
                type="submit"
                className="cursor-pointer w-full bg-primary hover:bg-primary-dark text-white dark:text-primary-foreground font-semibold py-3 rounded-lg transition-colors text-base h-12"
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
