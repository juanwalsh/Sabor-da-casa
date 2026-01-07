import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import { DELIVERY_FEE, FREE_DELIVERY_MIN } from '@/data/mockData';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  lastAddedProductId: string | null;
  isAnimating: boolean;

  // Actions
  addItem: (product: Product, quantity?: number, notes?: string) => { success: boolean; message?: string };
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  updateNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearAnimation: () => void;

  // Computed
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  getAvailableStock: (productId: string, productStock?: number) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAddedProductId: null,
      isAnimating: false,

      addItem: (product: Product, quantity = 1, notes?: string) => {
        const state = get();
        const existingItem = state.items.find(
          (item) => item.product.id === product.id
        );

        const maxStock = product.stock ?? 999; // Default alto se nao tiver estoque definido
        const currentQuantity = existingItem?.quantity ?? 0;
        const newQuantity = currentQuantity + quantity;

        // Verificar se ultrapassa o estoque
        if (newQuantity > maxStock) {
          const availableToAdd = maxStock - currentQuantity;
          if (availableToAdd <= 0) {
            return { success: false, message: `Estoque maximo (${maxStock}) ja atingido` };
          }
          // Adiciona apenas o que esta disponivel
          quantity = availableToAdd;
        }

        // Trigger animation
        setTimeout(() => {
          set({ isAnimating: true, lastAddedProductId: product.id });
          setTimeout(() => {
            set({ isAnimating: false, lastAddedProductId: null });
          }, 600);
        }, 0);

        if (existingItem) {
          set({
            items: state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
                : item
            ),
          });
        } else {
          set({
            items: [...state.items, { product, quantity, notes }],
          });
        }

        return { success: true };
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return { success: true };
        }

        const state = get();
        const item = state.items.find((i) => i.product.id === productId);
        if (!item) return { success: false, message: 'Produto nao encontrado' };

        const maxStock = item.product.stock ?? 999;

        // Verificar se ultrapassa o estoque
        if (quantity > maxStock) {
          return { success: false, message: `Estoque maximo: ${maxStock} unidades` };
        }

        set({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });

        return { success: true };
      },

      updateNotes: (productId: string, notes: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, notes } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      clearAnimation: () => {
        set({ isAnimating: false, lastAddedProductId: null });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getDeliveryFee();
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getAvailableStock: (productId: string, productStock?: number) => {
        const state = get();
        const item = state.items.find((i) => i.product.id === productId);
        const currentQuantity = item?.quantity ?? 0;
        const maxStock = productStock ?? item?.product.stock ?? 999;
        return Math.max(0, maxStock - currentQuantity);
      },
    }),
    {
      name: 'sabor-da-casa-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
