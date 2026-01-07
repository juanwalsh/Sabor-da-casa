import { create } from 'zustand';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  increment,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CartItem } from '@/types';

export interface PedidoItem {
  produtoId: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  precoTotal: number;
}

export interface PedidoCliente {
  nome?: string;
  telefone?: string;
  email?: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    cep: string;
  };
}

export interface Pedido {
  id?: string;
  cliente: PedidoCliente;
  itens: PedidoItem[];
  subtotal: number;
  taxaEntrega: number;
  desconto: number;
  total: number;
  status: 'pendente' | 'confirmado' | 'preparando' | 'saiu_entrega' | 'entregue' | 'cancelado';
  formaPagamento: string;
  observacoes?: string;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

interface FirestoreState {
  isSubmitting: boolean;
  lastOrderId: string | null;
  error: string | null;

  // Acoes
  criarPedido: (pedido: Record<string, unknown>, cartItems: CartItem[]) => Promise<string | null>;
  atualizarEstoque: (produtoId: string, quantidade: number) => Promise<boolean>;
  verificarEstoque: (cartItems: CartItem[]) => Promise<{ ok: boolean; produtoSemEstoque?: string }>;
}

export const useFirestoreStore = create<FirestoreState>((set) => ({
  isSubmitting: false,
  lastOrderId: null,
  error: null,

  // Criar pedido no Firestore (sem transacao complexa para evitar travamento)
  criarPedido: async (pedido, cartItems) => {
    set({ isSubmitting: true, error: null });

    try {
      // Criar o pedido diretamente no Firestore
      // Nao usamos transacao porque produtos podem nao existir no Firestore (dados mock)
      const pedidosRef = collection(db, 'pedidos');
      const docRef = await addDoc(pedidosRef, {
        ...pedido,
        status: 'pendente',
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
      });

      // Tentar debitar estoque de produtos que existem no Firestore (opcional, nao bloqueia)
      try {
        for (const item of cartItems) {
          const produtoRef = doc(db, 'produtos', item.product.id);
          const produtoDoc = await getDoc(produtoRef);

          if (produtoDoc.exists()) {
            const data = produtoDoc.data();
            const estoque = data?.estoque;

            // So debita se tem controle de estoque ativo (estoque > 0)
            if (estoque !== undefined && estoque !== null && estoque > 0) {
              await updateDoc(produtoRef, {
                estoque: increment(-item.quantity),
                atualizadoEm: serverTimestamp(),
              });
            }
          }
        }
      } catch (stockError) {
        // Erro ao debitar estoque nao deve bloquear o pedido
        console.warn('Aviso: Nao foi possivel debitar estoque:', stockError);
      }

      set({ isSubmitting: false, lastOrderId: docRef.id });
      return docRef.id;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar pedido';
      set({ isSubmitting: false, error: errorMessage });
      console.error('Erro ao criar pedido:', error);
      return null;
    }
  },

  // Atualizar estoque de um produto
  atualizarEstoque: async (produtoId, quantidade) => {
    try {
      const produtoRef = doc(db, 'produtos', produtoId);
      await updateDoc(produtoRef, {
        estoque: increment(quantidade),
        atualizadoEm: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      return false;
    }
  },

  // Verificar se todos os itens tem estoque disponivel
  // Estoque 0, undefined ou null = sem controle de estoque (infinito)
  verificarEstoque: async (cartItems) => {
    try {
      for (const item of cartItems) {
        const produtoRef = doc(db, 'produtos', item.product.id);
        const produtoDoc = await getDoc(produtoRef);

        // Se produto nao existe no Firebase, permite (usa dados locais)
        if (!produtoDoc.exists()) {
          continue;
        }

        const data = produtoDoc.data();
        const estoque = data?.estoque;

        // Se estoque e undefined, null ou 0, significa sem controle = infinito
        if (estoque === undefined || estoque === null || estoque === 0) {
          continue;
        }

        // So verifica se estoque > 0 (tem controle ativo)
        if (estoque > 0 && estoque < item.quantity) {
          return { ok: false, produtoSemEstoque: item.product.name };
        }
      }
      return { ok: true };
    } catch (error) {
      console.error('Erro ao verificar estoque:', error);
      // Em caso de erro, permite o pedido para nao bloquear vendas
      return { ok: true };
    }
  },
}));

// Funcao helper para formatar itens do carrinho para o pedido
export function formatCartItemsForOrder(cartItems: CartItem[]): PedidoItem[] {
  return cartItems.map((item) => ({
    produtoId: item.product.id,
    nome: item.product.name,
    quantidade: item.quantity,
    precoUnitario: item.product.price,
    precoTotal: item.product.price * item.quantity,
  }));
}
