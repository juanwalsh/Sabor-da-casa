'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChefHat,
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  LogOut,
  Menu,
  Bell,
  Users,
  Clock,
  CheckCircle,
  Package,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/admin/produtos', label: 'Produtos', icon: UtensilsCrossed },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout, checkAuth } = useAuthStore();
  const pendingOrders = useOrderStore((state) => state.getPendingOrdersCount());
  const orders = useOrderStore((state) => state.orders);
  const recentPendingOrders = orders
    .filter((o) => o.status === 'pending' || o.status === 'preparing')
    .slice(0, 5);

  // Fechar menu mobile quando a rota mudar
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const Sidebar = ({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : 'w-64 border-r border-border'}`}>
      {/* Logo */}
      <div className="p-4 sm:p-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2 sm:gap-3" onClick={onNavigate}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0">
            <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="font-serif font-bold text-sm sm:text-base truncate">Sabor da Casa</h1>
            <p className="text-[10px] text-muted-foreground">Painel Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="font-medium text-sm sm:text-base">{item.label}</span>
                {item.label === 'Pedidos' && pendingOrders > 0 && (
                  <Badge
                    variant={isActive ? 'secondary' : 'default'}
                    className="ml-auto text-xs"
                  >
                    {pendingOrders}
                  </Badge>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 sm:p-4 border-t border-border">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user?.name?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-xs sm:text-sm truncate">{user?.name}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sm"
          onClick={() => {
            onNavigate?.();
            handleLogout();
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen bg-card">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 overflow-x-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" aria-label="Abrir menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <VisuallyHidden>
                  <SheetTitle>Menu de navegacao</SheetTitle>
                  <SheetDescription>Menu principal do painel administrativo</SheetDescription>
                </VisuallyHidden>
                <Sidebar mobile onNavigate={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="hidden lg:block">
              <h2 className="font-serif text-lg font-bold">
                {navItems.find((item) => item.href === pathname)?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-1 sm:gap-3">
              <ThemeToggle />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {pendingOrders > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Notificacoes</h4>
                      {pendingOrders > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {pendingOrders} pendente{pendingOrders > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ScrollArea className="h-[300px]">
                    {recentPendingOrders.length > 0 ? (
                      <div className="divide-y divide-border">
                        {recentPendingOrders.map((order) => (
                          <Link
                            key={order.id}
                            href="/admin/pedidos"
                            className="flex items-start gap-3 p-4 hover:bg-muted transition-colors"
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              order.status === 'pending'
                                ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {order.status === 'pending' ? (
                                <Clock className="w-5 h-5" />
                              ) : (
                                <Package className="w-5 h-5" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                Pedido #{order.id.slice(-6)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.customerName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.status === 'pending' ? 'Aguardando confirmacao' : 'Em preparo'}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                          <CheckCircle className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Tudo em dia!</p>
                        <p className="text-xs text-muted-foreground">
                          Nenhum pedido pendente
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                  {recentPendingOrders.length > 0 && (
                    <div className="p-3 border-t border-border">
                      <Link href="/admin/pedidos">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver todos os pedidos
                        </Button>
                      </Link>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <Link href="/" target="_blank" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  Ver Site
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
