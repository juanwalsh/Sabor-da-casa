'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, Clock } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types';
import { products, formatPrice, categories } from '@/data/mockData';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string;
  tags?: string[];
  maxProducts?: number;
  onProductClick?: (product: Product) => void;
  className?: string;
}

export function RelatedProducts({
  currentProductId,
  categoryId,
  tags = [],
  maxProducts = 4,
  onProductClick,
  className = '',
}: RelatedProductsProps) {
  const { addItem, openCart } = useCartStore();

  const relatedProducts = useMemo((): Product[] => {
    // Pontuacao para cada produto
    const scoredProducts = products
      .filter((p) => p.id !== currentProductId && p.active)
      .map((product) => {
        let score = 0;

        // Mesma categoria = +3 pontos
        if (product.categoryId === categoryId) {
          score += 3;
        }

        // Tags em comum = +1 ponto por tag
        if (product.tags && tags.length > 0) {
          const commonTags = product.tags.filter((t) => tags.includes(t));
          score += commonTags.length;
        }

        // Produto em destaque = +2 pontos
        if (product.featured) {
          score += 2;
        }

        return { product, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxProducts)
      .map((item) => item.product);

    // Se nao houver produtos relacionados suficientes, pegar produtos em destaque
    if (scoredProducts.length < maxProducts) {
      const featuredProducts = products
        .filter(
          (p) =>
            p.id !== currentProductId &&
            p.active &&
            p.featured &&
            !scoredProducts.find((r) => r.id === p.id)
        )
        .slice(0, maxProducts - scoredProducts.length);

      return [...scoredProducts, ...featuredProducts];
    }

    return scoredProducts;
  }, [currentProductId, categoryId, tags, maxProducts]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} adicionado!`, {
      description: formatPrice(product.price),
      action: {
        label: 'Ver carrinho',
        onClick: () => openCart(),
      },
    });
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="font-semibold text-lg mb-4">Voce tambem pode gostar</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {relatedProducts.map((product, index) => {
          const category = categories.find((c) => c.id === product.categoryId);

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onProductClick?.(product)}
              className="group cursor-pointer"
            >
              <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg">
                {/* Image */}
                <div className="relative h-28 sm:h-32">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Quick Add */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Category */}
                  <span className="absolute bottom-2 left-2 text-[10px] text-white/80 font-medium">
                    {category?.name}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>

                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
                    {product.preparationTime && (
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {product.preparationTime}min
                      </span>
                    )}
                    <span className="flex items-center gap-0.5 text-accent">
                      <Star className="w-3 h-3 fill-current" />
                      4.9
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary text-sm">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Componente de "Combina com" (sugestões baseadas no carrinho)
export function ComplementaryProducts({
  cartCategoryIds,
  maxProducts = 3,
  onProductClick,
  className = '',
}: {
  cartCategoryIds: string[];
  maxProducts?: number;
  onProductClick?: (product: Product) => void;
  className?: string;
}) {
  const { addItem, openCart, items } = useCartStore();

  const suggestions = useMemo(() => {
    const cartProductIds = items.map((item) => item.product.id);

    // Categorias complementares
    const complementaryCategories: Record<string, string[]> = {
      'cat-1': ['cat-5', 'cat-3', 'cat-4'], // Pratos principais -> Bebidas, Acompanhamentos, Sobremesas
      'cat-2': ['cat-5', 'cat-4'], // Marmitas -> Bebidas, Sobremesas
      'cat-3': ['cat-5'], // Acompanhamentos -> Bebidas
      'cat-4': ['cat-5'], // Sobremesas -> Bebidas
    };

    const targetCategories = new Set<string>();
    cartCategoryIds.forEach((catId) => {
      const complement = complementaryCategories[catId];
      if (complement) {
        complement.forEach((c) => targetCategories.add(c));
      }
    });

    return products
      .filter(
        (p) =>
          p.active &&
          targetCategories.has(p.categoryId) &&
          !cartProductIds.includes(p.id)
      )
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      .slice(0, maxProducts);
  }, [cartCategoryIds, items, maxProducts]);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    toast.success(`${product.name} adicionado!`, {
      action: {
        label: 'Ver carrinho',
        onClick: () => openCart(),
      },
    });
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h4 className="text-sm font-medium text-muted-foreground mb-3">
        Combina com seu pedido
      </h4>

      <div className="space-y-2">
        {suggestions.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => onProductClick?.(product)}
          >
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-sm text-primary font-bold">
                {formatPrice(product.price)}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
              className="shrink-0 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
