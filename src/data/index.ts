// Exporta tudo de um lugar so para facilitar imports

// Categorias
export { categories } from './categories';

// Produtos (todos juntos e separados)
export { products, porcoes, pratos, bebidas, combos } from './products';

// Depoimentos
export { testimonials } from './testimonials';

// Pedidos mock
export { mockOrders } from './orders';

// Dashboard
export { dashboardStats, chartData } from './dashboard';

// Constantes e helpers
export {
  DELIVERY_FEE,
  FREE_DELIVERY_MIN,
  RESTAURANT_INFO,
  getProductsByCategory,
  getFeaturedProducts,
  getCategoryBySlug,
  formatPrice,
  getEstimatedDeliveryTime
} from './constants';
