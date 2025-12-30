import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Coupon {
  code: string;
  discount: number; // Percentual de desconto (0-100)
  minValue?: number; // Valor mínimo do pedido
  maxDiscount?: number; // Desconto máximo em reais
  validUntil?: string; // Data de validade
}

// Cupons disponíveis (em produção viria de uma API)
const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'BEMVINDO10', discount: 10, minValue: 50 },
  { code: 'SABOR15', discount: 15, minValue: 80, maxDiscount: 20 },
  { code: 'FRETE0', discount: 100, maxDiscount: 8 }, // Frete grátis
];

interface CouponState {
  appliedCoupon: Coupon | null;
  usedCoupons: string[];
  applyCoupon: (code: string, orderTotal: number) => { success: boolean; message: string };
  removeCoupon: () => void;
  calculateDiscount: (subtotal: number) => number;
  markCouponAsUsed: (code: string) => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      appliedCoupon: null,
      usedCoupons: [],

      applyCoupon: (code, orderTotal) => {
        const normalizedCode = code.toUpperCase().trim();
        const coupon = AVAILABLE_COUPONS.find((c) => c.code === normalizedCode);

        if (!coupon) {
          return { success: false, message: 'Cupom inválido' };
        }

        if (get().usedCoupons.includes(normalizedCode)) {
          return { success: false, message: 'Este cupom já foi utilizado' };
        }

        if (coupon.minValue && orderTotal < coupon.minValue) {
          return {
            success: false,
            message: `Pedido mínimo de R$ ${coupon.minValue.toFixed(2)} para este cupom`,
          };
        }

        if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
          return { success: false, message: 'Cupom expirado' };
        }

        set({ appliedCoupon: coupon });
        return { success: true, message: `Cupom ${coupon.discount}% aplicado!` };
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
