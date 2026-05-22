'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Leaf, Wheat, Soup, Flame } from 'lucide-react';
import { categories, products, MARMITA_SIZES } from '@/data/mockData';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CardapioPage() {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.slug ?? '');

  const scrollToCategory = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      const offset = 180;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveCategory(slug);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-serif text-lg sm:text-xl font-bold leading-tight">
                  Cardápio do dia
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Tudo o que tem pra montar sua marmita
                </p>
              </div>
            </div>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden md:inline-flex rounded-xl border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
            >
              <Link href="/#como-funciona">Como funciona</Link>
            </Button>
          </div>
        </div>

        {/* Pills de categoria */}
        <div className="border-t border-border bg-background/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.slug)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.slug
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Lembrete de tamanhos */}
      <section className="border-b border-border bg-gradient-to-b from-amber-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-1">
                Monte com o que estiver na bandeja hoje
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Tudo abaixo está disponível dentro da marmita do tamanho que você escolher — sem cobrar item extra.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-3 md:w-auto">
              {MARMITA_SIZES.map((size) => (
                <div
                  key={size.id}
                  className="rounded-xl bg-card border border-border px-3 py-2 text-center min-w-[88px]"
                >
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Marmita
                  </div>
                  <div className="text-2xl font-bold text-foreground leading-none my-0.5">
                    {size.id}
                  </div>
                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    R$ {size.price.toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12 md:space-y-16">
        {categories.map((cat) => {
          const items = products.filter((p) => p.categoryId === cat.id && p.active);
          if (!items.length) return null;

          return (
            <section
              key={cat.id}
              id={cat.slug}
              className="scroll-mt-44"
            >
              <header className="mb-5 md:mb-6 flex items-end justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                      {cat.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                  {items.length} {items.length === 1 ? 'opção' : 'opções'}
                </span>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {items.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Rodapé com CTA voltar */}
      <div className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Bateu fome? Apareça por aqui no horário do almoço.
          </p>
          <Button
            asChild
            className="rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0"
          >
            <Link href="/">Voltar pra página inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg flex flex-col">
      {/* Foto real do item preenchendo o card */}
      <div className="relative h-32 md:h-40 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradiente sutil no rodapé pra legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Emoji pequeno no canto inferior direito */}
        {product.emoji && (
          <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-base shadow-md">
            {product.emoji}
          </div>
        )}

        {product.featured && (
          <Badge className="absolute top-2 left-2 bg-white/95 hover:bg-white text-amber-700 text-[10px] gap-1 px-2 py-0.5 border-0 font-semibold">
            <Flame className="w-3 h-3" />
            Sempre no fogão
          </Badge>
        )}
      </div>

      <div className="p-3 md:p-4 flex-1 flex flex-col">
        <h4 className="font-semibold text-sm md:text-base text-foreground mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
          {product.name}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {(product.isVegetarian || product.isVegan || product.isGlutenFree) && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border">
            {product.isVegan && (
              <DietBadge icon={<Leaf className="w-3 h-3" />} label="Vegano" />
            )}
            {product.isVegetarian && !product.isVegan && (
              <DietBadge icon={<Leaf className="w-3 h-3" />} label="Vegetariano" />
            )}
            {product.isGlutenFree && (
              <DietBadge icon={<Wheat className="w-3 h-3" />} label="Sem glúten" />
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function DietBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
      {icon}
      {label}
    </span>
  );
}
