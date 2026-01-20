import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Recreate schemas for testing (same as in API routes)
const productSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio'),
  description: z.string().min(1, 'Descricao obrigatoria'),
  price: z.coerce.number().positive('Preco deve ser positivo'),
  image: z.string().url('URL de imagem invalida'),
  categoryId: z.string().min(1, 'Categoria obrigatoria'),
  active: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  stock: z.coerce.number().int().nonnegative('Estoque invalido').default(100),
});

const orderItemSchema = z.object({
  product: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    image: z.string(),
  }),
  quantity: z.number().int().positive(),
  observation: z.string().optional(),
});

const createOrderSchema = z.object({
  customerName: z.string().min(1, 'Nome do cliente obrigatorio'),
  customerPhone: z.string().min(10, 'Telefone invalido'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  address: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    complement: z.string().optional(),
    neighborhood: z.string().min(1),
    city: z.string().min(1),
    zipCode: z.string().min(8),
  }),
  items: z.array(orderItemSchema).min(1, 'Pedido deve ter pelo menos 1 item'),
  subtotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative(),
  total: z.number().nonnegative(),
  paymentMethod: z.enum(['pix', 'credit_card', 'debit_card', 'cash']),
});

describe('Product Schema', () => {
  it('should validate a valid product', () => {
    const validProduct = {
      name: 'Test Product',
      description: 'Test description',
      price: 25.00,
      image: 'https://example.com/image.jpg',
      categoryId: 'cat-1',
    };

    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it('should reject empty name', () => {
    const invalidProduct = {
      name: '',
      description: 'Test',
      price: 25,
      image: 'https://example.com/image.jpg',
      categoryId: 'cat-1',
    };

    const result = productSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });

  it('should reject negative price', () => {
    const invalidProduct = {
      name: 'Test',
      description: 'Test',
      price: -10,
      image: 'https://example.com/image.jpg',
      categoryId: 'cat-1',
    };

    const result = productSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });

  it('should reject invalid image URL', () => {
    const invalidProduct = {
      name: 'Test',
      description: 'Test',
      price: 25,
      image: 'not-a-url',
      categoryId: 'cat-1',
    };

    const result = productSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });

  it('should coerce string price to number', () => {
    const product = {
      name: 'Test',
      description: 'Test',
      price: '25.50',
      image: 'https://example.com/image.jpg',
      categoryId: 'cat-1',
    };

    const result = productSchema.safeParse(product);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(25.5);
    }
  });

  it('should apply default values', () => {
    const product = {
      name: 'Test',
      description: 'Test',
      price: 25,
      image: 'https://example.com/image.jpg',
      categoryId: 'cat-1',
    };

    const result = productSchema.safeParse(product);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.active).toBe(true);
      expect(result.data.featured).toBe(false);
      expect(result.data.stock).toBe(100);
    }
  });
});

describe('Order Schema', () => {
  const validOrder = {
    customerName: 'John Doe',
    customerPhone: '11999999999',
    address: {
      street: 'Rua Test',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      zipCode: '01234567',
    },
    items: [{
      product: {
        id: 'prod-1',
        name: 'Test Product',
        price: 25,
        image: 'https://example.com/image.jpg',
      },
      quantity: 2,
    }],
    subtotal: 50,
    deliveryFee: 8,
    total: 58,
    paymentMethod: 'pix' as const,
  };

  it('should validate a valid order', () => {
    const result = createOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('should reject order without items', () => {
    const invalidOrder = {
      ...validOrder,
      items: [],
    };

    const result = createOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
  });

  it('should reject short phone number', () => {
    const invalidOrder = {
      ...validOrder,
      customerPhone: '123456789',
    };

    const result = createOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
  });

  it('should reject invalid payment method', () => {
    const invalidOrder = {
      ...validOrder,
      paymentMethod: 'bitcoin',
    };

    const result = createOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
  });

  it('should accept optional email', () => {
    const orderWithEmail = {
      ...validOrder,
      customerEmail: 'test@example.com',
    };

    const result = createOrderSchema.safeParse(orderWithEmail);
    expect(result.success).toBe(true);
  });

  it('should accept empty string for email', () => {
    const orderWithEmptyEmail = {
      ...validOrder,
      customerEmail: '',
    };

    const result = createOrderSchema.safeParse(orderWithEmptyEmail);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const invalidOrder = {
      ...validOrder,
      customerEmail: 'not-an-email',
    };

    const result = createOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
  });

  it('should reject negative quantity', () => {
    const invalidOrder = {
      ...validOrder,
      items: [{
        ...validOrder.items[0],
        quantity: -1,
      }],
    };

    const result = createOrderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
  });
});
