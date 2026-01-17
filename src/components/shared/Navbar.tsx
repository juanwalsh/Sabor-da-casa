'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useActiveSection } from '@/hooks/useActiveSection';
import ThemeToggle from './ThemeToggle';
import CartButton from './CartButton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const navLinks = [
  { href: '#inicio', label: 'Início', sectionId: 'inicio' },
  { href: '#sobre', label: 'Sobre', sectionId: 'sobre' },
  { href: '#cardapio', label: 'Cardápio', sectionId: 'cardapio' },
  { href: '#depoimentos', label: 'Depoimentos', sectionId: 'depoimentos' },
  { href: '#contato', label: 'Contato', sectionId: 'contato' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const activeSection = useActiveSection(navLinks.map((link) => link.sectionId));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl shadow-lg shadow-primary/5 border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/40 transition-shadow">
                <Image
                  src="/logo.jpg"
                  alt="EP LOPES Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-xl font-bold text-foreground leading-tight">
                EP LOPES
              </h1>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">
                Forte do Gelo
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link
                  href={link.href}
                  className={`relative px-4 py-3 text-sm font-medium transition-colors group ${
                    activeSection === link.sectionId
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                      activeSection === link.sectionId
                        ? 'w-1/2'
                        : 'w-0 group-hover:w-1/2'
                    }`}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Cart Button */}
            <CartButton />

            {/* Mobile Menu */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-xl">
                <div className="flex flex-col h-full pt-8">
                  <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden">
                      <Image
                        src="/logo.jpg"
                        alt="EP LOPES Logo"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="font-serif text-lg font-bold">EP LOPES</h2>
                      <p className="text-xs text-muted-foreground">Forte do Gelo</p>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-xl transition-colors font-medium ${
                            activeSection === link.sectionId
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>

                  <div className="mt-auto pt-6 border-t border-border">
                    <Button
                      asChild
                      className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/30"
                    >
                      <Link href="/cardapio" onClick={() => setIsMobileOpen(false)}>
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        Ver Cardápio
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
