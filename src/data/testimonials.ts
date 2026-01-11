import { Testimonial } from '@/types';

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Maria Helena',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    comment: 'O torresmo com mandioca e simplesmente incrivel! Melhor petisco da cidade.',
    date: new Date('2024-12-20')
  },
  {
    id: 'test-2',
    name: 'Joao Carlos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
    comment: 'Jantinha completa por R$29,90? Preco justo e porcoes generosas!',
    date: new Date('2024-12-18')
  },
  {
    id: 'test-3',
    name: 'Ana Paula',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    comment: 'As caipirinhas sao as melhores! Virei cliente fiel.',
    date: new Date('2024-12-15')
  }
];
