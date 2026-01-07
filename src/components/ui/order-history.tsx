'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  ShoppingBag,
  RefreshCcw,
  ChevronRight,
  Star,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useOrderHistoryStore, OrderHistory } from '@/store/orderHistoryStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/data/mockData';
import { toast } from 'sonner';

const statusConfig = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    color: 'text-yellow-500 bg-yellow-100',
  },
  confirmed: {
    label: 'Confirmado',
    icon: Package,
    color: 'text-blue-500 bg-blue-100',
  },
  preparing: {
    label: 'Preparando',
    icon: Package,
    color: 'text-orange-500 bg-orange-100',
  },
  delivering: {
    label: 'Em entrega',
    icon: Truck,
    color: 'text-purple-500 bg-purple-100',
  },
  delivered: {
    label: 'Entregue',
    icon: CheckCircle,
    color: 'text-green-500 bg-green-100',
  },
};

interface OrderHistoryListProps {
  className?: string;
}

export function OrderHistoryList({ className }: OrderHistoryListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null);
  const [mounted, setMounted] = useState(false);

  const { orders } = useOrderHistoryStore();
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleReorder = (order: OrderHistory) => {
    // Adicionar todos os itens do pedido ao carrinho
    order.items.forEach((item) => {
      addItem(item.product, item.quantity);
    });

    toast.success('Itens adicionados ao carrinho!', {
      description: `${order.items.length} itens do pedido anterior`,
      action: {
        label: 'Ver carrinho',
        onClick: openCart,
      },
    });

    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className={`gap-2 h-11 lg:h-9 ${className}`}
      >
        <History className="w-4 h-4" />
        Meus Pedidos
        {orders.length > 0 && (
          <Badge variant="secondary" className="ml-1">
            {orders.length}
          </Badge>
        )}
      </Button>

      {/* Orders Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Histórico de Pedidos
            </SheetTitle>
            <SheetDescription>
              Veja seus pedidos anteriores e peça novamente
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">Nenhum pedido ainda</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Seus pedidos aparecerão aqui
                </p>
                <Button onClick={() => setIsOpen(false)}>
                  Ver cardápio
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border rounded-xl hover:border-primary/30 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Pedido #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm font-medium">
                            {new Date(order.date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <Badge className={`${status.color} border-0`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>

                      {/* Items Preview */}
                      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div
                            key={item.product.id}
                            className="w-12 h-12 rounded-lg overflow-hidden shrink-0 relative"
                          >
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                            {item.quantity > 1 && (
                              <span className="absolute bottom-0 right-0 bg-primary text-primary-foreground text-xs px-1 rounded-tl">
                                {item.quantity}x
                              </span>
                            )}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <span className="text-xs text-muted-foreground">
                              +{order.items.length - 3}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Items List */}
                      <div className="text-xs text-muted-foreground mb-3">
                        {order.items.map((item, i) => (
                          <span key={item.product.id}>
                            {item.quantity}x {item.product.name}
                            {i < order.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>

                      {/* Rating */}
                      {order.rating && (
                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= order.rating!
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            Sua avaliação
                          </span>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <p className="font-semibold text-primary">
                          {formatPrice(order.total)}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handleReorder(order)}
                          className="gap-1"
                        >
                          <RefreshCcw className="w-3 h-3" />
                          Pedir novamente
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// Compact version for navbar
export function OrderHistoryButton() {
  const [mounted, setMounted] = useState(false);
  const { orders } = useOrderHistoryStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button variant="ghost" size="icon" className="relative">
      <History className="w-5 h-5" />
      {orders.length > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
          {orders.length > 9 ? '9+' : orders.length}
        </span>
      )}
    </Button>
  );
}
