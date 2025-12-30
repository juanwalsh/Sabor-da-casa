'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChefHat,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Mail,
  Lock,
  Shield,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const success = await login(data.email, data.password);
    setIsLoading(false);

    if (success) {
      toast.success('Login realizado com sucesso!');
      router.push('/admin');
    } else {
      toast.error('Credenciais invalidas', {
        description: 'Verifique seu email e senha',
      });
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-background">
      {/* Hero Visual - Decoracao na direita */}
      <div className="hidden xl:block fixed right-0 top-0 w-[35%] h-screen overflow-hidden">
        {/* Background gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />

        {/* Blobs animados */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 -left-4 w-72 h-72 bg-white/20 rounded-full mix-blend-overlay filter blur-xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute top-0 -right-4 w-72 h-72 bg-white/15 rounded-full mix-blend-overlay filter blur-xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.35, 0.25],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className="absolute -bottom-8 left-20 w-72 h-72 bg-white/20 rounded-full mix-blend-overlay filter blur-xl"
        />

        {/* Conteudo Hero */}
        <div className="relative z-10 flex items-center justify-center p-8 lg:p-12 w-full h-full">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center space-y-6 max-w-md"
          >
            {/* Icone Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-sm mb-4"
            >
              <KeyRound className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Painel Administrativo
            </h2>
            <p className="text-lg text-white/80">
              Gerencie seu restaurante com facilidade. Controle pedidos, produtos e acompanhe suas metricas em tempo real.
            </p>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 pt-4">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/60" />
              <div className="w-8 h-2 rounded-full bg-white" />
            </div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-3 pt-4"
            >
              {['Dashboard', 'Pedidos', 'Produtos'].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium border border-white/20"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Footer do hero */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-white/60 text-sm flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Acesso seguro e protegido
          </p>
        </div>
      </div>

      {/* Formulario - Centralizado na tela inteira */}
      <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10 overflow-hidden">
        {/* Elementos decorativos sutis - hidden em mobile */}
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="hidden sm:block absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 mb-4"
            >
              <ChefHat className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Bem-vindo de volta
            </h1>
            <p className="text-muted-foreground">
              Acesse o painel administrativo
            </p>
          </div>

          {/* Card do Formulario */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/5"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="h-11 pl-10 rounded-xl border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="admin@email.com"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Senha
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="h-11 pl-10 pr-10 rounded-xl border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              {/* Botao Submit */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full h-11 rounded-xl font-medium text-base bg-gradient-to-t from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/90 hover:to-primary/80 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  'Acessar Painel'
                )}
              </Button>

              {/* Divisor */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Demonstracao
                  </span>
                </div>
              </div>

              {/* Credenciais Demo */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-muted/60 to-muted/40 border border-border/50">
                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <code className="bg-background/80 px-2.5 py-1 rounded-lg text-xs font-mono text-foreground">
                      admin@sabordacasa.com.br
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Senha:</span>
                    <code className="bg-background/80 px-2.5 py-1 rounded-lg text-xs font-mono text-foreground">
                      admin123
                    </code>
                  </div>
                </div>
              </div>
            </form>

            {/* Link voltar */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Voltar ao site
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
