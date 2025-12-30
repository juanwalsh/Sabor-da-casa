import { Category, Product, Testimonial, Order, DashboardStats, ChartData } from '@/types';

// ========================
// CATEGORIAS
// ========================
export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Pratos Principais',
    slug: 'pratos-principais',
    description: 'Pratos completos feitos com amor e ingredientes frescos',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    order: 1,
    active: true
  },
  {
    id: 'cat-2',
    name: 'Marmitas',
    slug: 'marmitas',
    description: 'Refeições completas prontas para o seu dia a dia',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    order: 2,
    active: true
  },
  {
    id: 'cat-3',
    name: 'Acompanhamentos',
    slug: 'acompanhamentos',
    description: 'Complementos perfeitos para sua refeição',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400',
    order: 3,
    active: true
  },
  {
    id: 'cat-4',
    name: 'Sobremesas',
    slug: 'sobremesas',
    description: 'Doces caseiros para adoçar seu dia',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    order: 4,
    active: true
  },
  {
    id: 'cat-5',
    name: 'Bebidas',
    slug: 'bebidas',
    description: 'Sucos naturais e bebidas refrescantes',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    order: 5,
    active: true
  }
];

// ========================
// PRODUTOS
// ========================
export const products: Product[] = [
  // Pratos Principais
  {
    id: 'prod-1',
    name: 'Feijoada Completa',
    description: 'Nossa tradicional feijoada com todas as carnes, acompanha arroz branco, couve refogada, farofa crocante e laranja.',
    price: 45.90,
    image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600',
    categoryId: 'cat-1',
    active: true,
    featured: true,
    preparationTime: 15,
    serves: 2,
    tags: ['popular', 'tradicional']
  },
  {
    id: 'prod-2',
    name: 'Frango Caipira com Quiabo',
    description: 'Frango caipira cozido lentamente com quiabo fresquinho, temperos da roça e muito sabor de fazenda.',
    price: 38.90,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600',
    categoryId: 'cat-1',
    active: true,
    featured: true,
    preparationTime: 20,
    serves: 2,
    tags: ['caipira', 'saudável']
  },
  {
    id: 'prod-3',
    name: 'Escondidinho de Carne Seca',
    description: 'Purê de mandioca cremoso com carne seca desfiada, gratinado com queijo coalho. Uma explosão de sabores!',
    price: 42.90,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600',
    categoryId: 'cat-1',
    active: true,
    featured: true,
    preparationTime: 25,
    serves: 2,
    tags: ['favorito', 'cremoso']
  },
  {
    id: 'prod-4',
    name: 'Carne de Panela da Vovó',
    description: 'Carne bovina cozida por horas em molho caseiro com batatas, cenouras e temperos especiais.',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
    categoryId: 'cat-1',
    active: true,
    featured: false,
    preparationTime: 18,
    serves: 2,
    tags: ['caseiro', 'tradicional']
  },
  {
    id: 'prod-5',
    name: 'Peixe Grelhado com Legumes',
    description: 'Filé de tilápia grelhado acompanhado de legumes salteados e arroz integral.',
    price: 44.90,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600',
    categoryId: 'cat-1',
    active: true,
    featured: false,
    preparationTime: 20,
    serves: 1,
    tags: ['leve', 'saudável'],
    isGlutenFree: true,
    isLowCalorie: true,
    calories: 380,
    spiceLevel: 'mild'
  },
  {
    id: 'prod-6',
    name: 'Feijão Tropeiro Mineiro',
    description: 'Feijão com farinha de mandioca, linguiça, bacon, ovos e couve. Receita tradicional de Minas Gerais.',
    price: 36.90,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    categoryId: 'cat-1',
    active: true,
    featured: true,
    preparationTime: 15,
    serves: 2,
    tags: ['mineiro', 'substancioso']
  },

  // Marmitas
  {
    id: 'prod-7',
    name: 'Marmita Executiva',
    description: 'Arroz, feijão, bife acebolado, salada e farofa. Perfeita para o almoço do dia a dia.',
    price: 24.90,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    categoryId: 'cat-2',
    active: true,
    featured: true,
    preparationTime: 10,
    serves: 1,
    tags: ['econômico', 'completo']
  },
  {
    id: 'prod-8',
    name: 'Marmita Fitness',
    description: 'Arroz integral, frango grelhado, brócolis, cenoura e batata doce. Saudável e saborosa!',
    price: 28.90,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600',
    categoryId: 'cat-2',
    active: true,
    featured: false,
    preparationTime: 10,
    serves: 1,
    tags: ['fitness', 'saudável'],
    isGlutenFree: true,
    isLowCalorie: true,
    calories: 420,
    spiceLevel: 'mild'
  },
  {
    id: 'prod-9',
    name: 'Marmita Premium',
    description: 'Arroz, feijão, picanha grelhada, legumes salteados e purê de batata.',
    price: 34.90,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600',
    categoryId: 'cat-2',
    active: true,
    featured: true,
    preparationTime: 12,
    serves: 1,
    tags: ['premium', 'especial']
  },
  {
    id: 'prod-10',
    name: 'Marmita Vegetariana',
    description: 'Arroz integral, feijão, legumes grelhados, salada colorida e grão de bico temperado.',
    price: 26.90,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    categoryId: 'cat-2',
    active: true,
    featured: false,
    preparationTime: 10,
    serves: 1,
    tags: ['vegetariano', 'saudável'],
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isLowCalorie: true,
    calories: 350,
    spiceLevel: 'mild'
  },

  // Acompanhamentos
  {
    id: 'prod-11',
    name: 'Arroz Branco',
    description: 'Arroz soltinho e bem temperado, porção generosa.',
    price: 8.90,
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600',
    categoryId: 'cat-3',
    active: true,
    featured: false,
    preparationTime: 5,
    serves: 2
  },
  {
    id: 'prod-12',
    name: 'Farofa da Casa',
    description: 'Farofa crocante com bacon, cebola e temperos especiais.',
    price: 9.90,
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600',
    categoryId: 'cat-3',
    active: true,
    featured: false,
    preparationTime: 5,
    serves: 2
  },
  {
    id: 'prod-13',
    name: 'Vinagrete',
    description: 'Salada de tomate, cebola e pimentão temperada com limão e azeite.',
    price: 7.90,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600',
    categoryId: 'cat-3',
    active: true,
    featured: false,
    preparationTime: 5,
    serves: 2,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isLowCalorie: true,
    calories: 45
  },
  {
    id: 'prod-14',
    name: 'Couve Refogada',
    description: 'Couve fresquinha refogada no alho e azeite.',
    price: 8.90,
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600',
    categoryId: 'cat-3',
    active: true,
    featured: false,
    preparationTime: 5,
    serves: 2,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isLowCalorie: true,
    calories: 60
  },

  // Sobremesas
  {
    id: 'prod-15',
    name: 'Pudim de Leite',
    description: 'Pudim cremoso de leite condensado com calda de caramelo. Receita da vovó!',
    price: 12.90,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600',
    categoryId: 'cat-4',
    active: true,
    featured: true,
    preparationTime: 5,
    serves: 1
  },
  {
    id: 'prod-16',
    name: 'Romeu e Julieta',
    description: 'Fatia generosa de goiabada cascão com queijo minas artesanal.',
    price: 10.90,
    image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600',
    categoryId: 'cat-4',
    active: true,
    featured: true,
    preparationTime: 5,
    serves: 1
  },
  {
    id: 'prod-17',
    name: 'Bolo de Milho',
    description: 'Bolo de milho cremoso feito com milho verde fresco. Sabor de festa junina!',
    price: 9.90,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
    categoryId: 'cat-4',
    active: true,
    featured: false,
    preparationTime: 5,
    serves: 1
  },
  {
    id: 'prod-18',
    name: 'Brigadeiro Gourmet',
    description: 'Brigadeiro cremoso coberto com granulado belga. Unidade.',
    price: 5.90,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600',
    categoryId: 'cat-4',
    active: true,
    featured: false,
    preparationTime: 2,
    serves: 1
  },

  // Bebidas
  {
    id: 'prod-19',
    name: 'Suco Natural de Laranja',
    description: 'Suco de laranja espremido na hora, 500ml.',
    price: 9.90,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: false,
    preparationTime: 5,
    serves: 1,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isLowCalorie: true,
    calories: 90
  },
  {
    id: 'prod-20',
    name: 'Suco de Maracujá',
    description: 'Suco natural de maracujá, refrescante e delicioso, 500ml.',
    price: 9.90,
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: false,
    preparationTime: 5,
    serves: 1,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isLowCalorie: true,
    calories: 85
  },
  {
    id: 'prod-21',
    name: 'Água de Coco',
    description: 'Água de coco natural, gelada e refrescante, 500ml.',
    price: 7.90,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: false,
    preparationTime: 2,
    serves: 1,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isLowCalorie: true,
    calories: 45
  },
  {
    id: 'prod-22',
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná ou Sprite, 350ml.',
    price: 5.90,
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: false,
    preparationTime: 1,
    serves: 1
  },
  {
    id: 'prod-23',
    name: 'Limonada Suíça',
    description: 'Limão batido com leite condensado e gelo, 400ml.',
    price: 11.90,
    image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: true,
    preparationTime: 5,
    serves: 1
  }
];

// ========================
// DEPOIMENTOS
// ========================
export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Maria Helena',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    comment: 'A feijoada deles é simplesmente a melhor que já comi! Me lembra a comida da minha avó. Entrega sempre no horário e quentinha.',
    date: new Date('2024-12-20')
  },
  {
    id: 'test-2',
    name: 'João Carlos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
    comment: 'Peço marmita todo dia pro almoço no trabalho. Preço justo, comida caseira de verdade e porções generosas!',
    date: new Date('2024-12-18')
  },
  {
    id: 'test-3',
    name: 'Ana Paula',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    comment: 'O escondidinho de carne seca é divino! Virei cliente fiel. O atendimento pelo WhatsApp é muito atencioso também.',
    date: new Date('2024-12-15')
  },
  {
    id: 'test-4',
    name: 'Roberto Silva',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    rating: 4,
    comment: 'Comida muito boa e entrega rápida. Só dou 4 estrelas porque queria mais opções vegetarianas.',
    date: new Date('2024-12-12')
  },
  {
    id: 'test-5',
    name: 'Fernanda Costa',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    rating: 5,
    comment: 'O pudim de leite é o melhor da cidade! Faço questão de pedir toda semana. Parabéns pela qualidade!',
    date: new Date('2024-12-10')
  }
];

// ========================
// PEDIDOS MOCK
// ========================
export const mockOrders: Order[] = [
  {
    id: 'order-001',
    customerName: 'Maria Santos',
    customerPhone: '(11) 99999-1111',
    customerEmail: 'maria@email.com',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    items: [
      { id: 'item-1', productId: 'prod-1', quantity: 1, unitPrice: 45.90 },
      { id: 'item-2', productId: 'prod-15', quantity: 2, unitPrice: 12.90 }
    ],
    subtotal: 71.70,
    deliveryFee: 8.00,
    discount: 0,
    total: 79.70,
    status: 'preparing',
    paymentMethod: 'pix',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'order-002',
    customerName: 'João Oliveira',
    customerPhone: '(11) 99999-2222',
    address: {
      street: 'Av. Brasil',
      number: '456',
      neighborhood: 'Jardim América',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-890'
    },
    items: [
      { id: 'item-3', productId: 'prod-7', quantity: 2, unitPrice: 24.90 },
      { id: 'item-4', productId: 'prod-21', quantity: 2, unitPrice: 7.90 }
    ],
    subtotal: 65.60,
    deliveryFee: 8.00,
    discount: 5.00,
    total: 68.60,
    status: 'confirmed',
    paymentMethod: 'credit_card',
    createdAt: new Date(Date.now() - 30 * 60000),
    updatedAt: new Date()
  },
  {
    id: 'order-003',
    customerName: 'Ana Costa',
    customerPhone: '(11) 99999-3333',
    address: {
      street: 'Rua Augusta',
      number: '789',
      complement: 'Casa',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-111'
    },
    items: [
      { id: 'item-5', productId: 'prod-3', quantity: 1, unitPrice: 42.90 },
      { id: 'item-6', productId: 'prod-12', quantity: 1, unitPrice: 9.90 },
      { id: 'item-7', productId: 'prod-19', quantity: 1, unitPrice: 9.90 }
    ],
    subtotal: 62.70,
    deliveryFee: 8.00,
    discount: 0,
    total: 70.70,
    status: 'delivering',
    paymentMethod: 'cash',
    notes: 'Troco para R$ 100',
    createdAt: new Date(Date.now() - 60 * 60000),
    updatedAt: new Date()
  },
  {
    id: 'order-004',
    customerName: 'Pedro Mendes',
    customerPhone: '(11) 99999-4444',
    address: {
      street: 'Rua Oscar Freire',
      number: '321',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-222'
    },
    items: [
      { id: 'item-8', productId: 'prod-9', quantity: 3, unitPrice: 34.90 }
    ],
    subtotal: 104.70,
    deliveryFee: 0,
    discount: 10.00,
    total: 94.70,
    status: 'delivered',
    paymentMethod: 'debit_card',
    createdAt: new Date(Date.now() - 120 * 60000),
    updatedAt: new Date()
  },
  {
    id: 'order-005',
    customerName: 'Carla Lima',
    customerPhone: '(11) 99999-5555',
    address: {
      street: 'Alameda Santos',
      number: '654',
      complement: 'Sala 12',
      neighborhood: 'Cerqueira César',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-333'
    },
    items: [
      { id: 'item-9', productId: 'prod-2', quantity: 2, unitPrice: 38.90 },
      { id: 'item-10', productId: 'prod-16', quantity: 2, unitPrice: 10.90 }
    ],
    subtotal: 99.60,
    deliveryFee: 8.00,
    discount: 0,
    total: 107.60,
    status: 'pending',
    paymentMethod: 'pix',
    createdAt: new Date(Date.now() - 5 * 60000),
    updatedAt: new Date()
  }
];

// ========================
// DASHBOARD STATS
// ========================
export const dashboardStats: DashboardStats = {
  ordersToday: 47,
  ordersYesterday: 42,
  revenueToday: 3847.50,
  revenueYesterday: 3521.00,
  averageTicket: 81.86,
  pendingOrders: 8
};

// ========================
// DADOS DO GRÁFICO
// ========================
export const chartData: ChartData[] = [
  { day: 'Seg', orders: 35, revenue: 2850 },
  { day: 'Ter', orders: 42, revenue: 3420 },
  { day: 'Qua', orders: 38, revenue: 3100 },
  { day: 'Qui', orders: 45, revenue: 3680 },
  { day: 'Sex', orders: 52, revenue: 4250 },
  { day: 'Sáb', orders: 68, revenue: 5540 },
  { day: 'Dom', orders: 47, revenue: 3847 }
];

// ========================
// CONSTANTES
// ========================
export const DELIVERY_FEE = 8.00;
export const FREE_DELIVERY_MIN = 80.00;
export const RESTAURANT_INFO = {
  name: 'Sabor da Casa',
  slogan: 'Comida caseira com sabor de fazenda',
  description: 'Há mais de 15 anos trazendo o verdadeiro sabor da comida brasileira para a sua mesa.',
  phone: '(11) 99999-0000',
  whatsapp: '5511999990000',
  email: 'contato@sabordacasa.com.br',
  address: 'Rua das Delícias, 123 - Centro, São Paulo - SP',
  hours: {
    weekdays: '11:00 - 22:00',
    weekends: '11:00 - 23:00'
  },
  deliveryTime: '30-45 min',
  social: {
    instagram: '@sabordacasa',
    facebook: 'sabordacasa'
  }
};

// Helper para pegar produtos por categoria
export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(p => p.categoryId === categoryId && p.active);
};

// Helper para pegar produtos em destaque
export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.featured && p.active);
};

// Helper para pegar categoria por slug
export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(c => c.slug === slug);
};

// Helper para formatar preço
export const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

// ========================
// SUGESTÕES DE COMBOS
// ========================
export interface ComboSuggestion {
  triggerCategoryId: string;
  suggestedProductIds: string[];
  message: string;
}

export const comboSuggestions: ComboSuggestion[] = [
  {
    triggerCategoryId: 'cat-1', // Pratos Principais
    suggestedProductIds: ['prod-22', 'prod-19', 'prod-21'], // Bebidas
    message: 'Que tal uma bebida para acompanhar?'
  },
  {
    triggerCategoryId: 'cat-2', // Marmitas
    suggestedProductIds: ['prod-15', 'prod-16', 'prod-18'], // Sobremesas
    message: 'Complete com uma sobremesa!'
  },
  {
    triggerCategoryId: 'cat-1', // Pratos Principais
    suggestedProductIds: ['prod-11', 'prod-12', 'prod-14'], // Acompanhamentos
    message: 'Adicione um acompanhamento extra!'
  }
];

// Helper para pegar sugestões de combo
export const getComboSuggestions = (cartCategoryIds: string[]): Product[] => {
  const suggestions: Product[] = [];

  comboSuggestions.forEach(combo => {
    if (cartCategoryIds.includes(combo.triggerCategoryId)) {
      combo.suggestedProductIds.forEach(productId => {
        const product = products.find(p => p.id === productId);
        if (product && !suggestions.find(s => s.id === product.id)) {
          suggestions.push(product);
        }
      });
    }
  });

  return suggestions.slice(0, 3); // Retorna no máximo 3 sugestões
};

// Helper para estimar tempo de entrega
export const getEstimatedDeliveryTime = (): { min: number; max: number; formatted: string } => {
  const now = new Date();
  const hour = now.getHours();

  // Horários de pico: 12-14h e 19-21h
  const isPeakHour = (hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21);

  const baseMin = 25;
  const baseMax = 40;
  const peakExtra = 15;

  const min = isPeakHour ? baseMin + peakExtra : baseMin;
  const max = isPeakHour ? baseMax + peakExtra : baseMax;

  return {
    min,
    max,
    formatted: `${min}-${max} min`
  };
};
