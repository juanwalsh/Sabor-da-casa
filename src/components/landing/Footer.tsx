'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Heart,
  ArrowUpRight,
  Settings,
  PartyPopper,
} from 'lucide-react';
import { RESTAURANT_INFO } from '@/data/mockData';

const footerLinks = {
  menu: [
    { label: 'Cervejas', href: '/cardapio#cervejas' },
    { label: 'Refrigerantes', href: '/cardapio#refrigerantes' },
    { label: 'Destilados', href: '/cardapio#destilados' },
    { label: 'Gelo', href: '/cardapio#gelo' },
  ],
  company: [
    { label: 'Sobre Nós', href: '#sobre' },
    { label: 'Depoimentos', href: '#depoimentos' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
  ],
};

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <footer id="contato" className="relative overflow-hidden">
      {/* Newsletter Section - Compacto e Carnaval */}
      <div className="bg-gradient-to-r from-[#FF6B35]/5 to-[#F7C41F]/5 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-[#FF6B35] via-[#FF2D92] to-[#F7C41F] rounded-2xl p-5 md:p-8 relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-black/10 rounded-full blur-3xl" />

            <div className="relative flex flex-col items-center justify-center text-center py-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <PartyPopper className="w-6 h-6 text-white" />
                <h3 className="font-serif text-xl md:text-3xl font-bold text-white">
                  Ofertas de carnaval
                </h3>
              </div>
              <p className="text-white text-lg md:text-2xl font-bold">
                Produtos com até 30% de desconto!
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer - Compacto */}
      <div className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-[#FF6B35]/30">
                  <Image
                    src="/logo.jpg"
                    alt="EP LOPES Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-foreground">
                    EP LOPES
                  </h2>
                  <p className="text-[9px] text-muted-foreground tracking-wider uppercase">
                    Forte do Gelo
                  </p>
                </div>
              </Link>

              <p className="text-muted-foreground text-xs mb-4 leading-relaxed">
                {RESTAURANT_INFO.slogan}
              </p>


            </div>

            {/* Links Column */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Cardápio</h4>
              <ul className="space-y-1">
                {footerLinks.menu.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-[#FF6B35] transition-colors py-1.5 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Column */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Links</h4>
              <ul className="space-y-1">
                {[...footerLinks.company, ...footerLinks.support].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-[#FF6B35] transition-colors py-1.5 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Contato</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
                  <a
                    href={`tel:${RESTAURANT_INFO.phone}`}
                    className="text-xs text-muted-foreground hover:text-[#FF6B35] transition-colors"
                  >
                    {RESTAURANT_INFO.phone}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B35] shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground break-words">
                    Rua Independencia, Bairro Tamoios, Número 9
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#FF6B35] shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p>Seg-Dom: 10:00 - 23:00</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Compacto */}
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} EP LOPES
              </p>
              <div className="flex items-center gap-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  Feito com <Heart className="w-3 h-3 text-[#FF2D92] fill-[#FF2D92]" />
                </p>
                <Link
                  href="/login"
                  className="text-muted-foreground/40 hover:text-muted-foreground transition-colors p-1"
                  title="Área restrita"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
