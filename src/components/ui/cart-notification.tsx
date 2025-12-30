'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/data/mockData';
import { Button } from '@/components/ui/button';

export function CartNotification() {
  const { items, getSubtotal, getItemCount, openCart } = useCartStore();
  const [showNotification, setShowNotification] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Verifica se há itens no carrinho ao montar o componente
    const hasItems = items.length > 0;

    // Verifica se já foi mostrado recentemente
    const lastShown = localStorage.getItem('cart-notification-shown');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (hasItems && (!lastShown || now - parseInt(lastShown) > oneHour) && !dismissed) {
      // Mostra após 2 segundos
      const timer = setTimeout(() => {
        setShowNotification(true);
        localStorage.setItem('cart-notification-shown', now.toString());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [items, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowNotification(false);
  };

  const handleViewCart = () => {
    openCart();
    handleDismiss();
  };

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 100, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 100, x: '-50%' }}
          className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
        >
          <div className="bg-card rounded-2xl shadow-2xl border border-border p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Você tem itens no carrinho!</p>
              <p className="text-xs text-muted-foreground">
                {getItemCount()} {getItemCount() === 1 ? 'item' : 'itens'} - {formatPrice(getSubtotal())}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={handleViewCart}
                className="rounded-xl"
              >
                Ver
              </Button>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
