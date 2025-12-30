'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  Palette,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Shield,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    resetPassword,
  } = useUserStore();

  const [mounted, setMounted] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [addressData, setAddressData] = useState({
    label: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [sendingResetEmail, setSendingResetEmail] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        phone: user.phone,
      });
    }
  }, [user]);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateProfile(profileData);
    setEditingProfile(false);
    toast.success('Perfil atualizado!');
  };

  const handleSaveAddress = () => {
    if (editingAddress) {
      updateAddress(editingAddress, addressData);
      toast.success('Endereco atualizado!');
    } else {
      addAddress(addressData);
      toast.success('Endereco adicionado!');
    }
    setShowAddressModal(false);
    setEditingAddress(null);
    resetAddressForm();
  };

  const handleEditAddress = (id: string) => {
    const address = user.addresses.find((a) => a.id === id);
    if (address) {
      setAddressData({
        label: address.label,
        street: address.street,
        number: address.number,
        complement: address.complement || '',
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        isDefault: address.isDefault,
      });
      setEditingAddress(id);
      setShowAddressModal(true);
    }
  };

  const handleDeleteAddress = (id: string) => {
    removeAddress(id);
    toast.success('Endereco removido!');
  };

  const resetAddressForm = () => {
    setAddressData({
      label: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false,
    });
  };

  const handleResetPassword = async () => {
    setSendingResetEmail(true);
    const success = await resetPassword(user.email);
    setSendingResetEmail(false);
    if (success) {
      toast.success('Email de recuperacao enviado!');
    } else {
      toast.error('Erro ao enviar email');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
    toast.success('Voce saiu da conta');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Configuracoes</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Perfil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Meus Dados</CardTitle>
                    <CardDescription>Informacoes da sua conta</CardDescription>
                  </div>
                </div>
                {!editingProfile && (
                  <Button variant="ghost" size="sm" onClick={() => setEditingProfile(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingProfile ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile}>
                      <Check className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                    <Button variant="outline" onClick={() => setEditingProfile(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">{user.phone || 'Nao informado'}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Enderecos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Enderecos</CardTitle>
                    <CardDescription>Gerencie seus enderecos de entrega</CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    resetAddressForm();
                    setEditingAddress(null);
                    setShowAddressModal(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {user.addresses.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum endereco cadastrado
                </p>
              ) : (
                <div className="space-y-3">
                  {user.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{address.label}</span>
                          {address.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Padrao
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {address.street}, {address.number}
                          {address.complement && ` - ${address.complement}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.neighborhood}, {address.city} - {address.state}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.zipCode}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!address.isDefault && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setDefaultAddress(address.id);
                              toast.success('Endereco padrao atualizado!');
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditAddress(address.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Seguranca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Seguranca</CardTitle>
                  <CardDescription>Configuracoes de seguranca da conta</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={handleResetPassword}
                disabled={sendingResetEmail}
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5" />
                  <span>Alterar senha</span>
                </div>
                {sendingResetEmail ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Um email sera enviado para redefinir sua senha
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preferencias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Preferencias</CardTitle>
                  <CardDescription>Personalize sua experiencia</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Tema</p>
                    <p className="text-sm text-muted-foreground">Escolha o tema do app</p>
                  </div>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sair */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair da conta
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modal de Endereco */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Editar Endereco' : 'Novo Endereco'}</DialogTitle>
            <DialogDescription>Preencha os dados do endereco</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Identificacao (ex: Casa, Trabalho)</Label>
              <Input
                value={addressData.label}
                onChange={(e) => setAddressData({ ...addressData, label: e.target.value })}
                placeholder="Casa"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-2">
                <Label>Rua</Label>
                <Input
                  value={addressData.street}
                  onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Numero</Label>
                <Input
                  value={addressData.number}
                  onChange={(e) => setAddressData({ ...addressData, number: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Complemento</Label>
              <Input
                value={addressData.complement}
                onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })}
                placeholder="Apto, Bloco, etc"
              />
            </div>
            <div className="space-y-2">
              <Label>Bairro</Label>
              <Input
                value={addressData.neighborhood}
                onChange={(e) => setAddressData({ ...addressData, neighborhood: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-2">
                <Label>Cidade</Label>
                <Input
                  value={addressData.city}
                  onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input
                  value={addressData.state}
                  onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>CEP</Label>
              <Input
                value={addressData.zipCode}
                onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
                placeholder="00000-000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddressModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAddress}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmacao de Logout */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sair da conta</DialogTitle>
            <DialogDescription>Tem certeza que deseja sair?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
