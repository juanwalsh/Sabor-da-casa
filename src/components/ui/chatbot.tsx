'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatPrice, DELIVERY_FEE, FREE_DELIVERY_MIN } from '@/data/mockData';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  quickReplies?: string[];
}

// Base de conhecimento do chatbot
const KNOWLEDGE_BASE = {
  greeting: {
    patterns: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'eae', 'e ai'],
    response: 'Olá! Sou o assistente virtual do Sabor da Casa. Como posso ajudar você hoje?',
    quickReplies: ['Ver cardápio', 'Horário de funcionamento', 'Taxa de entrega', 'Fazer pedido'],
  },
  menu: {
    patterns: ['cardápio', 'cardapio', 'menu', 'pratos', 'comida', 'o que tem', 'opções'],
    response: 'Temos um cardápio delicioso com pratos típicos brasileiros! Nossas categorias são: Pratos Principais, Acompanhamentos, Bebidas e Sobremesas. Você pode ver o cardápio completo clicando em "Ver Cardápio" no topo da página.',
    quickReplies: ['Pratos mais pedidos', 'Opções vegetarianas', 'Ver cardápio'],
  },
  hours: {
    patterns: ['horário', 'horario', 'hora', 'funcionamento', 'abre', 'fecha', 'aberto', 'fechado'],
    response: 'Funcionamos todos os dias das 11h às 22h. Pedidos agendados podem ser feitos para qualquer horário dentro desse período.',
    quickReplies: ['Agendar pedido', 'Fazer pedido agora'],
  },
  delivery: {
    patterns: ['entrega', 'delivery', 'taxa', 'frete', 'demora', 'tempo'],
    response: `A taxa de entrega é de ${formatPrice(DELIVERY_FEE)}. Em pedidos acima de ${formatPrice(FREE_DELIVERY_MIN)}, a entrega é GRÁTIS! O tempo médio de entrega é de 30-45 minutos.`,
    quickReplies: ['Áreas de entrega', 'Frete grátis'],
  },
  payment: {
    patterns: ['pagamento', 'pagar', 'pix', 'cartão', 'cartao', 'dinheiro', 'forma'],
    response: 'Aceitamos pagamento via PIX, cartão de crédito/débito e dinheiro na entrega. O pagamento é feito pelo WhatsApp após finalizar o pedido.',
    quickReplies: ['Como funciona o PIX', 'Fazer pedido'],
  },
  order: {
    patterns: ['pedido', 'pedir', 'comprar', 'quero', 'fazer pedido', 'como peço'],
    response: 'Para fazer um pedido é simples: 1) Escolha os itens no cardápio, 2) Adicione ao carrinho, 3) Finalize o pedido. Você será direcionado ao WhatsApp para confirmar.',
    quickReplies: ['Ver cardápio', 'Abrir carrinho'],
  },
  vegetarian: {
    patterns: ['vegetariano', 'vegano', 'sem carne', 'veggie'],
    response: 'Temos várias opções vegetarianas no cardápio! No cardápio, use o filtro "Vegetariano" para ver todas as opções disponíveis.',
    quickReplies: ['Ver opções vegetarianas', 'Ver cardápio'],
  },
  gluten: {
    patterns: ['glúten', 'gluten', 'celíaco', 'celiaco', 'sem glúten'],
    response: 'Alguns de nossos pratos são naturalmente sem glúten. Use o filtro "Sem Glúten" no cardápio para encontrar essas opções.',
    quickReplies: ['Ver opções sem glúten', 'Ver cardápio'],
  },
  promotion: {
    patterns: ['promoção', 'promocao', 'desconto', 'cupom', 'oferta'],
    response: 'Temos cupons de desconto disponíveis! Use BEMVINDO10 para 10% de desconto (pedido mínimo R$30) ou SABOR15 para 15% (pedido mínimo R$50).',
    quickReplies: ['Usar cupom', 'Ver cardápio'],
  },
  loyalty: {
    patterns: ['pontos', 'fidelidade', 'programa', 'benefício', 'beneficio'],
    response: 'Nosso programa de fidelidade é simples: a cada R$1 gasto, você ganha 1 ponto. Acumule pontos e troque por descontos, frete grátis e muito mais!',
    quickReplies: ['Ver meus pontos', 'Como funciona'],
  },
  contact: {
    patterns: ['contato', 'telefone', 'whatsapp', 'falar', 'atendente', 'humano'],
    response: 'Nosso WhatsApp é (11) 99999-9999. Se preferir falar com um atendente humano, envie uma mensagem por lá!',
    quickReplies: ['Abrir WhatsApp'],
  },
  thanks: {
    patterns: ['obrigado', 'obrigada', 'valeu', 'thanks', 'agradeço'],
    response: 'Por nada! Estou aqui para ajudar. Tem mais alguma dúvida?',
    quickReplies: ['Ver cardápio', 'Fazer pedido', 'Encerrar'],
  },
  bye: {
    patterns: ['tchau', 'até mais', 'ate mais', 'bye', 'adeus', 'encerrar', 'sair'],
    response: 'Até mais! Bom apetite e volte sempre ao Sabor da Casa!',
    quickReplies: [],
  },
};

function findBestResponse(input: string): { response: string; quickReplies: string[] } {
  const normalizedInput = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const [key, data] of Object.entries(KNOWLEDGE_BASE)) {
    for (const pattern of data.patterns) {
      const normalizedPattern = pattern.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalizedInput.includes(normalizedPattern)) {
        return { response: data.response, quickReplies: data.quickReplies || [] };
      }
    }
  }

  // Default response
  return {
    response: 'Desculpe, não entendi sua pergunta. Posso ajudar com informações sobre cardápio, horários, entrega, pagamento e promoções. Como posso ajudar?',
    quickReplies: ['Ver cardápio', 'Horário', 'Taxa de entrega', 'Falar com atendente'],
  };
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setMessages([
        {
          id: '1',
          type: 'bot',
          content: 'Olá! Sou o assistente virtual do Sabor da Casa. Como posso ajudar você hoje?',
          timestamp: new Date(),
          quickReplies: ['Ver cardápio', 'Horário de funcionamento', 'Taxa de entrega', 'Fazer pedido'],
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const { response, quickReplies } = findBestResponse(messageText);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: response,
        timestamp: new Date(),
        quickReplies,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  };

  const handleQuickReply = (reply: string) => {
    // Handle special actions
    if (reply === 'Ver cardápio' || reply === 'Ver opções vegetarianas' || reply === 'Ver opções sem glúten') {
      window.location.href = '/cardapio';
      return;
    }
    if (reply === 'Abrir WhatsApp') {
      window.open('https://wa.me/5511999999999', '_blank');
      return;
    }
    if (reply === 'Abrir carrinho') {
      // Would trigger cart open
      handleSend(reply);
      return;
    }

    handleSend(reply);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6" />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-accent-foreground">?</span>
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Assistente Virtual</p>
                  <p className="text-xs opacity-80">Online agora</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm'
                        : 'bg-muted rounded-2xl rounded-bl-sm'
                    } p-3`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-[10px] mt-1 ${message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>

                    {/* Quick Replies */}
                    {message.type === 'bot' && message.quickReplies && message.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.quickReplies.map((reply) => (
                          <button
                            key={reply}
                            onClick={() => handleQuickReply(reply)}
                            className="px-3 py-1.5 text-xs bg-background border rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm p-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
