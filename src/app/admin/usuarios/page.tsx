'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  Star,
  Plus,
  Minus,
  History,
  Crown,
  Medal,
  Award,
  Trophy,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Gift,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdminUsersStore, AdminUser } from '@/store/adminUsersStore';
import { toast } from 'sonner';

const levelConfig = {
  bronze: { icon: Medal, color: 'text-amber-700', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Bronze' },
  silver: { icon: Award, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800/50', label: 'Prata' },
  gold: { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Ouro' },
  platinum: { icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30', label: 'Platina' },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function UserCard({
  user,
  onAddPoints,
  onRemovePoints,
}: {
  user: AdminUser;
  onAddPoints: (user: AdminUser) => void;
  onRemovePoints: (user: AdminUser) => void;
}) {
  const [showHistory, setShowHistory] = useState(false);
  const levelInfo = levelConfig[user.level];
  const LevelIcon = levelInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-3 sm:p-4 lg:p-6 border-b border-border">
            {/* Mobile: Stack layout */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              {/* User Info */}
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                {/* Avatar with Level */}
                <div className={`relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full ${levelInfo.bg} flex items-center justify-center shrink-0`}>
                  <span className="text-base sm:text-lg lg:text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-card border-2 border-border flex items-center justify-center">
                    <LevelIcon className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${levelInfo.color}`} />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg truncate">{user.name}</h3>
                    <Badge variant="secondary" className={`${levelInfo.bg} ${levelInfo.color} text-xs sm:text-xs px-1.5 py-0`}>
                      {levelInfo.label}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate flex items-center gap-1">
                    <Mail className="w-3 h-3 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                </div>
              </div>

              {/* Points Display */}
              <div className="flex items-center justify-between sm:justify-end sm:text-right bg-muted/30 sm:bg-transparent rounded-lg p-2 sm:p-0 -mx-1 sm:mx-0">
                <span className="text-xs text-muted-foreground sm:hidden">Pontos:</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-primary" />
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">{user.points.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* Stats - Compact on mobile */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-xs sm:text-xs text-muted-foreground">Ganho</p>
                <p className="font-semibold text-xs sm:text-sm flex items-center justify-center gap-0.5 sm:gap-1">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  <span className="truncate">{user.totalPointsEarned.toLocaleString('pt-BR')}</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-xs text-muted-foreground">Desde</p>
                <p className="font-semibold text-xs sm:text-sm">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-xs text-muted-foreground">Trans.</p>
                <p className="font-semibold text-xs sm:text-sm">{user.pointsHistory.length}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2 sm:p-3 lg:p-4 bg-muted/30 flex items-center gap-1.5 sm:gap-2">
            <Button
              size="sm"
              onClick={() => onAddPoints(user)}
              className="gap-1 text-xs sm:text-sm h-11 lg:h-9 px-2 sm:px-3 flex-1 sm:flex-none"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="sm:hidden">+</span>
              <span className="hidden sm:inline">Adicionar</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRemovePoints(user)}
              className="gap-1 text-xs sm:text-sm h-11 lg:h-9 px-2 sm:px-3 flex-1 sm:flex-none"
            >
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="sm:hidden">-</span>
              <span className="hidden sm:inline">Remover</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-1 text-xs sm:text-sm h-11 lg:h-9 px-2 sm:px-3 ml-auto"
            >
              <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Historico</span>
              {showHistory ? (
                <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </Button>
          </div>

          {/* History */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-2 sm:p-4 border-t border-border max-h-48 sm:max-h-64 overflow-y-auto">
                  {user.pointsHistory.length === 0 ? (
                    <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">
                      Nenhuma transacao
                    </p>
                  ) : (
                    <div className="space-y-1.5 sm:space-y-2">
                      {user.pointsHistory.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between gap-2 text-xs sm:text-sm p-1.5 sm:p-2 rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <div
                              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                                entry.points >= 0
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                              }`}
                            >
                              {entry.points >= 0 ? (
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                              ) : (
                                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate text-xs sm:text-sm">{entry.description}</p>
                              <p className="text-xs sm:text-xs text-muted-foreground truncate">
                                {new Date(entry.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`font-bold shrink-0 text-xs sm:text-sm ${
                              entry.points >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {entry.points >= 0 ? '+' : ''}
                            {entry.points.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Componente de mensagem de sucesso
function SuccessOverlay({
  show,
  message,
  type,
  onClose,
}: {
  show: boolean;
  message: string;
  type: 'add' | 'remove';
  onClose: () => void;
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className={`bg-card rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-2xl border-2 ${
              type === 'add' ? 'border-green-500' : 'border-red-500'
            } max-w-xs sm:max-w-md w-full`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center ${
                  type === 'add'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}
              >
                <CheckCircle2
                  className={`w-7 h-7 sm:w-10 sm:h-10 ${
                    type === 'add' ? 'text-green-500' : 'text-red-500'
                  }`}
                />
              </motion.div>
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2"
              >
                {type === 'add' ? 'Pontos Adicionados!' : 'Pontos Removidos!'}
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs sm:text-sm text-muted-foreground"
              >
                {message}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AdminUsuariosPage() {
  const { users, searchUsers, addPoints, removePoints } = useAdminUsersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'remove'>('add');
  const [pointsAmount, setPointsAmount] = useState('');
  const [pointsDescription, setPointsDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successType, setSuccessType] = useState<'add' | 'remove'>('add');

  // Calcula preview de pontos
  const pointsPreview = useMemo(() => {
    if (!selectedUser || !pointsAmount) return null;
    const amount = parseInt(pointsAmount, 10);
    if (isNaN(amount) || amount <= 0) return null;

    const currentPoints = selectedUser.points;
    const newPoints = dialogMode === 'add'
      ? currentPoints + amount
      : Math.max(0, currentPoints - amount);

    return { current: currentPoints, new: newPoints, change: amount };
  }, [selectedUser, pointsAmount, dialogMode]);

  const filteredUsers = useMemo(() => {
    return searchUsers(searchQuery);
  }, [searchUsers, searchQuery]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalPoints = users.reduce((sum, u) => sum + u.points, 0);
    const levelCounts = users.reduce(
      (acc, u) => {
        acc[u.level]++;
        return acc;
      },
      { bronze: 0, silver: 0, gold: 0, platinum: 0 }
    );
    return { totalUsers, totalPoints, levelCounts };
  }, [users]);

  const handleOpenDialog = (user: AdminUser, mode: 'add' | 'remove') => {
    setSelectedUser(user);
    setDialogMode(mode);
    setPointsAmount('');
    setPointsDescription('');
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setPointsAmount('');
    setPointsDescription('');
  };

  const handleSubmitPoints = () => {
    if (!selectedUser || !pointsAmount) return;

    const amount = parseInt(pointsAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Digite uma quantidade valida de pontos');
      return;
    }

    const description = pointsDescription.trim() || (dialogMode === 'add' ? 'Pontos adicionados manualmente' : 'Pontos removidos manualmente');
    const userName = selectedUser.name;
    const newBalance = dialogMode === 'add'
      ? selectedUser.points + amount
      : Math.max(0, selectedUser.points - amount);

    if (dialogMode === 'add') {
      addPoints(selectedUser.id, amount, description, 'Admin');
    } else {
      removePoints(selectedUser.id, amount, description, 'Admin');
    }

    handleCloseDialog();

    // Mostrar mensagem de sucesso
    setSuccessType(dialogMode);
    setSuccessMessage(
      `${amount.toLocaleString('pt-BR')} pontos ${dialogMode === 'add' ? 'adicionados para' : 'removidos de'} ${userName}. Novo saldo: ${newBalance.toLocaleString('pt-BR')} pontos.`
    );
    setShowSuccess(true);
  };

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold">Usuarios</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
          Gerencie pontos de fidelidade
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-1 sm:mb-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-xs sm:text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-yellow-500/10 flex items-center justify-center mb-1 sm:mb-0">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold truncate">{stats.totalPoints.toLocaleString('pt-BR')}</p>
                <p className="text-xs sm:text-xs text-muted-foreground">Pontos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/10 flex items-center justify-center mb-1 sm:mb-0">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{stats.levelCounts.platinum + stats.levelCounts.gold}</p>
                <p className="text-xs sm:text-xs text-muted-foreground">VIP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-500/10 flex items-center justify-center mb-1 sm:mb-0">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold">{stats.levelCounts.silver + stats.levelCounts.bronze}</p>
                <p className="text-xs sm:text-xs text-muted-foreground">Regular</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
          <CardTitle className="text-sm sm:text-lg">Buscar</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Email, nome ou telefone
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm"
            />
          </div>
          {searchQuery && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              {filteredUsers.length} encontrado(s)
            </p>
          )}
        </CardContent>
      </Card>

      {/* User List */}
      <div className="space-y-2 sm:space-y-4">
        <h2 className="font-semibold text-sm sm:text-lg">
          {searchQuery ? 'Resultados' : 'Usuarios'}
        </h2>

        <AnimatePresence mode="popLayout">
          {filteredUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 sm:py-12"
            >
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                {searchQuery
                  ? 'Nenhum usuario encontrado'
                  : 'Nenhum usuario cadastrado'}
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-2 sm:gap-4">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onAddPoints={(u) => handleOpenDialog(u, 'add')}
                  onRemovePoints={(u) => handleOpenDialog(u, 'remove')}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Points Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-md mx-2 sm:mx-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {dialogMode === 'add' ? 'Adicionar Pontos' : 'Remover Pontos'}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {selectedUser && (
                <>
                  <strong className="truncate block">{selectedUser.name}</strong>
                  <span className="text-primary font-medium">
                    Saldo: {selectedUser.points.toLocaleString('pt-BR')} pts
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="points" className="text-xs sm:text-sm">Quantidade</Label>
              <Input
                id="points"
                type="number"
                placeholder="Ex: 100"
                value={pointsAmount}
                onChange={(e) => setPointsAmount(e.target.value)}
                min="1"
                className="h-10 sm:h-11 text-sm"
              />
            </div>

            {/* Preview de pontos */}
            <AnimatePresence>
              {pointsPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${
                    dialogMode === 'add'
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <div className="text-center">
                        <p className="text-xs sm:text-xs text-muted-foreground">Atual</p>
                        <p className="text-base sm:text-xl font-bold">{pointsPreview.current.toLocaleString('pt-BR')}</p>
                      </div>
                      <ArrowRight className={`w-4 h-4 sm:w-6 sm:h-6 ${
                        dialogMode === 'add' ? 'text-green-500' : 'text-red-500'
                      }`} />
                      <div className="text-center">
                        <p className="text-xs sm:text-xs text-muted-foreground">Novo</p>
                        <p className={`text-lg sm:text-2xl font-bold ${
                          dialogMode === 'add' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {pointsPreview.new.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">Motivo (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Ex: Bonus, Resgate..."
                value={pointsDescription}
                onChange={(e) => setPointsDescription(e.target.value)}
                rows={2}
                className="text-sm resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCloseDialog} size="sm" className="flex-1 sm:flex-none">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitPoints}
              variant={dialogMode === 'add' ? 'default' : 'destructive'}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              {dialogMode === 'add' ? (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </>
              ) : (
                <>
                  <Minus className="w-4 h-4 mr-1" />
                  Remover
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Overlay */}
      <SuccessOverlay
        show={showSuccess}
        message={successMessage}
        type={successType}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
