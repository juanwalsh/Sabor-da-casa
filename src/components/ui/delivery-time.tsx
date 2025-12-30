'use client';

import { Clock } from 'lucide-react';
import { getEstimatedDeliveryTime } from '@/data/mockData';

interface DeliveryTimeProps {
  className?: string;
}

export function DeliveryTime({ className }: DeliveryTimeProps) {
  const { formatted, min, max } = getEstimatedDeliveryTime();
  const now = new Date();
  const hour = now.getHours();
  const isPeakHour = (hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21);

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Entrega estimada: {formatted}</span>
      </div>
      {isPeakHour && (
        <p className="text-xs text-muted-foreground mt-1 ml-6">
          Horario de pico - tempo pode variar
        </p>
      )}
    </div>
  );
}
