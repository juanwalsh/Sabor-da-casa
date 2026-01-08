'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  useScheduleStore,
  getAvailableDates,
  getAvailableTimeSlots,
  formatDatePtBr,
} from '@/store/scheduleStore';
import { toast } from 'sonner';

interface ScheduleDeliveryProps {
  className?: string;
}

export function ScheduleDelivery({ className }: ScheduleDeliveryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const { isScheduled, setSchedule, clearSchedule, getFormattedSchedule } = useScheduleStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const availableDates = getAvailableDates();
  const timeSlots = selectedDate ? getAvailableTimeSlots(selectedDate) : [];
  const formattedSchedule = getFormattedSchedule();

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      setSchedule(selectedDate.toISOString(), selectedTime);
      setIsOpen(false);
      toast.success('Entrega agendada!', {
        description: `${formatDatePtBr(selectedDate)} às ${selectedTime}`,
      });
    }
  };

  const handleClear = () => {
    clearSchedule();
    setSelectedDate(null);
    setSelectedTime(null);
    toast.info('Agendamento removido');
  };

  return (
    <>
      {/* Trigger Button */}
      <div className={className}>
        {isScheduled ? (
          <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-xl border border-secondary/20">
            <Calendar className="w-4 h-4 text-secondary" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Entrega agendada</p>
              <p className="text-sm font-medium">{formattedSchedule}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-8 w-8"
              onClick={handleClear}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsOpen(true)}
            >
              Alterar
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            type="button"
            className="w-full justify-start gap-2"
            onClick={() => setIsOpen(true)}
          >
            <Calendar className="w-4 h-4" />
            Agendar entrega
          </Button>
        )}
      </div>

      {/* Schedule Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Agendar Entrega
            </SheetTitle>
            <SheetDescription>
              Escolha o melhor dia e horário para receber seu pedido
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Date Selection */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Selecione o dia
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {availableDates.map((date) => {
                  const isSelected =
                    selectedDate?.toDateString() === date.toDateString();
                  return (
                    <motion.button
                      type="button"
                      key={date.toISOString()}
                      data-date={date.toISOString()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card hover:border-primary/30'
                      }`}
                    >
                      <p className="font-medium text-sm">{formatDatePtBr(date)}</p>
                      <p className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Selecione o horário
                  </h3>
                  {timeSlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum horário disponível para este dia
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {timeSlots.map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <motion.button
                            type="button"
                            key={time}
                            data-time={time}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTime(time)}
                            className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-card hover:border-primary/30'
                            }`}
                          >
                            {time}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Summary */}
            {selectedDate && selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-secondary/10 rounded-xl border border-secondary/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-secondary" />
                  <p className="font-medium">Resumo do agendamento</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDatePtBr(selectedDate)} às {selectedTime}
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                type="button"
                disabled={!selectedDate || !selectedTime}
                onClick={handleConfirm}
              >
                Confirmar
              </Button>
            </div>

            {/* Info */}
            <p className="text-xs text-muted-foreground text-center">
              Funcionamos das 11h às 22h. Pedidos agendados são preparados na hora marcada.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function ScheduleBadge() {
  const [mounted, setMounted] = useState(false);
  const { isScheduled, getFormattedSchedule } = useScheduleStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isScheduled) return null;

  return (
    <Badge variant="secondary" className="gap-1">
      <Calendar className="w-3 h-3" />
      {getFormattedSchedule()}
    </Badge>
  );
}
