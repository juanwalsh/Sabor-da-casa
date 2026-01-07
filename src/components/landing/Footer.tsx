'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import {
  ChefHat,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Heart,
  ArrowUpRight,
  Settings,
} from 'lucide-react';
import { RESTAURANT_INFO } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerLinks = {
  menu: [
    { label: 'Pratos Principais', href: '/cardapio#pratos-principais' },
    { label: 'Marmitas', href: '/cardapio#marmitas' },
    { label: 'Sobremesas', href: '/cardapio#sobremesas' },
    { label: 'Bebidas', href: '/cardapio#bebidas' },
  ],
  company: [
    { label: 'Sobre Nós', href: '#sobre' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Blog', href: '/blog' },
    { label: 'Trabalhe Conosco', href: '/carreiras' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Entrega', href: '/entrega' },
    { label: 'Termos de Uso', href: '/termos' },
    { label: 'Privacidade', href: '/privacidade' },
  ],
};

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <footer id="contato" className="relative overflow-hidden">
      {/* Newsletter Section */}
      <div className="bg-primary/5 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 sm:p-12 relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl" />

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary-foreground mb-3">
                  Receba ofertas exclusivas
                </h3>
                <p className="text-primary-foreground/80">
                  Cadastre-se e ganhe 10% de desconto no primeiro pedido!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="h-12 bg-white/90 border-0 rounded-xl text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-6 rounded-xl font-semibold whitespace-nowrap"
                >
                  Quero Desconto
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                  <ChefHat className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    Sabor da Casa
                  </h2>
                  <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                    Comida Caseira
                  </p>
                </div>
              </Link>

              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                {RESTAURANT_INFO.slogan}. Fazendo famílias felizes há mais de 15 anos.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href={`https://instagram.com/${RESTAURANT_INFO.social.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={`https://facebook.com/${RESTAURANT_INFO.social.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Menu Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Cardápio</h4>
              <ul className="space-y-1">
                {footerLinks.menu.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group py-3 min-h-[44px]"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-1">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group py-3 min-h-[44px]"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Suporte</h4>
              <ul className="space-y-1">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group py-3 min-h-[44px]"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground break-words">
                    {RESTAURANT_INFO.address}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a
                    href={`tel:${RESTAURANT_INFO.phone}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    {RESTAURANT_INFO.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a
                    href={`mailto:${RESTAURANT_INFO.email}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors break-all py-1"
                  >
                    {RESTAURANT_INFO.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p>Seg-Sex: {RESTAURANT_INFO.hours.weekdays}</p>
                    <p>Sáb-Dom: {RESTAURANT_INFO.hours.weekends}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Sabor da Casa. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-6 sm:gap-3">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  Feito com <Heart className="w-4 h-4 text-primary fill-primary" /> em São Paulo
                </p>
                <Link
                  href="/login"
                  className="text-muted-foreground/40 hover:text-muted-foreground transition-colors p-2"
                  title="Área restrita"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
