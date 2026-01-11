import { Product, Category } from '@/types';
import { products } from './products';
import { categories } from './categories';

// ========================
// CONSTANTES DE ENTREGA
// ========================
export const DELIVERY_FEE = 8.00;
export const FREE_DELIVERY_MIN = 80.00;

// ========================
// INFORMACOES DO RESTAURANTE
// ========================
export const RESTAURANT_INFO = {
  name: 'Sabor da Casa',
  slogan: 'Comida caseira com sabor de fazenda',
  description: 'Ha mais de 15 anos trazendo o verdadeiro sabor da comida brasileira para a sua mesa.',
  phone: '(22) 99999-5200',
  whatsapp: '5522999995200',
  email: 'contato@sabordacasa.com.br',
  address: 'Rua das Delicias, 123 - Centro',
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

// Estima tempo de entrega baseado no horario
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
