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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
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

    // Validar se as senhas são iguais
    if (form.password !== confirmPassword) {
      setError("As senhas não coincidem. Por favor, verifique e tente novamente.");
      setLoading(false);
      return;
    }

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
      setConfirmPassword("");
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
    <div className="flex min-h-screen flex-col lg:flex-row bg-primary lg:bg-amber-50 dark:lg:bg-gray-900">
      <div className="lg:w-2/5 bg-primary dark:bg-gray-800 flex flex-col items-center justify-center p-12 text-white dark:text-gray-100">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-center leading-[1.2] text-white dark:text-white">
          Bem-vindo(a)!
        </h1>
        <p className="lg:text-lg text-amber-50 dark:text-gray-200 text-center max-w-xs text-base leading-[1.5]">
          Estamos felizes em ter você por aqui. Acesse sua conta e continue sua
          jornada conosco.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="hidden lg:flex mt-6 border-2 border-white dark:border-gray-200 text-amber-50 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700 transition-colors cursor-pointer text-base px-5 py-3 h-auto font-semibold"
          onClick={() => router("/login")}
        >
          Fazer Login
        </Button>
        <Button
          type="button"
          variant="link"
          onClick={() => router("/login")}
          className="lg:hidden flex text-white dark:text-gray-200 font-semibold underline hover:text-amber-200 dark:hover:text-gray-300 transition-colors pt-6 text-base"
        >
          Fazer Login
        </Button>
      </div>

      <div className="lg:w-3/5 flex items-center justify-center p-8 lg:p-1 bg-gray-50 dark:bg-gray-900 rounded-t-[35px] lg:rounded-none">
        <Card className="w-full max-w-md lg:p-8 rounded-2xl lg:shadow-xl border-none shadow-none lg:border-1 bg-gray-50 dark:bg-gray-800 lg:bg-white dark:lg:bg-gray-800 ">
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
              Não tem uma conta?
            </CardTitle>
            <p className="mt-2 text-primary dark:text-primary text-xl font-semibold">
              Cadastre-se{" "}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-gray-900 dark:text-gray-100 text-base font-semibold"
                >
                  Nome
                </Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-amber-400 h-11 text-base"
                />
              </div>
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
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    required
                    minLength={8}
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
                {isPasswordFocused && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 leading-[1.5]">
                    A senha deve conter no mínimo 8 caracteres
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-900 dark:text-gray-100 text-base font-semibold"
                >
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="focus:ring-2 focus:ring-amber-400 pr-12 h-11 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded p-1"
                    aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && form.password !== confirmPassword && (
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1 font-medium">
                    As senhas não coincidem
                  </p>
                )}
                {confirmPassword && form.password === confirmPassword && form.password.length >= 8 && (
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1 font-medium">
                    ✓ As senhas coincidem
                  </p>
                )}
              </div>
              {error && (
                <p className="text-red-700 dark:text-red-400 text-base mt-2 text-center font-medium">{error}</p>
              )}
              <Button
                type="submit"
                className="cursor-pointer w-full bg-primary hover:bg-primary-dark text-white dark:text-primary-foreground font-semibold py-3 rounded-lg transition-colors text-base h-12"
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
            <DialogTitle className="text-center text-xl md:text-2xl font-semibold">
              Conta criada com sucesso!
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2 leading-[1.5]">
              Sua conta foi criada corretamente.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2 text-base">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Nome:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {createdAccount?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Email:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100 truncate ml-2">
                  {createdAccount?.email}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-center pt-2">
            <Button
              onClick={handleGoToLogin}
              className="w-full bg-primary hover:bg-primary-dark text-white dark:text-primary-foreground text-lg h-12 font-semibold"
            >
              Ir para Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
