import { Testimonial } from '@/types';

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Maria Helena',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    comment: 'Comida com gosto de casa de vó. A feijoada de quarta é minha tradição.',
    date: new Date('2026-04-20'),
  },
  {
    id: 'test-2',
    name: 'João Carlos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
    comment: 'Almoço por R$ 28 com prato cheio e a comida bem feita? Imbatível na região.',
    date: new Date('2026-04-18'),
  },
  {
    id: 'test-3',
    name: 'Ana Paula',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    comment: 'Adoro poder montar do meu jeito — mais salada, menos arroz. Atende todo gosto.',
    date: new Date('2026-04-15'),
  },
];
