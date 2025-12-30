'use client';

import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavoritesStore } from '@/store/favoritesStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  productId: string;
  productName: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ productId, productName, className, size = 'md' }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isLiked = isFavorite(productId);

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(productId);

    if (!isLiked) {
      toast.success(`${productName} adicionado aos favoritos!`);
    } else {
      toast.info(`${productName} removido dos favoritos`);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={cn(
        'rounded-full flex items-center justify-center transition-colors',
        'bg-card/90 dark:bg-background/90 backdrop-blur-sm shadow-sm border border-border/50',
        'hover:bg-card dark:hover:bg-background',
        sizeClasses[size],
        className
      )}
      aria-label={isLiked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <motion.div
        initial={false}
        animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={cn(
            iconSizes[size],
            isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
          )}
        />
      </motion.div>
    </motion.button>
  );
}
