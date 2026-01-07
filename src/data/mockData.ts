import { Category, Product, Testimonial, Order, DashboardStats, ChartData } from '@/types';

// ========================
// CATEGORIAS (apenas 2: Pratos e Bebidas)
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
    id: 'cat-5',
    name: 'Bebidas',
    slug: 'bebidas',
    description: 'Bebidas refrescantes para acompanhar sua refeicao',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    order: 2,
    active: true
  }
];

// ========================
// PRODUTOS (5 Pratos + 10 Bebidas)
// ========================
export const products: Product[] = [
  // ===== 5 PRATOS PRINCIPAIS =====
  {
    id: 'prod-1',
    name: 'Feijoada Completa',
    description: 'Tradicional feijoada com carnes selecionadas, arroz branco, couve refogada, farofa e laranja.',
    price: 45.90,
    image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600',
    categoryId: 'cat-1',
    active: true,
    featured: true,
    preparationTime: 15,
    serves: 2,
    tags: ['popular', 'tradicional'],
    stock: 30
  },
  {
    id: 'prod-2',
    name: 'Picanha Grelhada',
    description: 'Picanha grelhada no ponto, acompanha arroz, feijao, farofa e vinagrete.',
    price: 59.90,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600',
    categoryId: 'cat-1',
    active: true,
    featured: true,
    preparationTime: 20,
    serves: 2,
    tags: ['premium', 'churrasco'],
    stock: 30
  },
  {
    id: 'prod-3',
    name: 'Frango a Parmegiana',
    description: 'File de frango empanado coberto com molho de tomate e queijo gratinado, arroz e fritas.',
    price: 42.90,
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=600',
    categoryId: 'cat-1',
    active: true,
    featured: true,
    preparationTime: 18,
    serves: 1,
    tags: ['favorito', 'empanado'],
    stock: 30
  },
  {
    id: 'prod-4',
    name: 'Peixe Grelhado',
    description: 'File de tilapia grelhado com legumes salteados, arroz e salada fresca.',
    price: 48.90,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600',
    categoryId: 'cat-1',
    active: true,
    featured: false,
    preparationTime: 20,
    serves: 1,
    tags: ['leve', 'saudavel'],
    isGlutenFree: true,
    isLowCalorie: true,
    calories: 380,
    stock: 30
  },
  {
    id: 'prod-5',
    name: 'Strogonoff de Carne',
    description: 'Strogonoff cremoso de carne com arroz branco, batata palha e salada.',
    price: 39.90,
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600',
    categoryId: 'cat-1',
    active: true,
    featured: true,
    preparationTime: 15,
    serves: 1,
    tags: ['cremoso', 'classico'],
    stock: 30
  },

  // ===== 10 BEBIDAS =====
  {
    id: 'prod-10',
    name: 'Coca-Cola Lata 350ml',
    description: 'Refrigerante Coca-Cola original gelado.',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: false,
    preparationTime: 1,
    serves: 1,
    stock: 80
  },
  {
    id: 'prod-11',
    name: 'Coca-Cola Zero Lata 350ml',
    description: 'Refrigerante Coca-Cola zero acucar gelado.',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: false,
    preparationTime: 1,
    serves: 1,
    stock: 80
  },
  {
    id: 'prod-12',
    name: 'Guarana Antarctica Lata 350ml',
    description: 'Refrigerante Guarana Antarctica gelado.',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: false,
    preparationTime: 1,
    serves: 1,
    stock: 80
  },
  {
    id: 'prod-13',
    name: 'Fanta Laranja Lata 350ml',
    description: 'Refrigerante Fanta sabor laranja gelado.',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: false,
    preparationTime: 1,
    serves: 1,
    stock: 80
  },
  {
    id: 'prod-14',
    name: 'Sprite Lata 350ml',
    description: 'Refrigerante Sprite limao gelado.',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: false,
    preparationTime: 1,
    serves: 1,
    stock: 80
  },
  {
    id: 'prod-15',
    name: 'Agua Mineral 500ml',
    description: 'Agua mineral sem gas gelada.',
    price: 4.00,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: false,
    preparationTime: 1,
    serves: 1,
    stock: 80
  },
  {
    id: 'prod-16',
    name: 'Agua com Gas 500ml',
    description: 'Agua mineral com gas gelada.',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: false,
    preparationTime: 1,
    serves: 1,
    stock: 80
  },
  {
    id: 'prod-17',
    name: 'Suco de Laranja Natural 500ml',
    description: 'Suco de laranja natural espremido na hora.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: true,
    preparationTime: 5,
    serves: 1,
    stock: 80
  },
  {
    id: 'prod-18',
    name: 'Suco de Limao 500ml',
    description: 'Limonada natural refrescante.',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: false,
    preparationTime: 5,
    serves: 1,
    stock: 80
  },
  {
    id: 'prod-19',
    name: 'Cerveja Heineken Long Neck',
    description: 'Cerveja Heineken gelada 330ml.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600',
    categoryId: 'cat-5',
    active: true,
    featured: false,
    preparationTime: 1,
    serves: 1,
    stock: 80
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
    comment: 'A feijoada deles e simplesmente a melhor que ja comi! Me lembra a comida da minha avo.',
    date: new Date('2024-12-20')
  },
  {
    id: 'test-2',
    name: 'Joao Carlos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
    comment: 'Picanha sensacional! Preco justo e porcoes generosas.',
    date: new Date('2024-12-18')
  },
  {
    id: 'test-3',
    name: 'Ana Paula',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    comment: 'Strogonoff divino! Virei cliente fiel.',
    date: new Date('2024-12-15')
  }
];

// ========================
// PEDIDOS MOCK (simplificado)
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
      city: 'Sao Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    items: [
      { id: 'item-1', productId: 'prod-1', quantity: 1, unitPrice: 45.90 },
      { id: 'item-2', productId: 'prod-10', quantity: 2, unitPrice: 6.00 }
    ],
    subtotal: 57.90,
    deliveryFee: 8.00,
    discount: 0,
    total: 65.90,
    status: 'preparing',
    paymentMethod: 'pix',
    createdAt: new Date(),
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
// DADOS DO GRAFICO
// ========================
export const chartData: ChartData[] = [
  { day: 'Seg', orders: 35, revenue: 2850 },
  { day: 'Ter', orders: 42, revenue: 3420 },
  { day: 'Qua', orders: 38, revenue: 3100 },
  { day: 'Qui', orders: 45, revenue: 3680 },
  { day: 'Sex', orders: 52, revenue: 4250 },
  { day: 'Sab', orders: 68, revenue: 5540 },
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
  description: 'Ha mais de 15 anos trazendo o verdadeiro sabor da comida brasileira para a sua mesa.',
  phone: '(11) 99999-0000',
  whatsapp: '5511999990000',
  email: 'contato@sabordacasa.com.br',
  address: 'Rua das Delicias, 123 - Centro, Sao Paulo - SP',
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

// Helper para formatar preco
export const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

// Helper para estimar tempo de entrega
export const getEstimatedDeliveryTime = (): { min: number; max: number; formatted: string } => {
  const now = new Date();
  const hour = now.getHours();
  const isPeakHour = (hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21);
  const baseMin = 25;
  const baseMax = 40;
  const peakExtra = 15;
  const min = isPeakHour ? baseMin + peakExtra : baseMin;
  const max = isPeakHour ? baseMax + peakExtra : baseMax;
  return { min, max, formatted: `${min}-${max} min` };
};
