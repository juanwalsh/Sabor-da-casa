'use client';

import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, FREE_DELIVERY_MIN } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { toast } from 'sonner';

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    getItemCount,
  } = useCartStore();

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const result = updateQuantity(productId, newQuantity);
    if (!result.success && result.message) {
      toast.error(result.message);
    }
  };

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();
  const itemCount = getItemCount();
  const remainingForFreeDelivery = FREE_DELIVERY_MIN - subtotal;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-md bg-background/95 backdrop-blur-xl flex flex-col p-0">
        <SheetHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
          <SheetTitle className="flex items-center gap-2 sm:gap-3 font-sans text-lg sm:text-xl font-semibold">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span>Seu Carrinho</span>
            {itemCount > 0 && (
              <span className="text-xs sm:text-sm font-normal text-muted-foreground">
                ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
              </span>
            )}
          </SheetTitle>
          <VisuallyHidden>
            <SheetDescription>Gerencie os itens do seu carrinho de compras</SheetDescription>
          </VisuallyHidden>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted flex items-center justify-center mb-4 sm:mb-6">
              <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
            </div>
            <h3 className="font-sans text-lg sm:text-xl font-semibold mb-2">Carrinho vazio</h3>
            <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
              Adicione itens deliciosos ao seu carrinho
            </p>
            <Link href="/cardapio" onClick={closeCart}>
              <Button className="rounded-xl">Ver Cardápio</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Free Delivery Progress */}
            {remainingForFreeDelivery > 0 && (
              <div className="bg-secondary/10 rounded-xl p-3 sm:p-4 mx-4 sm:mx-6 mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-secondary-foreground mb-2">
                  Faltam <span className="font-bold">{formatPrice(remainingForFreeDelivery)}</span> para frete grátis!
                </p>
                <div className="h-1.5 sm:h-2 bg-secondary/20 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min((subtotal / FREE_DELIVERY_MIN) * 100, 100)}%` }}
                    className="h-full bg-secondary rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            )}

            {deliveryFee === 0 && (
              <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-3 sm:p-4 mx-4 sm:mx-6 mb-3 sm:mb-4 text-center">
                <p className="text-xs sm:text-sm font-medium text-secondary">
                  Parabens! Voce ganhou <span className="font-bold">frete gratis!</span>
                </p>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-2 sm:gap-3 py-3 sm:py-4 border-b border-border last:border-0"
                  >
                    {/* Product Image */}
                    <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 relative">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm truncate mb-0.5 sm:mb-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                        {formatPrice(item.product.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center rounded-lg border border-border overflow-hidden">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="w-4 h-4 sm:w-4 sm:h-4" />
                          </button>
                          <span className="w-8 sm:w-8 text-center text-sm sm:text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.product.stock !== undefined && item.quantity >= item.product.stock}
                            className={`w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center transition-colors ${
                              item.product.stock !== undefined && item.quantity >= item.product.stock
                                ? 'opacity-50 cursor-not-allowed bg-muted'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <Plus className="w-4 h-4 sm:w-4 sm:h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      {/* Stock indicator */}
                      {item.product.stock !== undefined && item.quantity >= item.product.stock && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" />
                          Limite maximo ({item.product.stock})
                        </p>
                      )}
                    </div>

                    {/* Item Total */}
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-primary text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Cart Summary - Compacto */}
            <div className="border-t border-border mt-auto px-4 sm:px-6 py-3 sm:py-4 bg-muted/30">
              {/* Resumo */}
              <div className="flex items-center justify-between mb-3 text-xs sm:text-sm">
                <div className="space-y-0.5">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Entrega:</span>
                    <span className={`font-medium ${deliveryFee === 0 ? 'text-secondary' : ''}`}>
                      {deliveryFee === 0 ? 'Grátis' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-bold text-primary">{formatPrice(total)}</p>
                </div>
              </div>

              {/* Botao principal */}
              <Link href="/checkout" onClick={closeCart}>
                <Button
                  size="lg"
                  className="w-full h-11 rounded-xl text-sm font-semibold shadow-lg shadow-primary/30 group"
                >
                  <span>Finalizar Pedido</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Continuar comprando */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-xs h-8"
                onClick={closeCart}
              >
                Continuar Comprando
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
