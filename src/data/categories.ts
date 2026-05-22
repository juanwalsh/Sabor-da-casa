import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'cat-proteinas',
    name: 'Proteínas',
    slug: 'proteinas',
    description: 'As carnes que fazem a alma do prato — feitas no fogão de casa',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    order: 1,
    active: true
  },
  {
    id: 'cat-carboidratos',
    name: 'Arroz e Carboidratos',
    slug: 'arroz-carboidratos',
    description: 'A base do prato brasileiro — arroz branco, feijão, macarrão e mais',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
    order: 2,
    active: true
  },
  {
    id: 'cat-saladas',
    name: 'Saladas e Cruas',
    slug: 'saladas',
    description: 'Sempre fresquinhas, lavadas e cortadas no dia',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    order: 3,
    active: true
  },
  {
    id: 'cat-guarnicoes',
    name: 'Guarnições',
    slug: 'guarnicoes',
    description: 'Os clássicos do prato feito — farofa, vinagrete, batata, ovo',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    order: 4,
    active: true
  }
];
