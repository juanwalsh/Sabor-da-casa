'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChefHat,
  Phone,
  MapPin,
} from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import { formatPrice, products } from '@/data/mockData';
import { OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ElementType; next?: OrderStatus }
> = {
  pending: { label: 'Pendente', color: 'bg-yellow-500', icon: Clock, next: 'confirmed' },
  confirmed: { label: 'Confirmado', color: 'bg-blue-500', icon: CheckCircle, next: 'preparing' },
  preparing: { label: 'Preparando', color: 'bg-orange-500', icon: ChefHat, next: 'ready' },
  ready: { label: 'Pronto', color: 'bg-green-500', icon: CheckCircle, next: 'delivering' },
  delivering: { label: 'Entregando', color: 'bg-purple-500', icon: Truck, next: 'delivered' },
  delivered: { label: 'Entregue', color: 'bg-green-600', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-red-500', icon: XCircle },
};

export default function PedidosPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedOrderData = orders.find((o) => o.id === selectedOrder);

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success('Status atualizado!', {
      description: `Pedido atualizado para: ${statusConfig[newStatus].label}`,
    });
  };

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || 'Produto não encontrado';
  };

  return (
    <>
      <div className="space-y-3 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-2 sm:space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, index) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="cursor-pointer hover:border-primary/30 transition-colors"
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="flex items-start sm:items-center gap-2 sm:gap-4">
                        {/* Status Badge */}
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${status.color} flex items-center justify-center shrink-0`}
                        >
                          <StatusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>

                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                            <h3 className="font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{order.customerName}</h3>
                            <Badge variant="outline" className="shrink-0 text-xs">
                              #{order.id.slice(-4)}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-0.5 text-xs sm:text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span className="hidden xs:inline">{order.customerPhone}</span>
                              <span className="xs:hidden">{order.customerPhone.slice(-4)}</span>
                            </span>
                            <span>
                              {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                            </span>
                          </div>
                        </div>

                        {/* Price and Status */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-4 shrink-0">
                          <div className="text-right">
                            <p className="font-bold font-serif text-sm sm:text-lg">
                              {formatPrice(order.total)}
                            </p>
                            <Badge variant="secondary" className="text-xs">{status.label}</Badge>
                          </div>

                          {/* Quick Action */}
                          {status.next && (
                            <Button
                              size="sm"
                              className="hidden sm:flex"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(order.id, status.next!);
                              }}
                            >
                              Avancar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">Nenhum pedido encontrado</h3>
              <p className="text-sm text-muted-foreground">
                Tente buscar por outro termo ou altere o filtro
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          {selectedOrderData && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif">
                  Pedido #{selectedOrderData.id.slice(-4)}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      statusConfig[selectedOrderData.status].color
                    } flex items-center justify-center`}
                  >
                    {(() => {
                      const Icon = statusConfig[selectedOrderData.status].icon;
                      return <Icon className="w-5 h-5 text-white" />;
                    })()}
                  </div>
                  <div>
                    <p className="font-medium">
                      {statusConfig[selectedOrderData.status].label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedOrderData.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Customer Info */}
                <div>
                  <h4 className="font-medium mb-2">Cliente</h4>
                  <p>{selectedOrderData.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrderData.customerPhone}
                  </p>
                  {selectedOrderData.customerEmail && (
                    <p className="text-sm text-muted-foreground">
                      {selectedOrderData.customerEmail}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Endereço
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrderData.address.street}, {selectedOrderData.address.number}
                    {selectedOrderData.address.complement &&
                      ` - ${selectedOrderData.address.complement}`}
                    <br />
                    {selectedOrderData.address.neighborhood}, {selectedOrderData.address.city}
                    <br />
                    CEP: {selectedOrderData.address.zipCode}
                  </p>
                </div>

                <Separator />

                {/* Items */}
                <div>
                  <h4 className="font-medium mb-3">Itens do Pedido</h4>
                  <div className="space-y-2">
                    {selectedOrderData.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {getProductName(item.productId)}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(selectedOrderData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Entrega</span>
                    <span>
                      {selectedOrderData.deliveryFee === 0
                        ? 'Grátis'
                        : formatPrice(selectedOrderData.deliveryFee)}
                    </span>
                  </div>
                  {selectedOrderData.discount > 0 && (
                    <div className="flex justify-between text-sm text-secondary">
                      <span>Desconto</span>
                      <span>-{formatPrice(selectedOrderData.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="font-serif">{formatPrice(selectedOrderData.total)}</span>
                  </div>
                </div>

                {/* Actions */}
                {statusConfig[selectedOrderData.status].next && (
                  <Button
                    className="w-full"
                    onClick={() => {
                      handleStatusUpdate(
                        selectedOrderData.id,
                        statusConfig[selectedOrderData.status].next!
                      );
                      setSelectedOrder(null);
                    }}
                  >
                    Avançar para: {statusConfig[statusConfig[selectedOrderData.status].next!].label}
                  </Button>
                )}

                {selectedOrderData.status !== 'cancelled' &&
                  selectedOrderData.status !== 'delivered' && (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        handleStatusUpdate(selectedOrderData.id, 'cancelled');
                        setSelectedOrder(null);
                      }}
                    >
                      Cancelar Pedido
                    </Button>
                  )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
