'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { products as initialProducts } from '@/data/mockData';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega produtos da API (inicializa automaticamente se necessario)
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();

      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError('Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cria novo produto
  const createProduct = useCallback(async (product: Omit<Product, 'id'>): Promise<Product | null> => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (data.success) {
        setProducts(prev => [data.product, ...prev]);
        return data.product;
      }
      return null;
    } catch (err) {
      console.error('Erro ao criar produto:', err);
      return null;
    }
  }, []);

  // Atualiza produto
  const updateProduct = useCallback(async (product: Product): Promise<boolean> => {
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (data.success) {
        setProducts(prev => prev.map(p => p.id === product.id ? data.product : p));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      return false;
    }
  }, []);

  // Deleta produto
  const deleteProduct = useCallback(async (productId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      return false;
    }
  }, []);

  // Toggle active
  const toggleActive = useCallback(async (productId: string): Promise<boolean> => {
    const product = products.find(p => p.id === productId);
    if (!product) return false;

    return updateProduct({ ...product, active: !product.active });
  }, [products, updateProduct]);

  // Toggle featured
  const toggleFeatured = useCallback(async (productId: string): Promise<boolean> => {
    const product = products.find(p => p.id === productId);
    if (!product) return false;

    return updateProduct({ ...product, featured: !product.featured });
  }, [products, updateProduct]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleActive,
    toggleFeatured,
  };
}
