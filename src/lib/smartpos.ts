import { db } from './firebase';
import { collection, getDocs, query, where, doc, setDoc, getDoc } from 'firebase/firestore';

const SMARTPOS_API_URL = 'https://api.smartpos.app/v1';
const SMARTPOS_API_KEY_SECRET = process.env.SMARTPOS_API_KEY_SECRET;

// Interface para Produto do SmartPOS
export interface SmartPOSProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  // Adicione outros campos conforme a resposta da API
  active?: boolean;
  category?: string;
}

export interface StockUpdateParams {
  productId: number;
  quantity: number;
  stockOperation: 'REMOVE' | 'ADD' | 'SET';
}

export interface ProductMapping {
  siteProductId: string;
  smartposProductId: number;
  productName: string;
}

/**
 * Busca todos os produtos do SmartPOS
 * Nota: Parece que o X-Api-Key-Id é necessário para algumas chamadas,
 * mas vamos tentar listar primeiro apenas com o Secret se possível,
 * ou o endpoint de produtos é aberto com o Secret.
 */
export async function getSmartPOSProducts(): Promise<SmartPOSProduct[]> {
  if (!SMARTPOS_API_KEY_SECRET) {
    console.error('SMARTPOS_API_KEY_SECRET não configurado');
    return [];
  }

  try {
    const response = await fetch(`${SMARTPOS_API_URL}/products?page=1&size=100`, {
      method: 'GET',
      headers: {
        'X-Api-Key-Secret': SMARTPOS_API_KEY_SECRET,
        // 'X-Api-Key-Id': '???' // Se necessário, teremos que descobrir como obter
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ao buscar produtos SmartPOS: ${response.status} - ${errorText}`);
      throw new Error(`SmartPOS API Error: ${response.status}`);
    }

    const data = await response.json();
    // Ajustar conforme estrutura real da resposta (pode ser data.content, data.items, etc.)
    // Assumindo que retorna um array ou objeto com lista
    return Array.isArray(data) ? data : (data.content || data.items || []);
  } catch (error) {
    console.error('Erro na integração SmartPOS:', error);
    return [];
  }
}

/**
 * Atualiza o estoque de um produto no SmartPOS
 */
export async function updateSmartPOSStock(params: StockUpdateParams): Promise<boolean> {
  if (!SMARTPOS_API_KEY_SECRET) return false;

  try {
    // Para atualizar, precisamos do ID da chave? 
    // O MD diz: "X-Api-Key-Id: [será obtido listando produtos]"
    // Vamos assumir que precisamos passar o Secret.
    
    const response = await fetch(`${SMARTPOS_API_URL}/products/stock/${params.productId}`, {
      method: 'PUT',
      headers: {
        'X-Api-Key-Secret': SMARTPOS_API_KEY_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: params.productId,
        quantity: params.quantity,
        stockOperation: params.stockOperation
      })
    });

    if (!response.ok) {
      console.error(`Erro ao atualizar estoque SmartPOS: ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    return false;
  }
}

/**
 * Busca o mapeamento de um produto do site para o SmartPOS
 */
export async function getProductMapping(siteProductId: string): Promise<ProductMapping | null> {
  try {
    const mappingsRef = collection(db, 'product_mappings');
    const q = query(mappingsRef, where('siteProductId', '==', siteProductId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docData = snapshot.docs[0].data();
    return {
      siteProductId: docData.siteProductId,
      smartposProductId: docData.smartposProductId,
      productName: docData.productName
    };
  } catch (error) {
    console.error('Erro ao buscar mapeamento:', error);
    return null;
  }
}

/**
 * Salva um mapeamento
 */
export async function saveProductMapping(mapping: ProductMapping): Promise<boolean> {
  try {
    // Usar o siteProductId como ID do documento para facilitar busca e evitar duplicatas
    await setDoc(doc(db, 'product_mappings', mapping.siteProductId), mapping);
    return true;
  } catch (error) {
    console.error('Erro ao salvar mapeamento:', error);
    return false;
  }
}

/**
 * Busca todos os mapeamentos
 */
export async function getAllMappings(): Promise<ProductMapping[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'product_mappings'));
    return querySnapshot.docs.map(doc => doc.data() as ProductMapping);
  } catch (error) {
    console.error('Erro ao buscar todos os mapeamentos:', error);
    return [];
  }
}

