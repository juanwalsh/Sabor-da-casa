/**
 * Script para popular o Firestore com os produtos iniciais
 * Execute com: npx ts-node scripts/populateFirestore.ts
 */

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';

// Configuracao Firebase via variaveis de ambiente
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Estoque por categoria
const estoqueCategoria: Record<string, number> = {
  'cat-1': 30,
  'cat-5': 80,
};

// Emojis por categoria
const emojiCategoria: Record<string, string> = {
  'cat-1': '🍲',
  'cat-5': '🥤',
};

// Categorias
const categorias = [
  { id: 'cat-1', nome: 'Pratos Principais', slug: 'pratos-principais', ordem: 1 },
  { id: 'cat-5', nome: 'Bebidas', slug: 'bebidas', ordem: 2 },
];

// Produtos
const produtos = [
  { id: 'prod-1', nome: 'Feijoada Completa', descricao: 'Tradicional feijoada com carnes selecionadas.', preco: 45.90, imagem: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600', categoriaId: 'cat-1', ativo: true, destaque: true, tempoPreparo: 15, porcoes: 2 },
  { id: 'prod-2', nome: 'Picanha Grelhada', descricao: 'Picanha grelhada no ponto.', preco: 59.90, imagem: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600', categoriaId: 'cat-1', ativo: true, destaque: true, tempoPreparo: 20, porcoes: 2 },
  { id: 'prod-10', nome: 'Coca-Cola Lata 350ml', descricao: 'Refrigerante Coca-Cola original gelado.', preco: 6.00, imagem: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600', categoriaId: 'cat-5', ativo: true, destaque: false, tempoPreparo: 1, porcoes: 1 },
];

async function popularFirestore() {
  console.log('🚀 Iniciando populacao do Firestore...\n');

  const produtosRef = collection(db, 'produtos');
  const snapshot = await getDocs(produtosRef);

  if (!snapshot.empty) {
    console.log('⚠️  Ja existem produtos no Firestore. Sobrescrevendo...');
  }

  console.log('📁 Populando categorias...');
  for (const cat of categorias) {
    await setDoc(doc(db, 'categorias', cat.id), {
      nome: cat.nome,
      slug: cat.slug,
      ordem: cat.ordem,
      ativo: true,
    });
    console.log(`   ✅ ${cat.nome}`);
  }

  console.log('\n🍽️  Populando produtos...');
  for (const prod of produtos) {
    const estoque = estoqueCategoria[prod.categoriaId] || 50;
    const emoji = emojiCategoria[prod.categoriaId] || '🍽️';

    await setDoc(doc(db, 'produtos', prod.id), {
      ...prod,
      estoque,
      emoji,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    });
    console.log(`   ✅ ${emoji} ${prod.nome}`);
  }

  console.log('\n✨ Firestore populado com sucesso!');
  process.exit(0);
}

popularFirestore().catch((error) => {
  console.error('❌ Erro ao popular Firestore:', error);
  process.exit(1);
});
