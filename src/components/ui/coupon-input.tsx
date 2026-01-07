'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCouponStore } from '@/store/couponStore';
import { formatPrice } from '@/data/mockData';
import { toast } from 'sonner';

interface CouponInputProps {
  subtotal: number;
}

export function CouponInput({ subtotal }: CouponInputProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { appliedCoupon, applyCoupon, removeCoupon, calculateDiscount } = useCouponStore();

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsLoading(true);

    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = applyCoupon(code, subtotal);

    if (result.success) {
      toast.success(result.message);
      setCode('');
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  const handleRemove = () => {
    removeCoupon();
    toast.info('Cupom removido');
  };

  const discount = calculateDiscount(subtotal);

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {appliedCoupon ? (
          <motion.div
            key="applied"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between bg-secondary/10 rounded-xl p-3 border border-secondary/20"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium">{appliedCoupon.code}</p>
                <p className="text-xs text-secondary">-{formatPrice(discount)}</p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-1.5 rounded-full hover:bg-secondary/20 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Codigo do cupom"
                className="pl-9 rounded-xl"
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              />
            </div>
            <Button
              onClick={handleApply}
              disabled={!code.trim() || isLoading}
              variant="outline"
              className="rounded-xl shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Aplicar'
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {!appliedCoupon && (
                          <p className="text-xs text-muted-foreground text-center">          Cupons disponiveis: BEMVINDO10, SABOR15
        </p>
      )}
    </div>
  );
}
