import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Config from env
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("❌ Error: Missing Firebase configuration in environment variables.");
  console.error("Please ensure you have a .env file with NEXT_PUBLIC_FIREBASE_... variables.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanupOrders() {
  console.log('🧹 Cleaning up orders for project:', firebaseConfig.projectId);
  
  const ordersRef = collection(db, 'orders');
  const snapshot = await getDocs(ordersRef);
  
  if (snapshot.empty) {
    console.log('No orders found.');
    process.exit(0);
  }

  const orders = snapshot.docs.map(doc => ({
    id: doc.id,
    createdAt: doc.data().createdAt ? new Date(doc.data().createdAt) : new Date(0)
  }));
  
  // Sort descending (newest first)
  orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  if (orders.length <= 1) {
    console.log(`Only ${orders.length} order(s) found. Keeping it.`);
    process.exit(0);
  }
  
  // Keep the first one (index 0)
  const ordersToDelete = orders.slice(1);
  
  console.log(`Found ${orders.length} orders. Keeping the newest one (${orders[0].id}). Deleting ${ordersToDelete.length} orders...`);
  
  for (const order of ordersToDelete) {
    try {
        await deleteDoc(doc(db, 'orders', order.id));
        console.log(`Deleted order ${order.id}`);
    } catch (e) {
        console.error(`Failed to delete ${order.id}:`, e);
    }
  }
  
  console.log('✅ Cleanup complete.');
  process.exit(0);
}

cleanupOrders().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});