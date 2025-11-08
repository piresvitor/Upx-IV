"use client";

import { useState } from "react";
import { authService } from "@/services/authService";
import type { RegisterData } from "@/services/authService";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

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
  const [successModal, setSuccessModal] = useState(false);
  const [createdAccount, setCreatedAccount] = useState<{ name: string; email: string } | null>(null);

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
      // Salvar os dados do formulário antes de limpar
      const accountData = {
        name: form.name,
        email: form.email,
      };

      await authService.register(form);
      
      // Definir os dados da conta criada e mostrar o modal
      setCreatedAccount(accountData);
      setSuccessModal(true);
      
      // Limpar o formulário após sucesso
      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || "Erro ao criar usuário";
      setError(formatErrorMessage(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    setSuccessModal(false);
    // Redirecionar para login com o email como parâmetro
    if (createdAccount?.email) {
      router(`/login?email=${encodeURIComponent(createdAccount.email)}`);
    } else {
      router("/login");
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

      {/* Modal de Sucesso */}
      <Dialog open={successModal} onOpenChange={setSuccessModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center justify-center mb-2">
              <div className="rounded-full bg-green-100 p-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-lg">
              Conta criada com sucesso!
            </DialogTitle>
            <DialogDescription className="text-center text-sm pt-1">
              Sua conta foi criada corretamente.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Nome:</span>
                <span className="font-semibold text-gray-900">
                  {createdAccount?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold text-gray-900 truncate ml-2">
                  {createdAccount?.email}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-center pt-2">
            <Button
              onClick={handleGoToLogin}
              className="w-full bg-primary hover:bg-primary-dark text-white text-sm"
            >
              Ir para Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
