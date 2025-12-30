'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  ChefHat,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { OrderStatus } from '@/types';
import { RESTAURANT_INFO } from '@/data/mockData';

interface OrderTrackingProps {
  orderId: string;
  status: OrderStatus;
  estimatedTime?: string;
  customerName?: string;
  address?: string;
  className?: string;
}

const statusSteps = [
  {
    status: 'pending',
    label: 'Pedido recebido',
    description: 'Aguardando confirmacao',
    icon: Clock,
  },
  {
    status: 'confirmed',
    label: 'Confirmado',
    description: 'Pedido aceito pelo restaurante',
    icon: Package,
  },
  {
    status: 'preparing',
    label: 'Em preparo',
    description: 'Nossos chefs estao preparando',
    icon: ChefHat,
  },
  {
    status: 'ready',
    label: 'Pronto',
    description: 'Aguardando entregador',
    icon: Package,
  },
  {
    status: 'delivering',
    label: 'A caminho',
    description: 'Entregador saiu para entrega',
    icon: Truck,
  },
  {
    status: 'delivered',
    label: 'Entregue',
    description: 'Bom apetite!',
    icon: CheckCircle2,
  },
];

export function OrderTracking({
  orderId,
  status,
  estimatedTime,
  customerName,
  address,
  className = '',
}: OrderTrackingProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const currentStepIndex = statusSteps.findIndex((s) => s.status === status);
  const progress = ((currentStepIndex + 1) / statusSteps.length) * 100;

  const getStatusMessage = () => {
    switch (status) {
      case 'pending':
        return 'Seu pedido foi enviado e sera confirmado em breve';
      case 'confirmed':
        return 'Seu pedido foi confirmado e sera preparado em instantes';
      case 'preparing':
        return 'Nossos chefs estao preparando seu pedido com carinho';
      case 'ready':
        return 'Seu pedido esta pronto e aguardando o entregador';
      case 'delivering':
        return 'O entregador esta a caminho do seu endereco';
      case 'delivered':
        return 'Pedido entregue! Esperamos que aproveite';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-primary/5 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Pedido #{orderId.slice(0, 8)}</h3>
          <span className="text-sm text-muted-foreground">
            {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        {customerName && (
          <p className="text-sm text-muted-foreground">Ola, {customerName}!</p>
        )}
        <p className="text-sm font-medium mt-2">{getStatusMessage()}</p>

        {/* Tempo estimado */}
        {estimatedTime && status !== 'delivered' && (
          <div className="mt-4 flex items-center gap-2 text-primary">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Chegada estimada: {estimatedTime}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="px-6 py-4">
        <Progress value={progress} className="h-2 mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Recebido</span>
          <span>Entregue</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 pb-6">
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start gap-4 ${
                  !isCompleted ? 'opacity-40' : ''
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : isCompleted
                      ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCurrent ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <StepIcon className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <p className={`font-medium ${isCurrent ? 'text-primary' : ''}`}>
                    {step.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>

                {/* Check */}
                {isCompleted && !isCurrent && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-2" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Endereço de entrega */}
      {address && (
        <div className="px-6 pb-4">
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Endereco de entrega</p>
                <p className="text-sm text-muted-foreground">{address}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {status !== 'delivered' && (
        <div className="p-6 pt-2 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            asChild
          >
            <a href={`tel:${RESTAURANT_INFO.phone}`}>
              <Phone className="w-4 h-4 mr-2" />
              Ligar
            </a>
          </Button>
          <Button
            className="flex-1 rounded-xl"
            asChild
          >
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsapp}?text=Ola! Gostaria de informacoes sobre o pedido ${orderId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

// Versão compacta para listagem
export function OrderTrackingCompact({
  orderId,
  status,
  estimatedTime,
}: Pick<OrderTrackingProps, 'orderId' | 'status' | 'estimatedTime'>) {
  const currentStep = statusSteps.find((s) => s.status === status);
  const StepIcon = currentStep?.icon || Clock;
  const progress =
    ((statusSteps.findIndex((s) => s.status === status) + 1) / statusSteps.length) * 100;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <StepIcon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{currentStep?.label}</p>
          <p className="text-xs text-muted-foreground">{currentStep?.description}</p>
        </div>
        {estimatedTime && status !== 'delivered' && (
          <span className="text-sm text-primary font-medium">{estimatedTime}</span>
        )}
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
}
