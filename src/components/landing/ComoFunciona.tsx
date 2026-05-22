'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, Utensils } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MARMITA_SIZES } from '@/data/mockData';

const steps = [
  {
    number: '01',
    title: 'Escolha o tamanho',
    description: 'P, M ou G. O preço é fechado pelo tamanho da marmita — sem peso, sem surpresa.',
    emoji: '🍱',
  },
  {
    number: '02',
    title: 'Monte seu prato',
    description: 'Encha de arroz, feijão, proteína, salada, guarnição. Como você quiser, dentro da marmita.',
    emoji: '🥄',
  },
  {
    number: '03',
    title: 'Almoço servido',
    description: 'Tudo feito na hora, no fogão de casa. Pegou e já tá pronto pra comer.',
    emoji: '🍽️',
  },
];

export default function ComoFunciona() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      id="como-funciona"
      className="relative py-14 md:py-20 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
            <Utensils className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs md:text-sm font-medium text-amber-700 dark:text-amber-400">
              Como funciona
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Três passos, prato cheio
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Sem aplicativo, sem cadastro, sem balança. Chegou, escolheu, comeu.
          </p>
        </motion.div>

        {/* Passos */}
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-14 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-card rounded-2xl p-5 md:p-6 border border-border hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                {step.number}
              </div>
              <div className="text-4xl md:text-5xl mb-3">{step.emoji}</div>
              <h3 className="font-semibold text-lg text-foreground mb-1.5">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tamanhos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-6 md:mb-8"
        >
          <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-1">
            Escolha o tamanho que cabe na sua fome
          </h3>
          <p className="text-sm text-muted-foreground">Tudo incluso na marmita — sem cobrar item extra.</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {MARMITA_SIZES.map((size, index) => {
            const isPopular = size.id === 'M';
            return (
              <motion.div
                key={size.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className={`relative rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-xl ${
                  isPopular
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-amber-500'
                    : 'bg-card border-border hover:border-amber-500/40'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-bold shadow-md">
                    Mais pedido
                  </div>
                )}
                <div className="text-center mb-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Marmita
                  </div>
                  <div className="text-5xl font-serif font-bold text-foreground mb-1">{size.id}</div>
                  <div className="text-sm text-muted-foreground">{size.name}</div>
                </div>
                <div className="text-center mb-5">
                  <span className="text-3xl md:text-4xl font-bold text-amber-700 dark:text-amber-400">
                    R$ {size.price.toFixed(0)}
                  </span>
                </div>
                <ul className="space-y-2 mb-2">
                  <li className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <span>{size.capacity}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <span>{size.portions}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <span>{size.description}</span>
                  </li>
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-center mt-10 md:mt-14"
        >
          <Button
            asChild
            size="lg"
            className="h-12 md:h-14 px-8 text-sm md:text-base font-semibold rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-xl shadow-amber-600/30 text-white border-0"
          >
            <Link href="/cardapio">Ver cardápio do dia</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
