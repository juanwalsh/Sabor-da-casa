import { DashboardStats, ChartData } from '@/types';

export const dashboardStats: DashboardStats = {
  ordersToday: 47,
  ordersYesterday: 42,
  revenueToday: 3847.50,
  revenueYesterday: 3521.00,
  averageTicket: 81.86,
  pendingOrders: 8
};

export const chartData: ChartData[] = [
  { day: 'Seg', orders: 35, revenue: 2850 },
  { day: 'Ter', orders: 42, revenue: 3420 },
  { day: 'Qua', orders: 38, revenue: 3100 },
  { day: 'Qui', orders: 45, revenue: 3680 },
  { day: 'Sex', orders: 52, revenue: 4250 },
  { day: 'Sab', orders: 68, revenue: 5540 },
  { day: 'Dom', orders: 47, revenue: 3847 }
];
