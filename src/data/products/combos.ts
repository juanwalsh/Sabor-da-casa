import { Product } from '@/types';

export const combos: Product[] = [
  {
    id: 'prod-100',
    name: 'Combo Carnaval',
    description: 'Kit completo para a folia! Inclui 1 KRONE (licor), 1 BALY Energy Drink 2L, 1 Mansao Maromba Vodka Combo e 2 copos neon coloridos.',
    price: 150.00,
    image: '/uploads/combo-carnaval.png',
    categoryId: 'cat-4',
    active: true,
    featured: true,
    preparationTime: 5,
    serves: 4,
    tags: ['combo', 'carnaval', 'promocao'],
    stock: 20
  }
];
