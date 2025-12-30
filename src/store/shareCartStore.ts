import { create } from 'zustand';
import { CartItem } from '@/types';

interface SharedCart {
  id: string;
  items: CartItem[];
  createdBy: string;
  createdAt: string;
  expiresAt: string;
}

interface ShareCartState {
  sharedCartId: string | null;
  isSharedCart: boolean;
  sharedCartOwner: string | null;
  generateShareLink: (items: CartItem[], ownerName: string) => string;
  loadSharedCart: (shareId: string) => SharedCart | null;
  clearSharedCart: () => void;
}

// Simula um "banco de dados" local para carrinhos compartilhados
// Em produção, isso seria um backend real
const sharedCartsStorage: Map<string, SharedCart> = new Map();

function generateShareId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export const useShareCartStore = create<ShareCartState>()((set, get) => ({
  sharedCartId: null,
  isSharedCart: false,
  sharedCartOwner: null,

  generateShareLink: (items: CartItem[], ownerName: string) => {
    const shareId = generateShareId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas

    const sharedCart: SharedCart = {
      id: shareId,
      items,
      createdBy: ownerName,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    // Salvar no localStorage para persistência
    const stored = localStorage.getItem('sabor-da-casa-shared-carts');
    const carts = stored ? JSON.parse(stored) : {};
    carts[shareId] = sharedCart;
    localStorage.setItem('sabor-da-casa-shared-carts', JSON.stringify(carts));

    sharedCartsStorage.set(shareId, sharedCart);

    set({ sharedCartId: shareId });

    // Retornar URL completa
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/cardapio?cart=${shareId}`;
  },

  loadSharedCart: (shareId: string) => {
    // Tentar carregar do localStorage
    const stored = localStorage.getItem('sabor-da-casa-shared-carts');
    if (stored) {
      const carts = JSON.parse(stored);
      const cart = carts[shareId];

      if (cart) {
        // Verificar se não expirou
        if (new Date(cart.expiresAt) > new Date()) {
          set({
            isSharedCart: true,
            sharedCartOwner: cart.createdBy,
            sharedCartId: shareId,
          });
          return cart;
        }
      }
    }

    return null;
  },

  clearSharedCart: () => {
    set({
      sharedCartId: null,
      isSharedCart: false,
      sharedCartOwner: null,
    });
  },
}));
