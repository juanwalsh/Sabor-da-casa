'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Snowflake, PartyPopper, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Snowflake,
    title: 'Bebidas Super Geladas',
    description: 'Frigoríficos de última geração garantem suas bebidas sempre geladas, chegando em minutos na sua porta.',
    color: 'primary',
    emoji: '🧊',
    stats: '30-45 min • Sempre Frias',
  },
  {
    icon: PartyPopper,
    title: 'Promoções de Carnaval',
    description: 'Descontos especiais para a folia!',
    color: 'accent',
    emoji: '🎉',
    stats: 'Até 30% OFF',
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="sobre" className="py-12 md:py-16 relative overflow-hidden">
      {/* Background Pattern - Carnival colors */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-40 md:w-64 h-40 md:h-64 bg-[#FF6B35]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 md:w-72 h-48 md:h-72 bg-[#F7C41F]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header - Compacto */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF6B35]/10 to-[#F7C41F]/10 border border-[#FF6B35]/20 mb-3"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-[#FF6B35]" />
            <span className="text-xs md:text-sm font-medium text-[#FF6B35]">Por que nos escolher?</span>
          </motion.div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-3">
            O que nos torna{' '}
            <span className="bg-gradient-to-r from-[#FF6B35] to-[#FF2D92] bg-clip-text text-transparent relative">
              especiais
            </span>
          </h2>

          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Bebidas geladas e promoções de carnaval imperdíveis!
          </p>
        </motion.div>

        {/* Features Grid - Compacto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative bg-card rounded-2xl p-4 md:p-6 border border-border hover:border-[#FF6B35]/30 transition-all duration-300 hover:shadow-xl h-full">
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF6B35]/5 to-[#F7C41F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0">
                  {/* Icon */}
                  <div className="relative sm:mb-4">
                    <div
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-105 ${
                        feature.color === 'primary'
                          ? 'bg-[#FF6B35]/10'
                          : feature.color === 'secondary'
                          ? 'bg-[#00D9FF]/10'
                          : 'bg-[#F7C41F]/10'
                      }`}
                    >
                      {feature.emoji}
                    </div>
                  </div>

                  <div className="flex-1 sm:flex-none">
                    {/* Title */}
                    <h3 className="font-sans text-base md:text-lg font-semibold text-foreground mb-1 group-hover:text-[#FF6B35] transition-colors">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-2 md:mb-3">
                      {feature.description}
                    </p>

                    {/* Stats Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
                        feature.color === 'primary'
                          ? 'bg-[#FF6B35]/10 text-[#FF6B35]'
                          : feature.color === 'secondary'
                          ? 'bg-[#00D9FF]/10 text-[#00D9FF]'
                          : 'bg-[#F7C41F]/20 text-[#D4940F]'
                      }`}
                    >
                      <feature.icon className="w-3 h-3" />
                      {feature.stats}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
