'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, Heart, Settings, Utensils, Instagram } from 'lucide-react';
import { RESTAURANT_INFO } from '@/data/mockData';

const footerLinks = {
  menu: [
    { label: 'Proteínas', href: '/cardapio#proteinas' },
    { label: 'Arroz e Carboidratos', href: '/cardapio#arroz-carboidratos' },
    { label: 'Saladas', href: '/cardapio#saladas' },
    { label: 'Guarnições', href: '/cardapio#guarnicoes' },
  ],
  company: [
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Depoimentos', href: '#depoimentos' },
  ],
};

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <footer id="contato" className="relative overflow-hidden">
      {/* Faixa CTA */}
      <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 md:p-10 relative overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-black/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Utensils className="w-6 h-6 text-white" />
                <h3 className="font-serif text-xl md:text-3xl font-bold text-white">
                  Almoço servido todo dia útil
                </h3>
              </div>
              <p className="text-white text-base md:text-lg">
                {RESTAURANT_INFO.hours.weekdays} &bull; Tempero de casa, prato cheio
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer principal */}
      <div className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Marca */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-600/30">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-foreground">
                    {RESTAURANT_INFO.name}
                  </h2>
                  <p className="text-[9px] text-muted-foreground tracking-wider uppercase">
                    Bandejão Caseiro
                  </p>
                </div>
              </Link>

              <p className="text-muted-foreground text-xs mb-4 leading-relaxed">
                {RESTAURANT_INFO.slogan}
              </p>

              <a
                href={`https://instagram.com/${RESTAURANT_INFO.social.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                {RESTAURANT_INFO.social.instagram}
              </a>
            </div>

            {/* Cardápio */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Cardápio</h4>
              <ul className="space-y-1">
                {footerLinks.menu.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-amber-700 dark:hover:text-amber-400 transition-colors py-1.5 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Saiba mais</h4>
              <ul className="space-y-1">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-amber-700 dark:hover:text-amber-400 transition-colors py-1.5 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Contato</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <a
                    href={`tel:${RESTAURANT_INFO.phone}`}
                    className="text-xs text-muted-foreground hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                  >
                    {RESTAURANT_INFO.phone}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground break-words">
                    {RESTAURANT_INFO.address}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p>Seg-Sex: {RESTAURANT_INFO.hours.weekdays}</p>
                    <p>Fim de semana: fechado</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} {RESTAURANT_INFO.name}
              </p>
              <div className="flex items-center gap-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  Feito com <Heart className="w-3 h-3 text-amber-600 fill-amber-600" /> e tempero de casa
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
