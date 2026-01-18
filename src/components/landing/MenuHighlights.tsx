'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Plus, Star, Clock, Users, ArrowRight, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/ui/favorite-button';
import { formatPrice, categories } from '@/data/mockData';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { Product } from '@/types';
import ProductModal from '@/components/menu/ProductModal';
import { useProducts } from '@/hooks/useProducts';

export default function MenuHighlights() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Use useProducts hook for dynamic data
  const { products } = useProducts();
  const featuredProducts = products.filter(p => p.featured);

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
      <section id="cardapio" className="py-10 md:py-16 bg-muted/30 relative overflow-hidden">
        {/* Background Decorations - Carnival */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-0 w-64 md:w-80 h-64 md:h-80 bg-[#FF6B35]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-0 w-48 md:w-64 h-48 md:h-64 bg-[#F7C41F]/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header - Compacto */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF6B35]/10 to-[#FF2D92]/10 border border-[#FF6B35]/20 mb-3"
            >
              <PartyPopper className="w-3 h-3 md:w-4 md:h-4 text-[#FF6B35]" />
              <span className="text-xs md:text-sm font-medium text-[#FF6B35]">Destaques de Carnaval</span>
            </motion.div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Produtos que você{' '}
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

            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Os favoritos dos nossos clientes na folia!
            </p>
          </motion.div>

          {/* Products Grid - Compacto */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {featuredProducts.slice(0, 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => handleOpenModal(product)}
              >
                <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-[#FF6B35]/30 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                  {/* Image Container - Menor no mobile */}
                  <div className="relative h-32 md:h-40 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={index < 4}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Tags - Simplificado */}
                    {product.tags?.[0] && (
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant="secondary"
                          className="bg-card/90 backdrop-blur-sm text-[10px] md:text-xs px-1.5 py-0.5"
                        >
                          {product.tags[0]}
                        </Badge>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <div className="absolute top-2 right-2">
                      <FavoriteButton productId={product.id} productName={product.name} size="sm" />
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="absolute bottom-2 right-2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF2D92] text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    {/* Category */}
                    <div className="absolute bottom-2 left-2">
                      <span className="text-[10px] md:text-xs text-white/80 font-medium">
                        {getCategoryName(product.categoryId)}
                      </span>
                    </div>
                  </div>

                  {/* Content - Compacto */}
                  <div className="p-2.5 md:p-4 flex-1 flex flex-col">
                    <h3 className="font-sans text-xs md:text-sm font-semibold text-card-foreground mb-1 group-hover:text-[#FF6B35] transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-[10px] md:text-xs text-muted-foreground mb-2 line-clamp-2 flex-1 hidden md:block">
                      {product.description}
                    </p>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-base md:text-lg font-bold text-[#FF6B35]">
                        {formatPrice(product.price)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleAddToCart(product, e)}
                        className="rounded-lg hover:bg-[#FF6B35] hover:text-white hover:border-[#FF6B35] transition-all text-[10px] md:text-xs shrink-0 h-7 md:h-8 px-2"
                      >
                        <Plus className="w-3 h-3 md:hidden" />
                        <span className="hidden md:inline">Adicionar</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Button - Compacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-6 md:mt-10"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 md:h-12 px-6 md:px-8 text-sm md:text-base font-semibold rounded-xl border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group"
            >
              <Link href="/cardapio">
                Ver Cardápio Completo
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
