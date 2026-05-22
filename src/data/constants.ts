import { Product, Category } from '@/types';
import { products } from './products';
import { categories } from './categories';

// ========================
// TAMANHOS DE MARMITA
// ========================
export const MARMITA_SIZES = [
  {
    id: 'P',
    name: 'Pequena',
    price: 20.0,
    description: 'Pra matar a fome sem exagero',
    capacity: 'Aprox. 400g',
    portions: '1 proteína + acompanhamentos',
  },
  {
    id: 'M',
    name: 'Média',
    price: 28.0,
    description: 'A escolha campeã do almoço',
    capacity: 'Aprox. 600g',
    portions: '1 proteína + acompanhamentos à vontade',
  },
  {
    id: 'G',
    name: 'Grande',
    price: 35.0,
    description: 'Pra quem chegou com fome de leão',
    capacity: 'Aprox. 800g',
    portions: '2 proteínas + acompanhamentos à vontade',
  },
] as const;

// ========================
// INFORMACOES DO ESTABELECIMENTO
// ========================
export const RESTAURANT_INFO = {
  name: 'Sabor da Casa',
  slogan: 'Bandejão Caseiro - Monte Seu Prato',
  description: 'Comida feita na hora, tempero de casa. Escolha o tamanho da sua marmita e monte do seu jeito.',
  phone: '(22) 99999-5200',
  whatsapp: '5522999995200',
  email: 'contato@sabordacasa.com.br',
  address: 'Rua Independencia, Bairro Tamoios, Número 9',
  hours: {
    weekdays: '11:00 - 15:00',
    weekends: 'Fechado'
  },
  deliveryTime: 'Almoço quentinho na hora',
  social: {
    instagram: '@sabordacasa',
    facebook: 'sabordacasa'
  }
};

// ========================
// HELPERS
// ========================

// Pega produtos por categoria
export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(p => p.categoryId === categoryId && p.active);
};

// Pega produtos em destaque
export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.featured && p.active);
};

// Pega categoria por slug
export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(c => c.slug === slug);
};

// Formata preco em reais
export const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

// Mantido por compatibilidade com componentes legados (não usado no fluxo de bandejão)
export const DELIVERY_FEE = 0;
export const FREE_DELIVERY_MIN = 0;
export const getEstimatedDeliveryTime = (): { min: number; max: number; formatted: string } => {
  return { min: 0, max: 0, formatted: 'Almoço servido na hora' };
};
