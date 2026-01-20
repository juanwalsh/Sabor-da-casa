import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatPrice,
  getEstimatedDeliveryTime,
  DELIVERY_FEE,
  FREE_DELIVERY_MIN,
} from '@/data/constants';

describe('formatPrice', () => {
  it('should format price in BRL', () => {
    expect(formatPrice(10)).toBe('R$\u00A010,00');
  });

  it('should format decimal prices', () => {
    expect(formatPrice(25.5)).toBe('R$\u00A025,50');
  });

  it('should format zero', () => {
    expect(formatPrice(0)).toBe('R$\u00A00,00');
  });

  it('should format large numbers with thousands separator', () => {
    const result = formatPrice(1000);
    expect(result).toContain('1.000');
  });
});

describe('getEstimatedDeliveryTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return base time during off-peak hours', () => {
    vi.setSystemTime(new Date('2024-01-15T10:00:00'));
    const result = getEstimatedDeliveryTime();
    expect(result.min).toBe(25);
    expect(result.max).toBe(40);
    expect(result.formatted).toBe('25-40 min');
  });

  it('should return extended time during lunch peak', () => {
    vi.setSystemTime(new Date('2024-01-15T12:30:00'));
    const result = getEstimatedDeliveryTime();
    expect(result.min).toBe(40);
    expect(result.max).toBe(55);
    expect(result.formatted).toBe('40-55 min');
  });

  it('should return extended time during dinner peak', () => {
    vi.setSystemTime(new Date('2024-01-15T20:00:00'));
    const result = getEstimatedDeliveryTime();
    expect(result.min).toBe(40);
    expect(result.max).toBe(55);
  });

  it('should return base time late at night', () => {
    vi.setSystemTime(new Date('2024-01-15T23:00:00'));
    const result = getEstimatedDeliveryTime();
    expect(result.min).toBe(25);
    expect(result.max).toBe(40);
  });
});

describe('Constants', () => {
  it('should have correct delivery fee', () => {
    expect(DELIVERY_FEE).toBe(8.00);
  });

  it('should have correct free delivery minimum', () => {
    expect(FREE_DELIVERY_MIN).toBe(80.00);
  });
});
