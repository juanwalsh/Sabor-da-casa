import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ScheduleState {
  isScheduled: boolean;
  scheduledDate: string | null; // ISO date string
  scheduledTime: string | null; // HH:mm format
  setSchedule: (date: string, time: string) => void;
  clearSchedule: () => void;
  getScheduledDateTime: () => Date | null;
  getFormattedSchedule: () => string | null;
}

// Horários de funcionamento
export const BUSINESS_HOURS = {
  start: 11, // 11:00
  end: 22, // 22:00
};

// Gerar horários disponíveis
export function getAvailableTimeSlots(date: Date): string[] {
  const slots: string[] = [];
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  let startHour = BUSINESS_HOURS.start;

  // Se for hoje, começar a partir da próxima hora cheia + 1h de preparo
  if (isToday) {
    const currentHour = now.getHours();
    startHour = Math.max(currentHour + 2, BUSINESS_HOURS.start);
  }

  for (let hour = startHour; hour <= BUSINESS_HOURS.end; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < BUSINESS_HOURS.end) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  return slots;
}

// Gerar próximos 7 dias disponíveis
export function getAvailableDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  return dates;
}

export function formatDatePtBr(date: Date): string {
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Amanhã';
  }

  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      isScheduled: false,
      scheduledDate: null,
      scheduledTime: null,

      setSchedule: (date: string, time: string) => {
        set({
          isScheduled: true,
          scheduledDate: date,
          scheduledTime: time,
        });
      },

      clearSchedule: () => {
        set({
          isScheduled: false,
          scheduledDate: null,
          scheduledTime: null,
        });
      },

      getScheduledDateTime: () => {
        const { scheduledDate, scheduledTime } = get();
        if (!scheduledDate || !scheduledTime) return null;

        const [hours, minutes] = scheduledTime.split(':').map(Number);
        const date = new Date(scheduledDate);
        date.setHours(hours, minutes, 0, 0);

        return date;
      },

      getFormattedSchedule: () => {
        const { scheduledDate, scheduledTime } = get();
        if (!scheduledDate || !scheduledTime) return null;

        const date = new Date(scheduledDate);
        return `${formatDatePtBr(date)} às ${scheduledTime}`;
      },
    }),
    {
      name: 'sabor-da-casa-schedule',
    }
  )
);
