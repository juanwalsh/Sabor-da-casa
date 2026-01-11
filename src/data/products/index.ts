import { Product } from '@/types';
import { porcoes } from './porcoes';
import { pratos } from './pratos';
import { bebidas } from './bebidas';
import { combos } from './combos';

// Exporta todos os produtos juntos
export const products: Product[] = [
  ...porcoes,
  ...pratos,
  ...bebidas,
  ...combos
];

// Re-exporta os arrays individuais para uso direto
export { porcoes, pratos, bebidas, combos };
