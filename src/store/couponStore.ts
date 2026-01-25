import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Coupon {
  code: string;
  discount: number; // Percentual de desconto (0-100)
  minValue?: number; // Valor mínimo do pedido
  maxDiscount?: number; // Desconto máximo em reais
  validUntil?: string; // Data de validade
}

interface CouponState {
  appliedCoupon: Coupon | null;
  usedCoupons: string[];
  isValidating: boolean;
  applyCoupon: (code: string, orderTotal: number) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  calculateDiscount: (subtotal: number) => number;
  markCouponAsUsed: (code: string) => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      appliedCoupon: null,
      usedCoupons: [],
      isValidating: false,

      applyCoupon: async (code, orderTotal) => {
        const normalizedCode = code.toUpperCase().trim();

        // Verifica se ja foi usado localmente
        if (get().usedCoupons.includes(normalizedCode)) {
          return { success: false, message: 'Este cupom já foi utilizado' };
        }

        set({ isValidating: true });

        try {
          // Valida no servidor (cupons nao ficam mais expostos no cliente)
          const response = await fetch('/api/coupons/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: normalizedCode, orderTotal }),
          });

          const data = await response.json();

          if (!data.valid) {
            set({ isValidating: false });
            return { success: false, message: data.error || 'Cupom inválido' };
          }

          const coupon: Coupon = {
            code: data.code,
            discount: data.discount,
            maxDiscount: data.maxDiscount,
          };

          set({ appliedCoupon: coupon, isValidating: false });
          return { success: true, message: `Cupom ${coupon.discount}% aplicado!` };
        } catch (error) {
          set({ isValidating: false });
          return { success: false, message: 'Erro ao validar cupom. Tente novamente.' };
        }
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      calculateDiscount: (subtotal) => {
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;

        let discount = (subtotal * coupon.discount) / 100;
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
        return discount;
      },

      markCouponAsUsed: (code) => {
        set((state) => ({
          usedCoupons: [...state.usedCoupons, code.toUpperCase()],
          appliedCoupon: null,
        }));
      },
    }),
    {
      name: 'sabor-da-casa-coupons',
    }
  )
);
