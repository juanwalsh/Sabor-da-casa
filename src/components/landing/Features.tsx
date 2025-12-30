'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Truck, Leaf, BookOpen, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Entrega Rápida',
    description: 'Sua comida quentinha em até 45 minutos. Rastreamento em tempo real do seu pedido.',
    color: 'primary',
    emoji: '🚀',
    stats: '30-45 min',
  },
  {
    icon: Leaf,
    title: 'Ingredientes Frescos',
    description: 'Selecionamos os melhores ingredientes todos os dias. Direto da feira para sua mesa.',
    color: 'secondary',
    emoji: '🥬',
    stats: '100% Natural',
  },
  {
    icon: BookOpen,
    title: 'Receitas Tradicionais',
    description: 'Receitas passadas de geração em geração. O verdadeiro sabor da culinária brasileira.',
    color: 'accent',
    emoji: '👵',
    stats: '+50 Receitas',
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="sobre" className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-4"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Por que nos escolher?</span>
          </motion.div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            O que nos torna{' '}
            <span className="text-primary relative">
              especiais
              <svg
                className="absolute -bottom-1 left-0 w-full h-2 text-accent/60"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 7 Q 25 0, 50 7 T 100 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mais do que um restaurante, somos uma extensão da sua família.
            Cada prato é preparado com dedicação e ingredientes selecionados.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative"
            >
              <div className="relative bg-card rounded-3xl p-8 border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full">
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110 ${
                        feature.color === 'primary'
                          ? 'bg-primary/10'
                          : feature.color === 'secondary'
                          ? 'bg-secondary/10'
                          : 'bg-accent/10'
                      }`}
                    >
                      {feature.emoji}
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="absolute -inset-2 rounded-2xl border border-dashed border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Stats Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      feature.color === 'primary'
                        ? 'bg-primary/10 text-primary'
                        : feature.color === 'secondary'
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-accent/20 text-accent-foreground'
                    }`}
                  >
                    <feature.icon className="w-4 h-4" />
                    {feature.stats}
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/20 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-secondary/20 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Decoration */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex justify-center"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-primary/50" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <div className="w-2 h-2 rounded-full bg-accent" />
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
