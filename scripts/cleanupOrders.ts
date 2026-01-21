import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Hardcoded config for the script to avoid env issues
const firebaseConfig = {
  apiKey: "AIzaSyDxmqMwYldIuv_rmVEFsXG-FJiyGGELNZw",
  authDomain: "sabor-da-casa-610ae.firebaseapp.com",
  projectId: "sabor-da-casa-610ae",
  storageBucket: "sabor-da-casa-610ae.firebasestorage.app",
  messagingSenderId: "843674531662",
  appId: "1:843674531662:web:6685c9281ecbcd3f9b901f"
};

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