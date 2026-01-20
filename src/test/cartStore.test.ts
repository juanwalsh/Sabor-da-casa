import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Test Product',
  description: 'Test description',
  price: 25.00,
  image: '/test.jpg',
  categoryId: 'cat-1',
  active: true,
  featured: false,
  stock: 10,
};

const mockProduct2: Product = {
  id: 'prod-2',
  name: 'Test Product 2',
  description: 'Test description 2',
  price: 30.00,
  image: '/test2.jpg',
  categoryId: 'cat-1',
  active: true,
  featured: false,
  stock: 5,
};

describe('cartStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useCartStore.setState({
      items: [],
      isOpen: false,
      lastAddedProductId: null,
      isAnimating: false,
    });
  });

  describe('addItem', () => {
    it('should add a new item to cart', () => {
      const { addItem, items } = useCartStore.getState();
      addItem(mockProduct, 1);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].product.id).toBe('prod-1');
      expect(state.items[0].quantity).toBe(1);
    });

    it('should increment quantity if item already exists', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 1);
      addItem(mockProduct, 2);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
    });

    it('should respect stock limits', () => {
      const { addItem } = useCartStore.getState();
      const result = addItem(mockProduct, 15); // Stock is 10

      expect(result.success).toBe(true);
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(10); // Should cap at stock
    });

    it('should return error when stock is exhausted', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 10); // Use all stock
      const result = addItem(mockProduct, 1);

      expect(result.success).toBe(false);
      expect(result.message).toContain('maximo');
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockProduct, 1);
      removeItem('prod-1');

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it('should not affect other items', () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockProduct, 1);
      addItem(mockProduct2, 1);
      removeItem('prod-1');

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].product.id).toBe('prod-2');
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 1);
      updateQuantity('prod-1', 5);

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is 0', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 1);
      updateQuantity('prod-1', 0);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it('should respect stock limits', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockProduct, 1);
      const result = updateQuantity('prod-1', 15);

      expect(result.success).toBe(false);
      expect(result.message).toContain('maximo');
    });
  });

  describe('clearCart', () => {
    it('should remove all items', () => {
      const { addItem, clearCart } = useCartStore.getState();
      addItem(mockProduct, 1);
      addItem(mockProduct2, 1);
      clearCart();

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe('getSubtotal', () => {
    it('should calculate correct subtotal', () => {
      const { addItem, getSubtotal } = useCartStore.getState();
      addItem(mockProduct, 2); // 25 * 2 = 50
      addItem(mockProduct2, 1); // 30 * 1 = 30

      const subtotal = useCartStore.getState().getSubtotal();
      expect(subtotal).toBe(80);
    });

    it('should return 0 for empty cart', () => {
      const subtotal = useCartStore.getState().getSubtotal();
      expect(subtotal).toBe(0);
    });
  });

  describe('getDeliveryFee', () => {
    it('should return delivery fee for orders below minimum', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 1); // 25

      const fee = useCartStore.getState().getDeliveryFee();
      expect(fee).toBe(8);
    });

    it('should return 0 for orders at or above minimum', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 4); // 25 * 4 = 100 >= 80

      const fee = useCartStore.getState().getDeliveryFee();
      expect(fee).toBe(0);
    });
  });

  describe('getTotal', () => {
    it('should calculate total including delivery', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 1); // 25 + 8 delivery = 33

      const total = useCartStore.getState().getTotal();
      expect(total).toBe(33);
    });

    it('should not include delivery for orders above minimum', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 4); // 100, free delivery

      const total = useCartStore.getState().getTotal();
      expect(total).toBe(100);
    });
  });

  describe('getItemCount', () => {
    it('should return total quantity of items', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 2);
      addItem(mockProduct2, 3);

      const count = useCartStore.getState().getItemCount();
      expect(count).toBe(5);
    });
  });

  describe('cart visibility', () => {
    it('should toggle cart open/close', () => {
      const { toggleCart } = useCartStore.getState();
      expect(useCartStore.getState().isOpen).toBe(false);

      toggleCart();
      expect(useCartStore.getState().isOpen).toBe(true);

      toggleCart();
      expect(useCartStore.getState().isOpen).toBe(false);
    });

    it('should open cart', () => {
      const { openCart } = useCartStore.getState();
      openCart();
      expect(useCartStore.getState().isOpen).toBe(true);
    });

    it('should close cart', () => {
      const { openCart, closeCart } = useCartStore.getState();
      openCart();
      closeCart();
      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });
});
