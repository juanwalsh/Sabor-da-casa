import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDxmqMwYldIuv_rmVEFsXG-FJiyGGELNZw",
  authDomain: "sabor-da-casa-610ae.firebaseapp.com",
  projectId: "sabor-da-casa-610ae",
  storageBucket: "sabor-da-casa-610ae.firebasestorage.app",
  messagingSenderId: "843674531662",
  appId: "1:843674531662:web:6685c9281ecbcd3f9b901f",
  measurementId: "G-ZBMYCQYQKK"
};

// VAPID Key para Push Notifications
export const VAPID_KEY = "BLXg_uI5_EcIzKY9CAegdBcY1GuAtpbHHtaOiIOGqfrV2ieJGexb-nTYUPfYjDigrqnbxdns5OXJiDo0DcuYDq4";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Messaging (apenas no cliente)
let messaging: ReturnType<typeof getMessaging> | null = null;

export const getFirebaseMessaging = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    if (!messaging) {
      messaging = getMessaging(app);
    }
    return messaging;
  }
  return null;
};

// Solicitar permissao e obter token para push notifications
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const msg = getFirebaseMessaging();
      if (msg) {
        const token = await getToken(msg, { vapidKey: VAPID_KEY });
        console.log('Token de notificacao:', token);
        return token;
      }
    }
    return null;
  } catch (error) {
    console.error('Erro ao solicitar permissao de notificacao:', error);
    return null;
  }
};

// Listener para mensagens em primeiro plano
export const onForegroundMessage = (callback: (payload: unknown) => void) => {
  const msg = getFirebaseMessaging();
  if (msg) {
    return onMessage(msg, callback);
  }
  return () => {};
};

// Analytics (so no cliente)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};
