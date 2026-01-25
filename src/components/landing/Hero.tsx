'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Star, Flame, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RESTAURANT_INFO } from '@/data/mockData';

// Confetes de carnaval
const confettiColors = ['#FF6B35', '#F7C41F', '#00D9FF', '#FF2D92', '#7B2FF7', '#00FF88'];

interface ConfettiData {
  color: string;
  xOffset: number;
  rotateDirection: number;
  duration: number;
}

function Confetti({ delay = 0, left = '10%', data }: { delay?: number; left?: string; data?: ConfettiData }) {
  // Use valores fixos como fallback para evitar hydration mismatch
  const color = data?.color || confettiColors[0];
  const xOffset = data?.xOffset ?? 0;
  const rotateDirection = data?.rotateDirection ?? 1;
  const duration = data?.duration ?? 5;

  return (
    <motion.div
      className="absolute w-2 h-3 md:w-3 md:h-4 rounded-sm pointer-events-none"
      style={{ backgroundColor: color, left, top: '-20px' }}
      animate={{
        y: ['0vh', '100vh'],
        x: [0, xOffset],
        rotate: [0, 360 * rotateDirection],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: 'linear',
      }}
    />
  );
}

export default function Hero() {
  const [confettiData, setConfettiData] = useState<ConfettiData[]>([]);

  // Gera valores aleatorios apenas no cliente para evitar hydration mismatch
  useEffect(() => {
    const data = Array.from({ length: 12 }, () => ({
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      xOffset: Math.random() * 100 - 50,
      rotateDirection: Math.random() > 0.5 ? 1 : -1,
      duration: 4 + Math.random() * 2,
    }));
    setConfettiData(data);
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      {/* Confetes de Carnaval */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {confettiData.map((data, i) => (
          <Confetti key={i} delay={i * 0.3} left={`${5 + i * 8}%`} data={data} />
        ))}
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80"
          alt="Fundo de comida"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/60" />
      </div>

      {/* Decorative Elements - Carnaval colors */}
      <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-[#FF6B35]/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-[#F7C41F]/20 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#FF2D92]/15 rounded-full blur-2xl opacity-50 pointer-events-none hidden md:block" />

      {/* Floating Carnival Items - Decorative */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 right-[15%] hidden lg:block pointer-events-none"
      >
        <div className="w-14 h-14 rounded-full bg-[#FF2D92]/30 backdrop-blur-sm flex items-center justify-center text-2xl shadow-xl">
          🎭
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute bottom-32 left-[10%] hidden lg:block pointer-events-none"
      >
        <div className="w-12 h-12 rounded-full bg-[#F7C41F]/30 backdrop-blur-sm flex items-center justify-center text-xl shadow-xl">
          🎉
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge - Carnaval style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-[#FF6B35]/20 to-[#F7C41F]/20 border border-[#FF6B35]/30 mb-4 md:mb-6"
            >
              <PartyPopper className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-xs md:text-sm font-medium bg-gradient-to-r from-[#FF6B35] to-[#FF2D92] bg-clip-text text-transparent">
                Carnaval de Ofertas!
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 md:mb-6"
            >
              <span className="text-foreground">Sabor de casa,</span>
              <br />
              <span className="relative">
                <span className="text-primary">feito com amor</span>
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-accent"
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
              {RESTAURANT_INFO.description} Bebidas geladas para a folia!
            </motion.p>

            {/* Stats - Compacto */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 mb-6 md:mb-8"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-foreground">{RESTAURANT_INFO.deliveryTime}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Entrega</p>
                </div>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-secondary fill-secondary" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-foreground">4.9/5</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Avaliação</p>
                </div>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm md:text-lg">🎊</span>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-foreground">+5.000</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Clientes</p>
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
                className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-semibold rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF2D92] shadow-xl shadow-[#FF6B35]/30 hover:shadow-2xl hover:shadow-[#FF6B35]/40 transition-all group border-0"
              >
                <Link href="/cardapio">
                  Pedir Agora
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-semibold rounded-2xl border-2 hover:bg-muted/50 transition-all"
              >
                <Link href="#cardapio">
                  Ver Cardápio
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero Image - Mais compacto */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative w-[380px] xl:w-[450px] h-[380px] xl:h-[450px] mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF6B35]/30 via-[#FF2D92]/20 to-[#F7C41F]/30 blur-3xl" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-full border-2 border-dashed border-[#FF6B35]/30"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-10 rounded-full border-2 border-dashed border-[#F7C41F]/30"
                />
                <div className="absolute inset-6 rounded-full overflow-hidden shadow-2xl shadow-[#FF6B35]/20">
                  <Image
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80"
                    alt="Prato de comida brasileira"
                    fill
                    sizes="350px"
                    loading="eager"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Floating Cards - Carnaval style */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -left-4 top-1/4 bg-card p-3 rounded-xl shadow-xl border border-[#FF6B35]/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#F7C41F]/20 flex items-center justify-center text-xl">
                    🎭
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Carnaval</p>
                    <p className="text-[10px] text-muted-foreground">Promoções</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -right-2 bottom-1/3 bg-card p-3 rounded-xl shadow-xl border border-[#FF2D92]/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF2D92]/20 to-[#7B2FF7]/20 flex items-center justify-center text-xl">
                    🍻
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Geladas</p>
                    <p className="text-[10px] text-muted-foreground">Disponíveis</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Menor no mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
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
              className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#FF6B35]"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
