import { create } from 'zustand';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  increment,
  serverTimestamp,
  getDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CartItem, Order } from '@/types';

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
  orders: Order[]; // Lista de pedidos do admin
  isSubmitting: boolean;
  isLoadingOrders: boolean;
  lastOrderId: string | null;
  error: string | null;

  // Acoes
  fetchOrders: () => Promise<void>;
  criarPedido: (pedido: Record<string, unknown>, cartItems: CartItem[]) => Promise<string | null>;
  atualizarEstoque: (produtoId: string, quantidade: number) => Promise<boolean>;
  verificarEstoque: (cartItems: CartItem[]) => Promise<{ ok: boolean; produtoSemEstoque?: string }>;
}

export const useFirestoreStore = create<FirestoreState>((set) => ({
  orders: [],
  isSubmitting: false,
  isLoadingOrders: false,
  lastOrderId: null,
  error: null,

  fetchOrders: async () => {
    set({ isLoadingOrders: true });
    try {
      // Busca da colecao 'orders' (novo padrao)
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const orders = snapshot.docs.map(doc => {
        const data = doc.data();
        // Mapear dados do Firestore para o tipo Order
        return {
          id: doc.id,
          ...data,
          // Converter timestamps strings para Date objects se necessario
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
          estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : undefined,
        } as unknown as Order;
      });

      set({ orders, isLoadingOrders: false });
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      set({ error: 'Erro ao carregar pedidos', isLoadingOrders: false });
    }
  },

  // Criar pedido no Firestore (sem transacao complexa para evitar travamento)
  criarPedido: async (pedido, cartItems) => {
    set({ isSubmitting: true, error: null });

    try {
      // Usar a colecao 'orders' padrao agora
      const pedidosRef = collection(db, 'orders');
      
      // Ajustar dados para formato final
      const orderData = {
        ...pedido,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(pedidosRef, orderData);

      // Tentar debitar estoque de produtos que existem no Firestore (opcional, nao bloqueia)
      try {
        for (const item of cartItems) {
          const produtoRef = doc(db, 'products', item.product.id);
          const produtoDoc = await getDoc(produtoRef);

          if (produtoDoc.exists()) {
            const data = produtoDoc.data();
            const estoque = data?.stock; // Campo stock no novo padrao

            // So debita se tem controle de estoque ativo (estoque > 0)
            if (estoque !== undefined && estoque !== null && estoque > 0) {
              await updateDoc(produtoRef, {
                stock: increment(-item.quantity),
              });
            }
          }
        }
      } catch (stockError) {
        // Erro ao debitar estoque nao deve bloquear o pedido
        console.warn('Aviso: Nao foi possivel debitar estoque:', stockError);
      }

      set({ isSubmitting: false, lastOrderId: docRef.id });
      // Atualizar lista local
      // get().fetchOrders(); // Opcional: atualizar lista imediatamente
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
      const produtoRef = doc(db, 'products', produtoId);
      await updateDoc(produtoRef, {
        stock: increment(quantidade),
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
        const produtoRef = doc(db, 'products', item.product.id);
        const produtoDoc = await getDoc(produtoRef);

        // Se produto nao existe no Firebase, permite (usa dados locais)
        if (!produtoDoc.exists()) {
          continue;
        }

        const data = produtoDoc.data();
        const estoque = data?.stock;

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
