'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Clock, Users, Star, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/types';
import { formatPrice, categories } from '@/data/mockData';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { toast } from 'sonner';
import { ProductCustomization, useProductCustomization } from '@/components/ui/product-customization';
import { RelatedProducts } from '@/components/ui/related-products';
import { ProductRatingInline } from '@/components/ui/product-rating';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();
  const {
    selectedOptions,
    setSelectedOptions,
    additionalNotes,
    setAdditionalNotes,
    getCustomizationText,
    getExtraPrice,
    reset: resetCustomization,
  } = useProductCustomization();

  if (!product) return null;

  const category = categories.find((c) => c.id === product.categoryId);
  const extraPrice = getExtraPrice();
  const totalPrice = (product.price + extraPrice) * quantity;

  const handleAddToCart = () => {
    const customizationText = getCustomizationText();
    addItem(product, quantity, customizationText || undefined);
    toast.success(`${product.name} adicionado ao carrinho!`, {
      description: `${quantity}x ${formatPrice(totalPrice)}`,
      action: {
        label: 'Ver carrinho',
        onClick: () => openCart(),
      },
    });
    setQuantity(1);
    resetCustomization();
    onClose();
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card max-h-[90vh] sm:max-h-[85vh]">
        <VisuallyHidden>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </VisuallyHidden>
        <div className="grid md:grid-cols-2 gap-0 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto md:overflow-visible">
          {/* Image Section */}
          <div className="relative h-44 sm:h-56 md:h-full md:min-h-[400px] shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />

            {/* Tags */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2">
              {product.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-background/90 backdrop-blur-sm text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Category */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
              <span className="text-xs sm:text-sm text-white/90 font-medium bg-black/30 backdrop-blur-sm px-2.5 py-1 sm:px-3 rounded-full">
                {category?.name}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 flex flex-col md:overflow-y-auto md:max-h-[85vh]">
            <div className="flex-1">
              <h2 className="font-sans text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-2">
                {product.name}
              </h2>

              <p className="text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed line-clamp-3 sm:line-clamp-none">
                {product.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground">
                {product.preparationTime && (
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    <span>{product.preparationTime} min</span>
                  </div>
                )}
                {product.serves && (
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    <span>Serve {product.serves}</span>
                  </div>
                )}
                <ProductRatingInline productId={product.id} />
              </div>

              {/* Customization */}
              <div className="mb-3 sm:mb-4">
                <ProductCustomization
                  selectedOptions={selectedOptions}
                  onOptionsChange={setSelectedOptions}
                  additionalNotes={additionalNotes}
                  onNotesChange={setAdditionalNotes}
                />
              </div>
            </div>

            {/* Price and Actions */}
            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-border">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm text-muted-foreground">Preco unitario</span>
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                    {extraPrice > 0 && (
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        +{formatPrice(extraPrice)}
                      </span>
                    )}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <button
                    onClick={decrementQuantity}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 sm:w-8 text-center text-base sm:text-lg font-semibold" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                className="w-full h-12 sm:h-14 rounded-xl text-sm sm:text-base font-semibold shadow-lg shadow-primary/30 group"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="truncate">Adicionar {formatPrice(totalPrice)}</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
