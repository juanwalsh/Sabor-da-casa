import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Porcoes e Petiscos',
    slug: 'porcoes-petiscos',
    description: 'Porcoes deliciosas para compartilhar com os amigos',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20aed44dff?w=400',
    order: 1,
    active: true
  },
  {
    id: 'cat-2',
    name: 'Prato Executivo',
    slug: 'prato-executivo',
    description: 'Jantinha completa com arroz, feijao, farofa, vinagrete e especial da casa',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    order: 2,
    active: true
  },
  {
    id: 'cat-3',
    name: 'Bebidas e Drinks',
    slug: 'bebidas-drinks',
    description: 'Bebidas refrescantes e drinks especiais',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    order: 3,
    active: true
  },
  {
    id: 'cat-4',
    name: 'Combos',
    slug: 'combos',
    description: 'Combos especiais com precos imperdíveis',
    image: '/uploads/combo-carnaval.png',
    order: 4,
    active: true
  }
];
