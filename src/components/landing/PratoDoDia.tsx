'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { categories, products } from '@/data/mockData';

// Prato do dia destacado - editável (em produção viria de um config/CMS)
const PRATO_DO_DIA = {
  name: 'Bife Acebolado com Arroz e Feijão',
  description:
    'O clássico do bandejão: bife bovino na chapa, cebola dourada, arroz soltinho, feijão temperado e couve refogada. Acompanha farofa e vinagrete da casa.',
  image:
    'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&q=80',
  weekday: 'Hoje',
  available: 'No almoço',
};

export default function PratoDoDia() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="cardapio" className="py-12 md:py-16 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-0 w-64 md:w-80 h-64 md:h-80 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-0 w-48 md:w-64 h-48 md:h-64 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-3">
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-xs md:text-sm font-medium text-orange-700 dark:text-orange-400">
              {PRATO_DO_DIA.weekday}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Prato do dia
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            Toda semana um clássico diferente. O fixo continua disponível.
          </p>
        </motion.div>

        {/* Destaque do dia */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-5xl mx-auto mb-12 md:mb-16"
        >
          <div className="relative bg-card rounded-3xl overflow-hidden border border-amber-500/30 shadow-xl">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto md:min-h-[320px]">
                <Image
                  src={PRATO_DO_DIA.image}
                  alt={PRATO_DO_DIA.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-transparent" />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-600 text-white text-xs font-bold shadow-lg">
                  <Flame className="w-3.5 h-3.5" />
                  {PRATO_DO_DIA.available}
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {PRATO_DO_DIA.name}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
                  {PRATO_DO_DIA.description}
                </p>
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Já incluso</div>
                    <div className="text-sm font-semibold text-foreground">No preço da marmita</div>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0"
                >
                  <Link href="/cardapio">
                    Ver cardápio completo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categorias resumidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-6 md:mb-8"
        >
          <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-1">
            O que tem pra montar
          </h3>
          <p className="text-sm text-muted-foreground">Categorias disponíveis todo dia</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
          {categories.map((cat, index) => {
            const itemCount = products.filter((p) => p.categoryId === cat.id && p.active).length;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
              >
                <Link
                  href={`/cardapio#${cat.slug}`}
                  className="group block bg-card rounded-2xl overflow-hidden border border-border hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg h-full"
                >
                  <div className="relative h-28 md:h-36 overflow-hidden">
                    {cat.image && (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <h4 className="text-white font-semibold text-sm md:text-base drop-shadow-lg">
                        {cat.name}
                      </h4>
                      <p className="text-white/80 text-[10px] md:text-xs">
                        {itemCount} {itemCount === 1 ? 'opção' : 'opções'}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-8 md:mt-12"
        >
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-11 md:h-12 px-6 md:px-8 text-sm md:text-base font-semibold rounded-xl border-2 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all group"
          >
            <Link href="/cardapio">
              Ver cardápio completo
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
