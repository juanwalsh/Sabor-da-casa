/**
 * Script para popular o Firestore com os produtos iniciais
 *
 * Como executar:
 * 1. cd restaurante
 * 2. node scripts/setup-firebase.js
 */

require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDocs } = require('firebase/firestore');

// Firebase Config via variaveis de ambiente
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
const estoqueCategoria = {
  'cat-1': 30,  // Pratos Principais
  'cat-2': 50,  // Marmitas
  'cat-3': 100, // Acompanhamentos
  'cat-4': 40,  // Sobremesas
  'cat-5': 80,  // Bebidas
};

// Emojis por categoria
const emojiCategoria = {
  'cat-1': '🍲',
  'cat-2': '🍱',
  'cat-3': '🍚',
  'cat-4': '🍮',
  'cat-5': '🥤',
};

// Categorias
const categorias = [
  { id: 'cat-1', nome: 'Pratos Principais', slug: 'pratos-principais', ordem: 1 },
  { id: 'cat-2', nome: 'Marmitas', slug: 'marmitas', ordem: 2 },
  { id: 'cat-3', nome: 'Acompanhamentos', slug: 'acompanhamentos', ordem: 3 },
  { id: 'cat-4', nome: 'Sobremesas', slug: 'sobremesas', ordem: 4 },
  { id: 'cat-5', nome: 'Bebidas', slug: 'bebidas', ordem: 5 },
];

// Produtos (todos os 23 do site)
const produtos = [
  // Pratos Principais (cat-1)
  { id: 'prod-1', nome: 'Feijoada Completa', descricao: 'Nossa tradicional feijoada com todas as carnes, acompanha arroz branco, couve refogada, farofa crocante e laranja.', preco: 45.90, imagem: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600', categoriaId: 'cat-1', ativo: true, destaque: true, tempoPreparo: 15, porcoes: 2 },
  { id: 'prod-2', nome: 'Frango Caipira com Quiabo', descricao: 'Frango caipira cozido lentamente com quiabo fresquinho, temperos da roca e muito sabor de fazenda.', preco: 38.90, imagem: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600', categoriaId: 'cat-1', ativo: true, destaque: true, tempoPreparo: 20, porcoes: 2 },
  { id: 'prod-3', nome: 'Escondidinho de Carne Seca', descricao: 'Pure de mandioca cremoso com carne seca desfiada, gratinado com queijo coalho.', preco: 42.90, imagem: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600', categoriaId: 'cat-1', ativo: true, destaque: true, tempoPreparo: 25, porcoes: 2 },
  { id: 'prod-4', nome: 'Carne de Panela da Vovo', descricao: 'Carne bovina cozida por horas em molho caseiro com batatas, cenouras e temperos especiais.', preco: 39.90, imagem: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', categoriaId: 'cat-1', ativo: true, destaque: false, tempoPreparo: 18, porcoes: 2 },
  { id: 'prod-5', nome: 'Peixe Grelhado com Legumes', descricao: 'File de tilapia grelhado acompanhado de legumes salteados e arroz integral.', preco: 44.90, imagem: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', categoriaId: 'cat-1', ativo: true, destaque: false, tempoPreparo: 20, porcoes: 1 },
  { id: 'prod-6', nome: 'Feijao Tropeiro Mineiro', descricao: 'Feijao com farinha de mandioca, linguica, bacon, ovos e couve. Receita tradicional de Minas.', preco: 36.90, imagem: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', categoriaId: 'cat-1', ativo: true, destaque: true, tempoPreparo: 15, porcoes: 2 },
];

async function popularFirestore() {
  console.log('🚀 Iniciando setup do Firebase...\n');

  try {
    const produtosRef = collection(db, 'produtos');
    const snapshot = await getDocs(produtosRef);

    if (!snapshot.empty) {
      console.log(\`⚠️  Ja existem \${snapshot.size} produtos no Firestore.\`);
      console.log('   Continuando mesmo assim (vai sobrescrever)...\n');
    }

    console.log('📁 Salvando categorias...');
    for (const cat of categorias) {
      await setDoc(doc(db, 'categorias', cat.id), {
        nome: cat.nome,
        slug: cat.slug,
        ordem: cat.ordem,
        ativo: true,
      });
      console.log(\`   ✅ \${cat.nome}\`);
    }

    console.log('\n🍽️  Salvando produtos...');
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
      console.log(\`   ✅ \${emoji} \${prod.nome} (estoque: \${estoque})\`);
    }

    console.log('\n⚙️  Salvando configuracoes...');
    await setDoc(doc(db, 'config', 'estoque_inicial'), estoqueCategoria);
    console.log('   ✅ Configuracoes salvas');

    console.log('\n✨ Firebase configurado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro ao configurar Firebase:', error.message);
    process.exit(1);
  }
}

popularFirestore();
