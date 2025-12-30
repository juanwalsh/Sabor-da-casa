'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, Search, MessageCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RESTAURANT_INFO } from '@/data/mockData';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    category: 'Pedidos',
    question: 'Como faço um pedido?',
    answer: 'Você pode fazer seu pedido diretamente pelo nosso site! Basta acessar o cardápio, escolher os itens desejados, adicionar ao carrinho e finalizar o pedido. O pagamento pode ser feito via PIX, cartão ou dinheiro na entrega.',
  },
  {
    category: 'Pedidos',
    question: 'Qual o valor mínimo do pedido?',
    answer: 'Não temos valor mínimo para pedidos! Porém, pedidos acima de R$ 80,00 têm frete grátis. Para pedidos abaixo desse valor, a taxa de entrega é de R$ 8,00.',
  },
  {
    category: 'Pedidos',
    question: 'Posso agendar meu pedido para outro horário?',
    answer: 'Sim! Durante o checkout, você pode escolher entre receber o pedido o mais rápido possível ou agendar para um horário específico no mesmo dia.',
  },
  {
    category: 'Pedidos',
    question: 'Como cancelo ou altero meu pedido?',
    answer: 'Você pode cancelar ou alterar seu pedido entrando em contato conosco pelo WhatsApp dentro de 5 minutos após a confirmação. Após esse período, o pedido já estará em preparo.',
  },
  {
    category: 'Entrega',
    question: 'Qual a área de entrega?',
    answer: 'Atendemos toda a região central de São Paulo e bairros próximos num raio de até 8km. Você pode verificar se entregamos no seu endereço durante o checkout.',
  },
  {
    category: 'Entrega',
    question: 'Qual o tempo de entrega?',
    answer: 'O tempo médio de entrega é de 30 a 45 minutos, podendo variar em horários de pico (12h-14h e 19h-21h). Você pode acompanhar o status do seu pedido em tempo real.',
  },
  {
    category: 'Entrega',
    question: 'Vocês entregam nos finais de semana e feriados?',
    answer: 'Sim! Funcionamos todos os dias. De segunda a sexta das 11h às 22h, e aos sábados, domingos e feriados das 11h às 23h.',
  },
  {
    category: 'Pagamento',
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos PIX, cartões de crédito e débito (todas as bandeiras), e dinheiro na entrega. Para pagamento em dinheiro, informe se precisa de troco no campo de observações.',
  },
  {
    category: 'Pagamento',
    question: 'Como funciona o pagamento via PIX?',
    answer: 'Após finalizar o pedido, você receberá um QR Code ou chave PIX para pagamento. O pedido será confirmado automaticamente após a identificação do pagamento.',
  },
  {
    category: 'Cardápio',
    question: 'Vocês têm opções vegetarianas/veganas?',
    answer: 'Sim! Temos diversas opções vegetarianas e veganas em nosso cardápio. Você pode usar os filtros na página do cardápio para encontrá-las facilmente.',
  },
  {
    category: 'Cardápio',
    question: 'Os pratos contêm glúten ou lactose?',
    answer: 'Indicamos em cada prato se ele é livre de glúten. Para informações específicas sobre lactose ou outros alergênicos, entre em contato conosco pelo WhatsApp.',
  },
  {
    category: 'Cardápio',
    question: 'Posso personalizar meu pedido?',
    answer: 'Claro! Ao adicionar um item ao carrinho, você pode incluir observações como "sem cebola", "molho à parte", etc. Faremos o possível para atender suas preferências.',
  },
  {
    category: 'Outros',
    question: 'Vocês fazem eventos e encomendas grandes?',
    answer: 'Sim! Para eventos, festas ou pedidos acima de 20 pessoas, entre em contato pelo WhatsApp com pelo menos 48h de antecedência para combinarmos os detalhes.',
  },
  {
    category: 'Outros',
    question: 'Como funciona o programa de fidelidade?',
    answer: 'A cada R$ 1,00 gasto, você acumula 1 ponto. Ao atingir 100 pontos, você ganha R$ 10,00 de desconto no próximo pedido. Os pontos são válidos por 6 meses.',
  },
];

const categories = ['Todos', 'Pedidos', 'Entrega', 'Pagamento', 'Cardápio', 'Outros'];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFAQs = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full mr-4">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-sans text-xl font-semibold">Perguntas Frequentes</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Como podemos ajudar?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encontre respostas para as perguntas mais comuns sobre nossos serviços
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar pergunta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 rounded-2xl text-lg"
          />
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

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhuma pergunta encontrada. Tente outro termo ou entre em contato conosco.
              </p>
            </div>
          ) : (
            filteredFAQs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                  aria-expanded={openItems.includes(index)}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-medium pr-4">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openItems.includes(index) && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-muted-foreground border-t border-border pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-primary/5 rounded-3xl p-8 text-center">
          <h3 className="font-serif text-2xl font-bold mb-4">
            Ainda tem duvidas?
          </h3>
          <p className="text-muted-foreground mb-6">
            Nossa equipe esta pronta para ajudar voce
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-xl">
              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <a href={`tel:${RESTAURANT_INFO.phone}`}>
                <Phone className="w-5 h-5 mr-2" />
                Ligar
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <a href={`mailto:${RESTAURANT_INFO.email}`}>
                <Mail className="w-5 h-5 mr-2" />
                E-mail
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
