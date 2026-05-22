'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ChefHat, Heart, Wallet, Sparkles } from 'lucide-react';

const features = [
  {
    icon: ChefHat,
    title: 'Comida feita na hora',
    description: 'Tudo preparado no dia, no fogão de casa. Sem reaproveitar do dia anterior, sem atalho.',
    emoji: '👩‍🍳',
    stats: 'Preparado diariamente',
  },
  {
    icon: Heart,
    title: 'Você monta como quiser',
    description: 'Escolha sua proteína, encha de salada, capricha no arroz e feijão — do seu jeito, sem regra.',
    emoji: '🍽️',
    stats: 'Sem limite de itens',
  },
  {
    icon: Wallet,
    title: 'Preço fechado',
    description: 'Escolha o tamanho da marmita (P, M ou G) e pague o valor combinado. Nada de surpresa no caixa.',
    emoji: '💰',
    stats: 'A partir de R$ 20',
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="sobre" className="py-12 md:py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-40 md:w-64 h-40 md:h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 md:w-72 h-48 md:h-72 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-amber-600" />
            <span className="text-xs md:text-sm font-medium text-amber-700 dark:text-amber-400">
              Por que comer aqui
            </span>
          </motion.div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-3">
            Almoço com{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              cara de casa
            </span>
          </h2>

          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Bandejão honesto, comida bem feita, sem mistério.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative bg-card rounded-2xl p-4 md:p-6 border border-border hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl h-full">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0">
                  <div className="relative sm:mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-2xl md:text-3xl bg-amber-500/10 transition-transform duration-300 group-hover:scale-105">
                      {feature.emoji}
                    </div>
                  </div>

                  <div className="flex-1 sm:flex-none">
                    <h3 className="font-sans text-base md:text-lg font-semibold text-foreground mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-2 md:mb-3">
                      {feature.description}
                    </p>

                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400">
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
