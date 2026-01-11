// Re-exporta tudo do index para manter compatibilidade com imports existentes
export {
  categories,
  products,
  porcoes,
  pratos,
  bebidas,
  combos,
  testimonials,
  mockOrders,
  dashboardStats,
  chartData,
  DELIVERY_FEE,
  FREE_DELIVERY_MIN,
  RESTAURANT_INFO,
  getProductsByCategory,
  getFeaturedProducts,
  getCategoryBySlug,
  formatPrice,
  getEstimatedDeliveryTime
} from './index';
