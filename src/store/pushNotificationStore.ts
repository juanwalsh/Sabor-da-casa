import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission | null;
  preferences: {
    promotions: boolean;
    orderStatus: boolean;
    newItems: boolean;
  };
  checkSupport: () => boolean;
  requestPermission: () => Promise<boolean>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => void;
  updatePreferences: (prefs: Partial<PushNotificationState['preferences']>) => void;
  sendLocalNotification: (title: string, body: string, icon?: string) => void;
}

export const usePushNotificationStore = create<PushNotificationState>()(
  persist(
    (set, get) => ({
      isSupported: false,
      isSubscribed: false,
      permission: null,
      preferences: {
        promotions: true,
        orderStatus: true,
        newItems: true,
      },

      checkSupport: () => {
        const supported =
          typeof window !== 'undefined' &&
          'Notification' in window &&
          'serviceWorker' in navigator;

        set({ isSupported: supported });

        if (supported) {
          set({ permission: Notification.permission });
        }

        return supported;
      },

      requestPermission: async () => {
        if (!get().isSupported) return false;

        try {
          const permission = await Notification.requestPermission();
          set({ permission });

          if (permission === 'granted') {
            set({ isSubscribed: true });
            return true;
          }

          return false;
        } catch (error) {
          console.error('Erro ao solicitar permissão:', error);
          return false;
        }
      },

      subscribe: async () => {
        const state = get();

        if (!state.isSupported) {
          console.log('Notificações não suportadas');
          return false;
        }

        if (state.permission !== 'granted') {
          const granted = await state.requestPermission();
          if (!granted) return false;
        }

        try {
          // ============================================
          // PLACEHOLDER: Web Push Subscription
          // ============================================
          // Para implementar push notifications reais:
          // 1. Gerar VAPID keys: npx web-push generate-vapid-keys
          // 2. Configurar no service worker
          // 3. Enviar subscription para seu backend
          /*
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
          });

          // Enviar subscription para o backend
          await fetch('/api/push/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: { 'Content-Type': 'application/json' }
          });
          */

          set({ isSubscribed: true });

          // Mostrar notificação de confirmação
          state.sendLocalNotification(
            'Notificações ativadas!',
            'Você receberá atualizações sobre seus pedidos e promoções.'
          );

          return true;
        } catch (error) {
          console.error('Erro ao se inscrever:', error);
          return false;
        }
      },

      unsubscribe: () => {
        // ============================================
        // PLACEHOLDER: Cancelar subscription no backend
        // ============================================
        set({ isSubscribed: false });
      },

      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        }));
      },

      sendLocalNotification: (title: string, body: string, icon?: string) => {
        const state = get();

        if (!state.isSupported || state.permission !== 'granted') {
          console.log('Não é possível enviar notificação');
          return;
        }

        try {
          new Notification(title, {
            body,
            icon: icon || '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            tag: `sabor-da-casa-${Date.now()}`,
            requireInteraction: false,
          });
        } catch (error) {
          // Fallback para service worker notification
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification(title, {
                body,
                icon: icon || '/icons/icon-192x192.png',
              });
            });
          }
        }
      },
    }),
    {
      name: 'sabor-da-casa-push',
      partialize: (state) => ({
        isSubscribed: state.isSubscribed,
        preferences: state.preferences,
      }),
    }
  )
);

// Tipos de notificações para o app
export const NotificationTypes = {
  ORDER_CONFIRMED: {
    title: 'Pedido Confirmado!',
    body: (orderId: string) => `Seu pedido #${orderId} foi confirmado e está sendo preparado.`,
  },
  ORDER_READY: {
    title: 'Pedido Pronto!',
    body: (orderId: string) => `Seu pedido #${orderId} está pronto e saindo para entrega.`,
  },
  ORDER_DELIVERED: {
    title: 'Pedido Entregue!',
    body: () => 'Bom apetite! Não esqueça de avaliar seu pedido.',
  },
  PROMOTION: {
    title: 'Promoção Especial!',
    body: (message: string) => message,
  },
  NEW_ITEM: {
    title: 'Novidade no Cardápio!',
    body: (itemName: string) => `Conheça nosso novo prato: ${itemName}`,
  },
};
