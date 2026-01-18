import useSWR from 'swr';
import { Product } from '@/types';
import { toast } from 'sonner';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Falha ao carregar produtos');
  const data = await res.json();
  return data;
};

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR('/api/products', fetcher);

  const createProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      if (!res.ok) throw new Error('Erro ao criar produto');
      
      await mutate(); // Revalida a lista
      toast.success('Produto criado com sucesso');
      return true;
    } catch (err) {
      toast.error('Erro ao criar produto');
      return false;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...productData }),
      });

      if (!res.ok) throw new Error('Erro ao atualizar produto');

      await mutate();
      toast.success('Produto atualizado com sucesso');
      return true;
    } catch (err) {
      toast.error('Erro ao atualizar produto');
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erro ao remover produto');

      await mutate();
      toast.success('Produto removido com sucesso');
      return true;
    } catch (err) {
      toast.error('Erro ao remover produto');
      return false;
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    return updateProduct(id, { active });
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    return updateProduct(id, { featured });
  };

  return {
    products: (data?.products as Product[]) || [],
    isLoading,
    isError: error,
    mutate,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleActive,
    toggleFeatured,
  };
}