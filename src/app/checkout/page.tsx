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
import { LoyaltyCard } from '@/components/ui/loyalty-card';
import { AuthModal } from '@/components/ui/auth-modal';
import { CepValidator } from '@/components/ui/cep-validator';
import { OrderReceipt } from '@/components/ui/order-receipt';
import { OrderTracking } from '@/components/ui/order-tracking';
import { useScheduleStore } from '@/store/scheduleStore';
import { useLoyaltyStore } from '@/store/loyaltyStore';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  zipCode: z.string().min(8, 'CEP inválido'),
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [deliveryValidated, setDeliveryValidated] = useState(false);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState<string>('');
  const { items, getSubtotal, getDeliveryFee, getTotal, clearCart } = useCartStore();
  const { addOrder } = useOrderHistoryStore();
  const { appliedCoupon, calculateDiscount, markCouponAsUsed } = useCouponStore();
  const { isScheduled, getFormattedSchedule } = useScheduleStore();
  const { addPoints } = useLoyaltyStore();
  const { user, isAuthenticated, isGuest } = useUserStore();

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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create WhatsApp message
    const orderItems = items
      .map((item) => `• ${item.quantity}x ${item.product.name} - ${formatPrice(item.product.price * item.quantity)}`)
      .join('\n');

    const scheduleInfo = isScheduled ? `\n*Entrega Agendada:* ${getFormattedSchedule()}\n` : '';

    const message = `🍽️ *NOVO PEDIDO - SABOR DA CASA*\n\n` +
      `*Cliente:* ${data.name}\n` +
      `*Telefone:* ${data.phone}\n` +
      `${data.email ? `*Email:* ${data.email}\n` : ''}` +
      `\n*Endereço:*\n` +
      `${data.street}, ${data.number}${data.complement ? ` - ${data.complement}` : ''}\n` +
      `${data.neighborhood}, ${data.city}\n` +
      `CEP: ${data.zipCode}\n` +
      scheduleInfo +
      `\n*Itens do Pedido:*\n${orderItems}\n` +
      `\n*Subtotal:* ${formatPrice(subtotal)}\n` +
      `${discount > 0 ? `*Desconto:* -${formatPrice(discount)}\n` : ''}` +
      `*Entrega:* ${deliveryFee === 0 ? 'Grátis' : formatPrice(deliveryFee)}\n` +
      `*Total:* ${formatPrice(total)}\n` +
      `\n*Pagamento:* ${paymentMethods.find((p) => p.id === paymentMethod)?.label}\n` +
      `${data.notes ? `\n*Observações:* ${data.notes}` : ''}`;

    const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${encodeURIComponent(message)}`;

    // Salva o pedido no histórico
    const orderId = addOrder({
      items: items,
      total: total,
      status: 'pending',
    });
    setCurrentOrderId(orderId);

    // Adiciona pontos de fidelidade (se usuário autenticado)
    if (isAuthenticated) {
      addPoints(Math.floor(total), orderId);
      toast.success(`+${Math.floor(total)} pontos de fidelidade!`);
    }

    // Marca cupom como usado
    if (appliedCoupon) {
      markCouponAsUsed(appliedCoupon.code);
    }

    setIsSubmitting(false);
    setOrderSuccess(true);
    clearCart();

    // Mostra modal de avaliação após 3 segundos
    setTimeout(() => {
      setShowRatingModal(true);
    }, 3000);

    // Open WhatsApp after a short delay
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1500);
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
          <h2 className="font-sans text-xl sm:text-2xl font-semibold mb-2">Pedido Enviado!</h2>
          <p className="text-muted-foreground mb-6">
            Seu pedido foi enviado com sucesso. Você será redirecionado para o WhatsApp para confirmar os detalhes.
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
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="Seu nome"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="(11) 99999-9999"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                  )}
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
                  <Label htmlFor="street">Rua *</Label>
                  <Input
                    id="street"
                    {...register('street')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="Nome da rua"
                  />
                  {errors.street && (
                    <p className="text-sm text-destructive mt-1">{errors.street.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    {...register('number')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="123"
                  />
                  {errors.number && (
                    <p className="text-sm text-destructive mt-1">{errors.number.message}</p>
                  )}
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
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    {...register('neighborhood')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="Seu bairro"
                  />
                  {errors.neighborhood && (
                    <p className="text-sm text-destructive mt-1">{errors.neighborhood.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="zipCode">CEP *</Label>
                  <Input
                    id="zipCode"
                    {...register('zipCode')}
                    className="mt-1.5 h-12 rounded-xl"
                    placeholder="00000-000"
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>
                  )}
                </div>
                <div className="sm:col-span-3">
                  <Label htmlFor="city">Cidade *</Label>
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

              {/* Fidelidade */}
              {isAuthenticated && (
                <div className="mb-4">
                  <LoyaltyCard />
                </div>
              )}

              {/* Login/Cadastro prompt para ganhar pontos */}
              {!isAuthenticated && !isGuest && (
                <div className="mb-4 p-3 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-2">
                    Crie uma conta e ganhe <strong>{Math.floor(total)} pontos</strong> neste pedido!
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Entrar ou Criar Conta
                  </Button>
                </div>
              )}

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
                disabled={isSubmitting}
                className="w-full h-12 sm:h-14 rounded-xl text-xs sm:text-sm lg:text-base font-semibold mt-4 sm:mt-6 shadow-lg shadow-primary/30 px-4 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin shrink-0" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Enviar Pedido</span>
                  </>
                )}
              </Button>

              <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-3 sm:mt-4 leading-relaxed">
                Ao enviar, você será redirecionado para o WhatsApp para confirmar seu pedido
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
