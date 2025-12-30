'use client';

import { motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice, getComboSuggestions } from '@/data/mockData';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ComboSuggestions() {
  const { items, addItem } = useCartStore();

  // Pega as categorias dos itens no carrinho
  const cartCategoryIds = [...new Set(items.map(item => item.product.categoryId))];

  // Pega sugestões baseadas nas categorias
  const suggestions = getComboSuggestions(cartCategoryIds);

  // Filtra produtos que já estão no carrinho
  const filteredSuggestions = suggestions.filter(
    product => !items.find(item => item.product.id === product.id)
  );

  if (filteredSuggestions.length === 0) return null;

  const handleAddItem = (product: Product) => {
    addItem(product, 1);
    toast.success(`${product.name} adicionado!`, {
      description: formatPrice(product.price),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-secondary/10 rounded-xl p-3 sm:p-4 mx-4 sm:mx-6 mb-3 sm:mb-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-secondary" />
        <span className="text-xs sm:text-sm font-medium text-secondary-foreground">
          Combine seu pedido
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {filteredSuggestions.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.02 }}
            className="flex-shrink-0 w-[120px] sm:w-[140px] bg-card rounded-lg border border-border overflow-hidden"
          >
            <div className="relative h-16 sm:h-20">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="140px"
                className="object-cover"
              />
            </div>
            <div className="p-2">
              <p className="text-[10px] sm:text-xs font-medium truncate">{product.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-primary">
                  +{formatPrice(product.price)}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleAddItem(product)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
