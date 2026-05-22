'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, Soup, Utensils } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RESTAURANT_INFO, MARMITA_SIZES } from '@/data/mockData';

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[88vh] md:min-h-[92vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with warm overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
          alt="Prato caseiro brasileiro"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/75 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-transparent to-background/60" />
      </div>

      {/* Warm decorative glows */}
      <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-amber-500/15 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-orange-600/15 rounded-full blur-3xl opacity-40 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-amber-500/15 border border-amber-500/30 mb-4 md:mb-6"
            >
              <Soup className="w-4 h-4 text-amber-600" />
              <span className="text-xs md:text-sm font-medium text-amber-700 dark:text-amber-400">
                Bandejão • Almoço servido na hora
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 md:mb-6"
            >
              <span className="text-foreground">Monte seu prato</span>
              <br />
              <span className="relative">
                <span className="text-primary">da Lu</span>
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-amber-500"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <motion.path
                    d="M2 10C50 2 150 2 198 10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </motion.svg>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-5 md:mb-8 leading-relaxed"
            >
              {RESTAURANT_INFO.description}
            </motion.p>

            {/* Tamanhos rápidos */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-2 md:gap-3 max-w-md mx-auto lg:mx-0 mb-6 md:mb-8"
            >
              {MARMITA_SIZES.map((size) => (
                <div
                  key={size.id}
                  className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-2.5 md:p-3 text-center"
                >
                  <div className="text-xs md:text-sm text-muted-foreground">Marmita {size.id}</div>
                  <div className="text-base md:text-lg font-bold text-amber-700 dark:text-amber-400">
                    R$ {size.price.toFixed(0)}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Info linha */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 mb-6 md:mb-8"
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-amber-500/15 flex items-center justify-center">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-foreground">
                    {RESTAURANT_INFO.hours.weekdays}
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Segunda a sexta</p>
                </div>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-orange-500/15 flex items-center justify-center">
                  <Utensils className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-foreground">Feito na hora</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Tempero de casa</p>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-semibold rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-xl shadow-amber-600/30 transition-all group border-0 text-white"
              >
                <Link href="/cardapio">
                  Ver Cardápio do Dia
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-semibold rounded-2xl border-2 hover:bg-muted/50 transition-all"
              >
                <Link href="#como-funciona">Como funciona</Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="relative w-[380px] xl:w-[460px] h-[380px] xl:h-[460px] mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/30 via-orange-500/20 to-yellow-500/30 blur-3xl" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border-2 border-dashed border-amber-500/30"
                />
                <div className="absolute inset-6 rounded-full overflow-hidden shadow-2xl shadow-amber-600/20">
                  <Image
                    src="https://images.unsplash.com/photo-1583338917496-7ea264c374ce?w=600&q=80"
                    alt="Bandejão com pessoas se servindo"
                    fill
                    sizes="350px"
                    loading="eager"
                    className="object-cover"
                  />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -left-4 top-1/4 bg-card p-3 rounded-xl shadow-xl border border-amber-500/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center text-xl">
                    🍚
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Arroz & Feijão</p>
                    <p className="text-[10px] text-muted-foreground">Todo dia</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -right-2 bottom-1/3 bg-card p-3 rounded-xl shadow-xl border border-orange-500/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/15 flex items-center justify-center text-xl">
                    🍗
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Proteínas</p>
                    <p className="text-[10px] text-muted-foreground">Escolha sua</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          <span className="text-[10px] md:text-xs tracking-widest uppercase hidden md:block">Scroll</span>
          <div className="w-5 h-8 md:w-6 md:h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5 md:p-2">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-amber-600"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
