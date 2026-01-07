'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, Category } from '@/types';

export interface FirestoreProduct {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoriaId: string;
  ativo: boolean;
  destaque: boolean;
  estoque: number;
  emoji: string;
  tempoPreparo: number;
  porcoes: number;
}

export interface FirestoreCategory {
  id: string;
  nome: string;
  slug: string;
  ordem: number;
  ativo: boolean;
}

// Converte produto do Firestore para o formato do site
function convertToProduct(firestoreProduct: FirestoreProduct): Product {
  return {
    id: firestoreProduct.id,
    name: firestoreProduct.nome,
    description: firestoreProduct.descricao,
    price: firestoreProduct.preco,
    image: firestoreProduct.imagem,
    categoryId: firestoreProduct.categoriaId,
    active: firestoreProduct.ativo,
    featured: firestoreProduct.destaque,
    preparationTime: firestoreProduct.tempoPreparo,
    serves: firestoreProduct.porcoes,
    // Campos extras do Firestore
    stock: firestoreProduct.estoque,
    emoji: firestoreProduct.emoji,
  };
}

// Converte categoria do Firestore para o formato do site
function convertToCategory(firestoreCategory: FirestoreCategory): Category {
  return {
    id: firestoreCategory.id,
    name: firestoreCategory.nome,
    slug: firestoreCategory.slug,
    description: '',
    image: '',
    order: firestoreCategory.ordem,
    active: firestoreCategory.ativo,
  };
}

// Hook para carregar produtos em tempo real
export function useFirestoreProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const produtosRef = collection(db, 'produtos');
    const q = query(produtosRef, where('ativo', '==', true));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const produtosData: Product[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as Omit<FirestoreProduct, 'id'>;
          produtosData.push(convertToProduct({ id: doc.id, ...data }));
        });
        setProducts(produtosData);
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao carregar produtos:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { products, loading, error };
}

// Hook para carregar categorias em tempo real
export function useFirestoreCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const categoriasRef = collection(db, 'categorias');
    const q = query(categoriasRef, where('ativo', '==', true), orderBy('ordem'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const categoriasData: Category[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as Omit<FirestoreCategory, 'id'>;
          categoriasData.push(convertToCategory({ id: doc.id, ...data }));
        });
        setCategories(categoriasData);
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao carregar categorias:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { categories, loading, error };
}

// Hook combinado para produtos e categorias
export function useFirestoreMenu() {
  const { products, loading: productsLoading, error: productsError } = useFirestoreProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useFirestoreCategories();

  return {
    products,
    categories,
    loading: productsLoading || categoriesLoading,
    error: productsError || categoriesError,
  };
}

// Hook para verificar estoque de um produto
export function useProductStock(productId: string) {
  const [stock, setStock] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const produtoRef = collection(db, 'produtos');
    const q = query(produtoRef, where('__name__', '==', productId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setStock(data.estoque || 0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId]);

  return { stock, loading };
}
