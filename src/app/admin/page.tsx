'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Clock,
  Users,
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
import { dashboardStats, chartData, formatPrice } from '@/data/mockData';
import { useOrderStore } from '@/store/orderStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { orders } = useOrderStore();

  const stats = [
    {
      title: 'Pedidos Hoje',
      value: dashboardStats.ordersToday,
      change: ((dashboardStats.ordersToday - dashboardStats.ordersYesterday) / dashboardStats.ordersYesterday) * 100,
      icon: ShoppingBag,
      color: 'primary',
    },
    {
      title: 'Receita Hoje',
      value: formatPrice(dashboardStats.revenueToday),
      change: ((dashboardStats.revenueToday - dashboardStats.revenueYesterday) / dashboardStats.revenueYesterday) * 100,
      icon: DollarSign,
      color: 'secondary',
    },
    {
      title: 'Ticket Médio',
      value: formatPrice(dashboardStats.averageTicket),
      change: 5.2,
      icon: TrendingUp,
      color: 'accent',
    },
    {
      title: 'Pedidos Pendentes',
      value: dashboardStats.pendingOrders,
      change: null,
      icon: Clock,
      color: 'destructive',
    },
  ];

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
                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center bg-${stat.color}/10`}
                  >
                    <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-${stat.color}`} />
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

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="font-serif text-base sm:text-lg">Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 lg:p-6 pt-0">
            <div className="space-y-2 sm:space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-2 sm:p-4 rounded-lg sm:rounded-xl bg-muted/50 hover:bg-muted transition-colors gap-2"
                >
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold font-serif text-sm sm:text-base">{formatPrice(order.total)}</p>
                    <Badge variant={statusLabels[order.status].variant} className="text-xs">
                      {statusLabels[order.status].label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
