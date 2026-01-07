'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/store/cartStore';
import { useOrderHistoryStore } from '@/store/orderHistoryStore';
import { useCouponStore } from '@/store/couponStore';
import { useFirestoreStore, formatCartItemsForOrder } from '@/store/firestoreStore';
import { formatPrice, RESTAURANT_INFO } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CouponInput } from '@/components/ui/coupon-input';
import { DeliveryTime } from '@/components/ui/delivery-time';
import { RatingModal } from '@/components/ui/rating-modal';
import { ScheduleDelivery, ScheduleBadge } from '@/components/ui/schedule-delivery';
import { CepValidator } from '@/components/ui/cep-validator';
import { useScheduleStore } from '@/store/scheduleStore';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  name: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  street: z.string().optional().or(z.literal('')),
  number: z.string().optional().or(z.literal('')),
  complement: z.string().optional(),
  neighborhood: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  zipCode: z.string().optional().or(z.literal('')),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash';

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [deliveryValidated, setDeliveryValidated] = useState(false);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState<string>('');
  const { items, getSubtotal, getDeliveryFee, getTotal, clearCart } = useCartStore();
  const { addOrder } = useOrderHistoryStore();
  const { appliedCoupon, calculateDiscount, markCouponAsUsed } = useCouponStore();
  const { criarPedido, isSubmitting: isFirestoreSubmitting } = useFirestoreStore();
  const { isScheduled, getFormattedSchedule } = useScheduleStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      city: 'São Paulo',
    },
  });

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = calculateDiscount(subtotal);
  const total = getTotal() - discount;

  const paymentMethods = [
    { id: 'pix', label: 'PIX', icon: Smartphone, description: 'Pagamento instantâneo' },
    { id: 'credit_card', label: 'Crédito', icon: CreditCard, description: 'Em até 3x sem juros' },
    { id: 'debit_card', label: 'Débito', icon: CreditCard, description: 'Na entrega' },
    { id: 'cash', label: 'Dinheiro', icon: Banknote, description: 'Na entrega' },
  ];

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    // Preparar dados do pedido para Firebase (sem campos undefined)
    const pedidoData: Record<string, unknown> = {
      cliente: {
        nome: data.name || '',
        telefone: data.phone || '',
        endereco: {
          rua: data.street || '',
          numero: data.number || '',
          bairro: data.neighborhood || '',
          cidade: data.city || 'Sao Paulo',
          cep: data.zipCode || '',
        },
      },
      itens: formatCartItemsForOrder(items),
      subtotal: subtotal,
      taxaEntrega: deliveryFee,
      desconto: discount,
      total: total,
      status: 'pendente' as const,
      formaPagamento: paymentMethod,
    };

    // Adicionar campos opcionais apenas se tiverem valor
    if (data.email) {
      (pedidoData.cliente as Record<string, unknown>).email = data.email;
    }
    if (data.complement) {
      ((pedidoData.cliente as Record<string, unknown>).endereco as Record<string, unknown>).complemento = data.complement;
    }
    if (data.notes) {
      pedidoData.observacoes = data.notes;
    }
    if (isScheduled) {
      pedidoData.agendamento = getFormattedSchedule();
    }

    // Criar pedido no Firebase (já debita estoque automaticamente)
    const firebaseOrderId = await criarPedido(pedidoData, items);

    if (!firebaseOrderId) {
      toast.error('Erro ao criar pedido. Tente novamente.');
      setIsSubmitting(false);
      return;
    }

    // Salva o pedido no histórico local também
    const orderId = addOrder({
      items: items,
      total: total,
      status: 'pending',
    });
    setCurrentOrderId(orderId);

    // Marca cupom como usado
    if (appliedCoupon) {
      markCouponAsUsed(appliedCoupon.code);
    }

    setIsSubmitting(false);
    setOrderSuccess(true);
    clearCart();

    // Mostra mensagem de sucesso
    toast.success(`Pedido #${firebaseOrderId.slice(-6).toUpperCase()} criado com sucesso!`);

    // Mostra modal de avaliação após 3 segundos
    setTimeout(() => {
      setShowRatingModal(true);
    }, 3000);
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h2 className="font-sans text-xl sm:text-2xl font-semibold mb-2">Carrinho vazio</h2>
          <p className="text-muted-foreground mb-6">
            Adicione itens ao carrinho para continuar
          </p>
          <Link href="/cardapio">
            <Button className="rounded-xl">Ver Cardápio</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-secondary" />
          </motion.div>
          <h2 className="font-sans text-xl sm:text-2xl font-semibold mb-2">Pedido Confirmado!</h2>
          <p className="text-muted-foreground mb-6">
            Seu pedido foi recebido com sucesso! Estamos preparando sua refeicao com muito carinho.
          </p>
          <Link href="/">
            <Button variant="outline" className="rounded-xl">
              Voltar ao Início
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link href="/cardapio">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-sans text-lg sm:text-xl font-semibold">Finalizar Pedido</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Info */}
            <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
              <h2 className="font-sans text-base sm:text-lg font-semibold mb-3 sm:mb-4">Dados Pessoais</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Nome completo (opcional)</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone (opcional)</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <h2 className="font-sans text-base sm:text-lg font-semibold">Endereço de Entrega</h2>
              </div>

              {/* CEP Validator */}
              <div className="mb-4">
                <CepValidator
                  showCard={false}
                  onValidCep={(cep, info) => {
                    setDeliveryValidated(true);
                    setEstimatedDeliveryTime(info.time);
                  }}
                  onInvalidCep={() => {
                    setDeliveryValidated(false);
                    setEstimatedDeliveryTime('');
                  }}
                />
                {deliveryValidated && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Entregamos no seu endereco! Tempo estimado: {estimatedDeliveryTime}
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    {...register('street')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="Nome da rua"
                  />
                </div>
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    {...register('number')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="123"
                  />
                </div>
                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    {...register('complement')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="Apto, bloco..."
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    {...register('neighborhood')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="Seu bairro"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    {...register('zipCode')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="00000-000"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    {...register('city')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="São Paulo"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
              <h2 className="font-sans text-base sm:text-lg font-semibold mb-3 sm:mb-4">Forma de Pagamento</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        paymentMethod === method.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border">
              <Label htmlFor="notes" className="text-sm sm:text-base">Observações (opcional)</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                className="mt-1.5 rounded-xl resize-none text-sm"
                placeholder="Ex: Sem cebola, interfone não funciona..."
                rows={3}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border sticky top-24">
              <h2 className="font-sans text-base sm:text-lg font-semibold mb-4">Resumo do Pedido</h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-[40vh] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-2 sm:gap-3">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden relative shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity}x {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-xs sm:text-sm shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-3 sm:my-4" />

              {/* Cupom */}
              <div className="mb-4">
                <CouponInput subtotal={subtotal} />
              </div>

              {/* Agendamento */}
              <div className="mb-4">
                <ScheduleDelivery />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm text-secondary">
                    <span>Desconto</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Entrega</span>
                  <span className={deliveryFee === 0 ? 'text-secondary font-medium' : ''}>
                    {deliveryFee === 0 ? 'Grátis' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <DeliveryTime className="py-1" />
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base sm:text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || isFirestoreSubmitting}
                className="w-full h-12 sm:h-14 rounded-xl text-xs sm:text-sm lg:text-base font-semibold mt-4 sm:mt-6 shadow-lg shadow-primary/30 px-4 whitespace-nowrap"
              >
                {isSubmitting || isFirestoreSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin shrink-0" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" />
                    <span>Confirmar Pedido</span>
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3 sm:mt-4 leading-relaxed">
                Seu pedido sera enviado diretamente para nossa cozinha
              </p>
            </div>
          </div>
        </form>
      </main>

      {/* Rating Modal */}
      {currentOrderId && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          orderId={currentOrderId}
        />
      )}
    </div>
  );
}
