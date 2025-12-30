'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, Eye, EyeOff, UserCircle, LogIn, UserPlus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTab?: 'login' | 'register' | 'guest';
}

export function AuthModal({ isOpen, onClose, onSuccess, defaultTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register' | 'guest'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, setGuestMode, isLoading, error } = useUserStore();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab, isOpen]);

  const handleLogin = async (data: LoginFormData) => {
    const success = await login(data.email, data.password);
    if (success) {
      toast.success('Login realizado com sucesso!');
      onSuccess?.();
      onClose();
    } else {
      toast.error(error || 'Erro ao fazer login');
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    const success = await register({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
    if (success) {
      toast.success('Conta criada com sucesso!');
      onSuccess?.();
      onClose();
    } else {
      toast.error(error || 'Erro ao criar conta');
    }
  };

  const handleGuestMode = () => {
    setGuestMode();
    toast.success('Continuando como convidado');
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {tab === 'login' && 'Entrar na conta'}
            {tab === 'register' && 'Criar conta'}
            {tab === 'guest' && 'Continuar como convidado'}
          </DialogTitle>
          <DialogDescription>
            {tab === 'login' && 'Acesse sua conta para acompanhar pedidos e ganhar pontos'}
            {tab === 'register' && 'Crie sua conta e comece a acumular benefícios'}
            {tab === 'guest' && 'Faça seu pedido sem precisar criar uma conta'}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Selector */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              tab === 'login'
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LogIn className="w-4 h-4 inline mr-1" />
            Entrar
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              tab === 'register'
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-1" />
            Criar conta
          </button>
          <button
            onClick={() => setTab('guest')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              tab === 'guest'
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserCircle className="w-4 h-4 inline mr-1" />
            Convidado
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Login Form */}
          {tab === 'login' && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    {...loginForm.register('email')}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    className="pl-10 pr-10"
                    {...loginForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Demo: use qualquer email com senha "123456"
              </p>
            </motion.form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="register-name">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="register-name"
                    placeholder="Seu nome"
                    className="pl-10"
                    {...registerForm.register('name')}
                  />
                </div>
                {registerForm.formState.errors.name && (
                  <p className="text-xs text-destructive">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    {...registerForm.register('email')}
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-xs text-destructive">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="register-phone"
                    placeholder="(11) 99999-9999"
                    className="pl-10"
                    {...registerForm.register('phone')}
                  />
                </div>
                {registerForm.formState.errors.phone && (
                  <p className="text-xs text-destructive">
                    {registerForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Crie uma senha"
                    className="pl-10 pr-10"
                    {...registerForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-xs text-destructive">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="register-confirm"
                    type="password"
                    placeholder="Confirme a senha"
                    className="pl-10"
                    {...registerForm.register('confirmPassword')}
                  />
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </motion.form>
          )}

          {/* Guest Mode */}
          {tab === 'guest' && (
            <motion.div
              key="guest"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="p-4 bg-muted/50 rounded-xl">
                <h4 className="font-medium mb-2">Como convidado você pode:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Fazer pedidos normalmente</li>
                  <li>• Pagar via WhatsApp/Pix</li>
                </ul>
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                <h4 className="font-medium mb-2">Criando uma conta você ganha:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Pontos de fidelidade a cada compra</li>
                  <li>• Histórico de pedidos</li>
                  <li>• Endereços salvos</li>
                  <li>• Ofertas exclusivas</li>
                </ul>
              </div>

              <Button onClick={handleGuestMode} className="w-full" variant="outline">
                <UserCircle className="w-4 h-4 mr-2" />
                Continuar como convidado
              </Button>

              <Separator />

              <Button onClick={() => setTab('register')} className="w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                Criar conta e ganhar benefícios
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
