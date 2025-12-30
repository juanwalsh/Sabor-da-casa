'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, User, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'A Historia da Feijoada Brasileira',
    excerpt:
      'Descubra a origem desse prato tipico que conquistou o coracao dos brasileiros e se tornou simbolo da nossa culinaria.',
    content: '',
    image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800',
    author: 'Chef Maria',
    date: '20 Dez 2024',
    readTime: '5 min',
    category: 'Historia',
    featured: true,
  },
  {
    id: '2',
    title: '5 Dicas para uma Comida Caseira Perfeita',
    excerpt:
      'Segredos da nossa cozinha para voce preparar refeicoes deliciosas em casa com aquele gostinho de comida de vovo.',
    content: '',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    author: 'Chef Joao',
    date: '18 Dez 2024',
    readTime: '4 min',
    category: 'Dicas',
  },
  {
    id: '3',
    title: 'Alimentacao Saudavel sem Abrir Mao do Sabor',
    excerpt:
      'Como equilibrar saude e prazer na alimentacao? Mostramos que e possivel comer bem e de forma nutritiva.',
    content: '',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    author: 'Nutricionista Ana',
    date: '15 Dez 2024',
    readTime: '6 min',
    category: 'Saude',
  },
  {
    id: '4',
    title: 'Os Temperos Essenciais da Cozinha Brasileira',
    excerpt:
      'Conheca os temperos que nao podem faltar na sua despensa para dar aquele sabor especial aos seus pratos.',
    content: '',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
    author: 'Chef Maria',
    date: '12 Dez 2024',
    readTime: '3 min',
    category: 'Ingredientes',
  },
  {
    id: '5',
    title: 'Receita: Escondidinho de Carne Seca',
    excerpt:
      'Aprenda a fazer em casa uma das receitas mais pedidas do nosso cardapio. Passo a passo completo!',
    content: '',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800',
    author: 'Chef Joao',
    date: '10 Dez 2024',
    readTime: '8 min',
    category: 'Receitas',
  },
  {
    id: '6',
    title: 'Como Montar uma Marmita Equilibrada',
    excerpt:
      'Dicas praticas para organizar suas refeicoes da semana com praticidade e nutricao balanceada.',
    content: '',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    author: 'Nutricionista Ana',
    date: '08 Dez 2024',
    readTime: '5 min',
    category: 'Dicas',
  },
];

const categories = ['Todos', 'Receitas', 'Dicas', 'Saude', 'Historia', 'Ingredientes'];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todos' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured || selectedCategory !== 'Todos');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full mr-4">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-sans text-xl font-semibold">Blog</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Sabor da Casa Blog
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Receitas, dicas, historias e muito mais sobre a culinaria brasileira
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar artigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'Todos' && !searchQuery && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="relative rounded-3xl overflow-hidden bg-card border border-border">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:p-10 flex flex-col justify-center">
                  <Badge className="w-fit mb-4">Destaque</Badge>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <Button className="w-fit rounded-xl group">
                    Ler mais
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.article>
        )}

        {/* Posts Grid */}
        {regularPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Nenhum artigo encontrado.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/30 transition-all hover:shadow-lg"
              >
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4">{post.category}</Badge>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>{post.readTime} de leitura</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-primary/5 rounded-3xl p-8 text-center">
          <h3 className="font-serif text-2xl font-bold mb-4">
            Receba nossas novidades
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Cadastre-se para receber receitas exclusivas e dicas de culinaria
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              className="h-12 rounded-xl"
            />
            <Button size="lg" className="rounded-xl whitespace-nowrap">
              Inscrever-se
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
