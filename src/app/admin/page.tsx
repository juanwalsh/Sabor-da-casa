'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Clock,
  Users,
  Loader2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { formatPrice } from '@/data/mockData';
import { useOrders } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { orders, isLoading, getTodayStats } = useOrders();

  const dashboardStats = useMemo(() => getTodayStats(), [getTodayStats]);

  // Calcula dados do grafico baseado nos pedidos reais
  const chartData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === date.getTime();
      });

      weekData.push({
        day: days[date.getDay()],
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
      });
    }

    return weekData;
  }, [orders]);

  const stats = [
    {
      title: 'Pedidos Hoje',
      value: dashboardStats.ordersToday,
      change: dashboardStats.ordersYesterday > 0
        ? ((dashboardStats.ordersToday - dashboardStats.ordersYesterday) / dashboardStats.ordersYesterday) * 100
        : 0,
      icon: ShoppingBag,
      bgClass: 'bg-primary/10',
      textClass: 'text-primary',
    },
    {
      title: 'Receita Hoje',
      value: formatPrice(dashboardStats.revenueToday),
      change: dashboardStats.revenueYesterday > 0
        ? ((dashboardStats.revenueToday - dashboardStats.revenueYesterday) / dashboardStats.revenueYesterday) * 100
        : 0,
      icon: DollarSign,
      bgClass: 'bg-secondary/10',
      textClass: 'text-secondary',
    },
    {
      title: 'Ticket Médio',
      value: formatPrice(dashboardStats.averageTicket),
      change: null,
      icon: TrendingUp,
      bgClass: 'bg-accent/10',
      textClass: 'text-accent',
    },
    {
      title: 'Pedidos Pendentes',
      value: dashboardStats.pendingOrders,
      change: null,
      icon: Clock,
      bgClass: 'bg-destructive/10',
      textClass: 'text-destructive',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const recentOrders = orders.slice(0, 5);

  const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Pendente', variant: 'outline' },
    confirmed: { label: 'Confirmado', variant: 'secondary' },
    preparing: { label: 'Preparando', variant: 'default' },
    ready: { label: 'Pronto', variant: 'secondary' },
    delivering: { label: 'Entregando', variant: 'default' },
    delivered: { label: 'Entregue', variant: 'secondary' },
    cancelled: { label: 'Cancelado', variant: 'destructive' },
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${stat.bgClass}`}
                  >
                    <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${stat.textClass}`} />
                  </div>
                  {stat.change !== null && (
                    <div
                      className={`flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm ${
                        stat.change >= 0 ? 'text-secondary' : 'text-destructive'
                      }`}
                    >
                      {stat.change >= 0 ? (
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      <span className="hidden xs:inline">{Math.abs(stat.change).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold font-serif truncate">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="font-serif text-base sm:text-lg">Receita da Semana</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6 pt-0">
              <div className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" debounce={50}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" className="text-xs" tick={{ fontSize: 10 }} />
                    <YAxis className="text-xs" tickFormatter={(v) => `R$${v}`} tick={{ fontSize: 10 }} width={50} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value) => [formatPrice(value as number), 'Receita']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="font-serif text-base sm:text-lg">Pedidos da Semana</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6 pt-0">
              <div className="h-[200px] sm:h-[250px] lg:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" debounce={50}>
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" className="text-xs" tick={{ fontSize: 10 }} />
                    <YAxis className="text-xs" tick={{ fontSize: 10 }} width={30} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value) => [value as number, 'Pedidos']}
                    />
                    <Bar
                      dataKey="orders"
                      fill="hsl(var(--secondary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
