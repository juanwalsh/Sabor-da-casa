'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Gift, Trophy, Crown, Sparkles, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  useLoyaltyStore,
  LOYALTY_LEVELS,
  LOYALTY_REWARDS,
  LoyaltyReward,
} from '@/store/loyaltyStore';
import { toast } from 'sonner';

const levelIcons = {
  bronze: Trophy,
  silver: Star,
  gold: Crown,
  platinum: Sparkles,
};

const levelColors = {
  bronze: 'text-amber-600 bg-amber-100',
  silver: 'text-slate-500 bg-slate-100',
  gold: 'text-yellow-500 bg-yellow-100',
  platinum: 'text-purple-500 bg-purple-100',
};

export function LoyaltyCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { points, level, getNextLevelProgress, redeemReward, history } = useLoyaltyStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const progress = getNextLevelProgress();
  const LevelIcon = levelIcons[level];

  const handleRedeem = (reward: LoyaltyReward) => {
    const success = redeemReward(reward);
    if (success) {
      toast.success(`${reward.name} resgatado!`, {
        description: 'Use no seu próximo pedido.',
      });
    } else {
      toast.error('Pontos insuficientes');
    }
  };

  return (
    <>
      {/* Mini Card - Trigger */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="w-full p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20 text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${levelColors[level]}`}>
              <LevelIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{LOYALTY_LEVELS[level].name}</p>
              <p className="text-xs text-muted-foreground">
                {points.toLocaleString()} pontos
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>

        {progress.progress < 100 && (
          <div className="mt-3">
            <Progress value={progress.progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {progress.next - progress.current} pontos para o próximo nível
            </p>
          </div>
        )}
      </motion.button>

      {/* Full Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Programa de Fidelidade
            </SheetTitle>
            <SheetDescription>
              Acumule pontos e troque por recompensas
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Current Level Card */}
            <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${levelColors[level]}`}>
                  <LevelIcon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Seu nível</p>
                  <p className="text-2xl font-bold">{LOYALTY_LEVELS[level].name}</p>
                  <p className="text-sm text-primary">
                    {LOYALTY_LEVELS[level].multiplier}x pontos por compra
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{points.toLocaleString()} pontos</span>
                  {progress.progress < 100 && (
                    <span className="text-muted-foreground">
                      Próximo: {progress.next.toLocaleString()}
                    </span>
                  )}
                </div>
                <Progress value={progress.progress} className="h-3" />
              </div>
            </div>

            {/* Available Rewards */}
            <div>
              <h3 className="font-semibold mb-3">Recompensas Disponíveis</h3>
              <div className="space-y-3">
                {LOYALTY_REWARDS.map((reward) => {
                  const canRedeem = points >= reward.pointsCost;
                  return (
                    <motion.div
                      key={reward.id}
                      whileHover={canRedeem ? { scale: 1.02 } : {}}
                      className={`p-4 rounded-xl border ${
                        canRedeem
                          ? 'bg-card hover:border-primary/30 cursor-pointer'
                          : 'bg-muted/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{reward.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {reward.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={canRedeem ? 'default' : 'secondary'}>
                            {reward.pointsCost} pts
                          </Badge>
                          {canRedeem && (
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={() => handleRedeem(reward)}
                            >
                              Resgatar
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* History */}
            <div>
              <h3 className="font-semibold mb-3">Histórico</h3>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma movimentação ainda
                </p>
              ) : (
                <div className="space-y-2">
                  {history.slice(0, 10).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm py-2"
                    >
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span
                        className={
                          item.type === 'earned' ? 'text-green-600' : 'text-red-600'
                        }
                      >
                        {item.type === 'earned' ? '+' : ''}
                        {item.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* How it works */}
            <div className="p-4 bg-muted/50 rounded-xl">
              <h4 className="font-medium mb-2">Como funciona?</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• A cada R$1 gasto você ganha 1 ponto</li>
                <li>• Níveis mais altos ganham mais pontos por compra</li>
                <li>• Troque seus pontos por descontos e brindes</li>
                <li>• Pontos não expiram!</li>
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function LoyaltyMiniWidget() {
  const [mounted, setMounted] = useState(false);
  const { points, level } = useLoyaltyStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const LevelIcon = levelIcons[level];

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${levelColors[level]}`}>
        <LevelIcon className="w-3 h-3" />
      </div>
      <span className="font-medium">{points} pts</span>
    </div>
  );
}
