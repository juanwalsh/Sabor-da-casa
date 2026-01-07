/**
 * Script de teste para verificar a integracao Firebase
 */

require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  orderBy,
  limit
} = require('firebase/firestore');

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

async function testarIntegracao() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TESTE DE INTEGRACAO FIREBASE');
  console.log('='.repeat(60) + '\n');

  let passedTests = 0;
  let failedTests = 0;

  // TESTE 1: Ler produtos
  console.log('📦 TESTE 1: Leitura de produtos...');
  try {
    const produtosRef = collection(db, 'produtos');
    const snapshot = await getDocs(produtosRef);

    if (snapshot.empty) {
      throw new Error('Nenhum produto encontrado');
    }

    console.log(\`   ✅ \${snapshot.size} produtos encontrados\`);
    passedTests++;
  } catch (error) {
    console.log(\`   ❌ FALHOU: \${error.message}\n\`);
    failedTests++;
  }

  // TESTE 2: Verificar categorias
  console.log('📁 TESTE 2: Leitura de categorias...');
  try {
    const categoriasRef = collection(db, 'categorias');
    const snapshot = await getDocs(categoriasRef);

    if (snapshot.empty) {
      throw new Error('Nenhuma categoria encontrada');
    }

    console.log(\`   ✅ \${snapshot.size} categorias encontradas\`);
    passedTests++;
  } catch (error) {
    console.log(\`   ❌ FALHOU: \${error.message}\n\`);
    failedTests++;
  }

  // Resultado final
  console.log('='.repeat(60));
  console.log('📊 RESULTADO DOS TESTES');
  console.log('='.repeat(60));
  console.log(\`   ✅ Passou: \${passedTests}\`);
  console.log(\`   ❌ Falhou: \${failedTests}\`);

  if (failedTests === 0) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM!\n');
  } else {
    console.log('\n⚠️  ALGUNS TESTES FALHARAM\n');
  }

  process.exit(failedTests > 0 ? 1 : 0);
}

testarIntegracao();
