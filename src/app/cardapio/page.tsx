'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Filter,
  ChevronLeft,
  Plus,
  Star,
  Clock,
  Users,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { products, categories, formatPrice } from '@/data/mockData';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from '@/components/ui/favorite-button';
import { VoiceSearch } from '@/components/ui/voice-search';
import { AdvancedFilters, AdvancedFiltersState, defaultFilters } from '@/components/ui/advanced-filters';
import { OrderHistoryList } from '@/components/ui/order-history';
import { PushNotificationToggle } from '@/components/ui/push-notification-toggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ProductModal from '@/components/menu/ProductModal';
import CartSidebar from '@/components/menu/CartSidebar';
import { toast } from 'sonner';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

export default function CardapioPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFiltersState>(defaultFilters);
  const { addItem, openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((p) => p.active);

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.categoryId === selectedCategory);
    }

    // Advanced filters
    if (advancedFilters.vegetarian) {
      filtered = filtered.filter((p) => p.isVegetarian);
    }
    if (advancedFilters.vegan) {
      filtered = filtered.filter((p) => p.isVegan);
    }
    if (advancedFilters.glutenFree) {
      filtered = filtered.filter((p) => p.isGlutenFree);
    }
    if (advancedFilters.lowCalorie) {
      filtered = filtered.filter((p) => p.isLowCalorie);
    }
    if (advancedFilters.maxPrepTime !== null) {
      filtered = filtered.filter((p) => (p.preparationTime || 0) <= advancedFilters.maxPrepTime!);
    }
    if (advancedFilters.spiceLevel !== 'all') {
      filtered = filtered.filter((p) => p.spiceLevel === advancedFilters.spiceLevel);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep featured items first
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, advancedFilters]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} adicionado!`, {
      description: formatPrice(product.price),
      action: {
        label: 'Ver carrinho',
        onClick: () => openCart(),
      },
    });
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || '';
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <h1 className="font-sans text-lg sm:text-xl font-semibold">Cardápio</h1>
              </div>

              <div className="flex items-center gap-2">
                <OrderHistoryList className="hidden sm:flex" />
                <PushNotificationToggle />
                <Button
                  onClick={openCart}
                  className="relative rounded-full"
                  size="icon"
                >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                      {itemCount > 9 ? '9+' : itemCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="sticky top-16 z-30 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar pratos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-xl"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-10 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <VoiceSearch onResult={(text) => setSearchQuery(text)} />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Destaques</SelectItem>
                  <SelectItem value="price-asc">Menor preço</SelectItem>
                  <SelectItem value="price-desc">Maior preço</SelectItem>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Advanced Filters */}
            <AdvancedFilters
              filters={advancedFilters}
              onFiltersChange={setAdvancedFilters}
              className="mt-4"
            />
          </div>
        </div>

        {/* Products Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="font-sans text-lg sm:text-xl font-semibold mb-2">
                Nenhum prato encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Tente buscar por outro termo ou categoria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {filteredAndSortedProducts.length} pratos encontrados
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            className="object-cover"
                            priority={index < 4}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Tags */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            {product.featured && (
                              <Badge className="bg-accent text-accent-foreground shadow-sm">
                                Destaque
                              </Badge>
                            )}
                            {product.tags?.slice(0, 1).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-card/95 dark:bg-background/90 backdrop-blur-sm text-card-foreground shadow-sm border border-border/50"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Favorite Button */}
                          <div className="absolute top-3 right-3">
                            <FavoriteButton productId={product.id} productName={product.name} size="sm" />
                          </div>

                          {/* Quick Add */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleAddToCart(product, e)}
                            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Plus className="w-5 h-5" />
                          </motion.button>

                          <div className="absolute bottom-3 left-3">
                            <span className="text-xs text-white/80 font-medium">
                              {getCategoryName(product.categoryId)}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-5 flex-1 flex flex-col">
                          <h3 className="font-sans text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 group-hover:text-primary transition-colors line-clamp-1">
                            {product.name}
                          </h3>

                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 flex-1">
                            {product.description}
                          </p>

                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-[10px] sm:text-xs text-muted-foreground">
                            {product.preparationTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span>{product.preparationTime} min</span>
                              </div>
                            )}
                            {product.serves && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span>{product.serves}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-accent">
                              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                              <span>4.9</span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xl sm:text-2xl font-bold text-primary">
                              {formatPrice(product.price)}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => handleAddToCart(product, e)}
                              className="rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary text-xs sm:text-sm px-3 shrink-0"
                            >
                              Adicionar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </main>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <CartSidebar />
    </>
  );
}
