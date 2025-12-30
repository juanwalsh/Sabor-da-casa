'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, ShoppingBag, User, Search } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { getItemCount, openCart } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Esconder nav ao rolar para baixo, mostrar ao rolar para cima
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (!mounted) return null;

  // Não mostrar em páginas admin ou checkout
  if (pathname.startsWith('/admin') || pathname === '/checkout') {
    return null;
  }

  const navItems: NavItem[] = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/cardapio', label: 'Cardapio', icon: UtensilsCrossed },
    { href: '#search', label: 'Buscar', icon: Search },
    { href: '#cart', label: 'Carrinho', icon: ShoppingBag, badge: itemCount },
    { href: '/login', label: 'Conta', icon: User },
  ];

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    if (item.href === '#cart') {
      e.preventDefault();
      openCart();
    } else if (item.href === '#search') {
      e.preventDefault();
      // Rolar para o topo e focar na busca (se estiver no cardápio)
      if (pathname === '/cardapio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
          searchInput?.focus();
        }, 500);
      } else {
        window.location.href = '/cardapio';
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          role="navigation"
          aria-label="Navegacao principal"
        >
          {/* Gradient overlay para suavizar a transição */}
          <div className="absolute inset-x-0 bottom-full h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />

          <div className="bg-card/95 backdrop-blur-xl border-t border-border shadow-lg">
            <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
              {navItems.map((item) => {
                const isActive = item.href === pathname ||
                  (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;

                if (item.href.startsWith('#')) {
                  return (
                    <button
                      key={item.href}
                      onClick={(e) => handleNavClick(e as any, item)}
                      className="flex flex-col items-center justify-center w-16 py-1 relative"
                      aria-label={item.label}
                    >
                      <div className="relative">
                        <Icon
                          className={`w-6 h-6 ${
                            isActive ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        />
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="absolute -top-1 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-medium">
                            {item.badge > 9 ? '9+' : item.badge}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] mt-1 ${
                          isActive
                            ? 'text-primary font-medium'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary"
                        />
                      )}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center justify-center w-16 py-1 relative"
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="relative">
                      <Icon
                        className={`w-6 h-6 transition-colors ${
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="absolute -top-1 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-medium">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-1 transition-colors ${
                        isActive
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
