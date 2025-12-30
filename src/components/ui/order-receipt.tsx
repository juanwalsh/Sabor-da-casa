'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Share2,
  Printer,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/types';
import { formatPrice, RESTAURANT_INFO, products } from '@/data/mockData';
import { toast } from 'sonner';

interface OrderReceiptProps {
  order: Order;
  className?: string;
}

const paymentMethodLabels: Record<string, string> = {
  credit_card: 'Cartao de Credito',
  debit_card: 'Cartao de Debito',
  pix: 'PIX',
  cash: 'Dinheiro',
};

export function OrderReceipt({ order, className = '' }: OrderReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const getProduct = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    // Criar conteúdo para download como texto
    const content = generateTextReceipt(order);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recibo-pedido-${order.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Recibo baixado com sucesso!');
  };

  const handleShare = async () => {
    const text = `Pedido #${order.id.slice(0, 8)} - ${RESTAURANT_INFO.name}\nTotal: ${formatPrice(order.total)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Recibo - ${RESTAURANT_INFO.name}`,
          text,
        });
      } catch {
        // Usuário cancelou
      }
    } else {
      // Fallback: copiar para clipboard
      await navigator.clipboard.writeText(text);
      toast.success('Informacoes copiadas para a area de transferencia!');
    }
  };

  const generateTextReceipt = (order: Order) => {
    const lines = [
      '═══════════════════════════════════════',
      `           ${RESTAURANT_INFO.name}`,
      '═══════════════════════════════════════',
      '',
      `Pedido: #${order.id.slice(0, 8)}`,
      `Data: ${new Date(order.createdAt).toLocaleString('pt-BR')}`,
      '',
      '───────────────────────────────────────',
      'ITENS DO PEDIDO',
      '───────────────────────────────────────',
      '',
    ];

    order.items.forEach((item) => {
      const product = getProduct(item.productId);
      lines.push(`${item.quantity}x ${product?.name || 'Item'}`);
      lines.push(`   ${formatPrice(item.unitPrice)} cada`);
      lines.push(`   Subtotal: ${formatPrice(item.unitPrice * item.quantity)}`);
      lines.push('');
    });

    lines.push('───────────────────────────────────────');
    lines.push(`Subtotal:        ${formatPrice(order.subtotal)}`);
    lines.push(`Taxa de entrega: ${formatPrice(order.deliveryFee)}`);
    if (order.discount > 0) {
      lines.push(`Desconto:        -${formatPrice(order.discount)}`);
    }
    lines.push('───────────────────────────────────────');
    lines.push(`TOTAL:           ${formatPrice(order.total)}`);
    lines.push('───────────────────────────────────────');
    lines.push('');
    lines.push(`Pagamento: ${paymentMethodLabels[order.paymentMethod]}`);
    lines.push('');
    lines.push('ENDERECO DE ENTREGA:');
    lines.push(`${order.address.street}, ${order.address.number}`);
    if (order.address.complement) {
      lines.push(order.address.complement);
    }
    lines.push(`${order.address.neighborhood} - ${order.address.city}/${order.address.state}`);
    lines.push(`CEP: ${order.address.zipCode}`);
    lines.push('');
    lines.push('═══════════════════════════════════════');
    lines.push('      Obrigado pela preferencia!');
    lines.push(`          ${RESTAURANT_INFO.phone}`);
    lines.push('═══════════════════════════════════════');

    return lines.join('\n');
  };

  return (
    <div className={className}>
      {/* Actions */}
      <div className="flex gap-2 mb-4 print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1">
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload} className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Baixar
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </div>

      {/* Receipt */}
      <motion.div
        ref={receiptRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl overflow-hidden print:border-0 print:rounded-none"
      >
        {/* Header */}
        <div className="bg-primary/5 p-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-bold mb-1">Pedido Confirmado!</h2>
          <p className="text-muted-foreground">#{order.id.slice(0, 8)}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Restaurant Info */}
          <div className="text-center">
            <h3 className="font-serif text-xl font-bold">{RESTAURANT_INFO.name}</h3>
            <p className="text-sm text-muted-foreground">{RESTAURANT_INFO.slogan}</p>
          </div>

          <Separator />

          {/* Order Info */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              <span>{paymentMethodLabels[order.paymentMethod]}</span>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h4 className="font-semibold mb-4">Itens do Pedido</h4>
            <div className="space-y-3">
              {order.items.map((item) => {
                const product = getProduct(item.productId);
                return (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.quantity}x </span>
                      <span>{product?.name || 'Item'}</span>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground italic ml-6">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    <span className="font-medium">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Taxa de entrega</span>
              <span>
                {order.deliveryFee === 0 ? (
                  <span className="text-green-600">Gratis</span>
                ) : (
                  formatPrice(order.deliveryFee)
                )}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Desconto</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>

          <Separator />

          {/* Delivery Address */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Endereco de Entrega
            </h4>
            <div className="text-sm text-muted-foreground">
              <p>
                {order.address.street}, {order.address.number}
                {order.address.complement && ` - ${order.address.complement}`}
              </p>
              <p>
                {order.address.neighborhood} - {order.address.city}/{order.address.state}
              </p>
              <p>CEP: {order.address.zipCode}</p>
            </div>
          </div>

          {order.notes && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Observacoes</h4>
                <p className="text-sm text-muted-foreground italic">{order.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Footer */}
          <div className="text-center space-y-2">
            <p className="font-medium">Obrigado pela preferencia!</p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="flex items-center gap-1 hover:text-primary"
              >
                <Phone className="w-4 h-4" />
                {RESTAURANT_INFO.phone}
              </a>
              <a
                href={`mailto:${RESTAURANT_INFO.email}`}
                className="flex items-center gap-1 hover:text-primary"
              >
                <Mail className="w-4 h-4" />
                {RESTAURANT_INFO.email}
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
