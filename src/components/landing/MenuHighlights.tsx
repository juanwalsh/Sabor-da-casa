'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Plus, Star, Clock, Users, ArrowRight, Utensils } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/ui/favorite-button';
import { getFeaturedProducts, formatPrice, categories } from '@/data/mockData';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { Product } from '@/types';
import ProductModal from '@/components/menu/ProductModal';

export default function MenuHighlights() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const featuredProducts = getFeaturedProducts();
  const { addItem } = useCartStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} adicionado ao carrinho!`, {
      description: formatPrice(product.price),
      action: {
        label: 'Ver carrinho',
        onClick: () => useCartStore.getState().openCart(),
      },
    });
  };

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || '';
  };

  return (
    <>
      <section id="cardapio" className="py-24 bg-muted/30 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
            >
              <Utensils className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Nossos Destaques</span>
            </motion.div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Pratos que você{' '}
              <span className="text-primary relative inline-block">
                vai amar
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-full origin-left"
                />
              </span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seleção especial dos favoritos dos nossos clientes.
              Sabores que conquistam no primeiro garfada.
            </p>
          </motion.div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => handleOpenModal(product)}
              >
                <div className="bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                      priority={index < 4}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      {product.tags?.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-card/95 dark:bg-background/90 backdrop-blur-sm text-xs text-card-foreground shadow-sm border border-border/50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Favorite Button */}
                    <div className="absolute top-3 right-3">
                      <FavoriteButton productId={product.id} productName={product.name} size="sm" />
                    </div>

                    {/* Quick Add Button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleAddToCart(product, e)}
                      className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>

                    {/* Category */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xs text-white/80 font-medium">
                        {getCategoryName(product.categoryId)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    <h3 className="font-sans text-base sm:text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 flex-1">
                      {product.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs text-muted-foreground">
                      {product.preparationTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>{product.preparationTime} min</span>
                        </div>
                      )}
                      {product.serves && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>{product.serves} {product.serves > 1 ? 'pessoas' : 'pessoa'}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-accent">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                        <span>4.9</span>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleAddToCart(product, e)}
                        className="rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-xs sm:text-sm shrink-0 h-11 lg:h-9"
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base font-semibold rounded-2xl border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group"
            >
              <Link href="/cardapio">
                Ver Cardápio Completo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
