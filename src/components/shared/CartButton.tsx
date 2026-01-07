'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Badge } from '@/components/ui/badge';

export default function CartButton() {
  const { openCart, getItemCount, isAnimating } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar hydration mismatch - só mostrar contagem após montagem
  const itemCount = mounted ? getItemCount() : 0;

  return (
    <motion.button
      onClick={openCart}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isAnimating ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="relative p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
    >
      <ShoppingBag className="w-5 h-5" />
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1"
          >
            <Badge
              variant="secondary"
              className="h-5 w-5 p-0 flex items-center justify-center text-xs font-bold bg-secondary text-secondary-foreground border-2 border-background"
            >
              {itemCount > 9 ? '9+' : itemCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add to cart animation ripple */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-full bg-secondary"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
