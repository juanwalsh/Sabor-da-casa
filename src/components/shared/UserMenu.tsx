'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, LogIn, UserPlus, Loader2, UserX, Mail, Settings } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type AuthMode = 'login' | 'register' | 'guest';

const tabs = [
  { id: 'login' as const, label: 'Entrar', icon: LogIn },
  { id: 'register' as const, label: 'Criar Conta', icon: UserPlus },
  { id: 'guest' as const, label: 'Convidado', icon: UserX },
];

export default function UserMenu() {
  const { user, isAuthenticated, isLoading, error, login, register, logout, setGuestMode } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === 'login') {
      const success = await login(formData.email, formData.password);
      if (success) {
        toast.success('Login realizado com sucesso!');
        setIsOpen(false);
        resetForm();
      }
    } else if (authMode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        toast.error('As senhas nao coincidem');
        return;
      }
      const success = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      if (success) {
        toast.success('Conta criada! Verifique seu email para confirmar.', {
          icon: <Mail className="w-4 h-4" />,
          duration: 5000,
        });
        setIsOpen(false);
        resetForm();
      }
    } else if (authMode === 'guest') {
      setGuestMode();
      toast.success('Modo convidado ativado!');
      setIsOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    setShowResetPassword(false);
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logout realizado com sucesso!');
  };

  const handleResetPassword = async () => {
    const { resetPassword } = useUserStore.getState();
    const success = await resetPassword(formData.email);
    if (success) {
      toast.success('Email de recuperacao enviado!');
      setShowResetPassword(false);
    }
  };

  const activeTabIndex = tabs.findIndex(tab => tab.id === authMode);

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/configuracoes" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Configuracoes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => {
          setAuthMode('login');
          setIsOpen(true);
        }}
      >
        <User className="w-5 h-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          {/* Tabs Header */}
          <div className="relative border-b bg-muted/30">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = authMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAuthMode(tab.id)}
                    className={`flex-1 flex flex-col items-center gap-1 py-4 px-2 transition-colors relative z-10 ${
                      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            {/* Sliding indicator */}
            <motion.div
              className="absolute bottom-0 h-0.5 bg-primary"
              initial={false}
              animate={{
                left: `${(activeTabIndex / tabs.length) * 100}%`,
                width: `${100 / tabs.length}%`,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Content */}
          <div className="p-6 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={authMode}
                initial={{ opacity: 0, x: authMode === 'login' ? -20 : authMode === 'register' ? 0 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: authMode === 'login' ? 20 : authMode === 'register' ? 0 : -20 }}
                transition={{ duration: 0.2 }}
              >
                {authMode === 'guest' ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                      <UserX className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Continuar como Convidado</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Faca pedidos sem criar uma conta. Seus dados nao serao salvos.
                      </p>
                    </div>
                    <Button onClick={handleSubmit} className="w-full" size="lg">
                      <UserX className="w-4 h-4 mr-2" />
                      Entrar como Convidado
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {authMode === 'register' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome</Label>
                          <Input
                            id="name"
                            placeholder="Seu nome completo"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(11) 99999-9999"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    {!showResetPassword && (
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Minimo 6 caracteres"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>
                    )}

                    {authMode === 'register' && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Repita a senha"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>
                    )}

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive bg-destructive/10 p-2 rounded"
                      >
                        {error}
                      </motion.p>
                    )}

                    {showResetPassword ? (
                      <div className="space-y-3">
                        <Button
                          type="button"
                          onClick={handleResetPassword}
                          className="w-full"
                          disabled={isLoading || !formData.email}
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar Email de Recuperacao'}
                        </Button>
                        <button
                          type="button"
                          className="w-full text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setShowResetPassword(false)}
                        >
                          Voltar ao login
                        </button>
                      </div>
                    ) : (
                      <>
                        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              {authMode === 'login' && (
                                <>
                                  <LogIn className="w-4 h-4 mr-2" />
                                  Entrar
                                </>
                              )}
                              {authMode === 'register' && (
                                <>
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  Criar Conta
                                </>
                              )}
                            </>
                          )}
                        </Button>

                        {authMode === 'login' && (
                          <button
                            type="button"
                            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setShowResetPassword(true)}
                          >
                            Esqueci minha senha
                          </button>
                        )}

                        {authMode === 'register' && (
                          <p className="text-xs text-center text-muted-foreground">
                            Ao criar conta, voce recebera um email de verificacao
                          </p>
                        )}
                      </>
                    )}
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
