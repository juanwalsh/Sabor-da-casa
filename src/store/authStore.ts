import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (username: string, password: string) => {
        try {
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });

          const data = await response.json();

          if (data.success && data.user) {
            const user: User = {
              ...data.user,
              createdAt: new Date(),
            };
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          }

          return false;
        } catch (error) {
          console.error('Erro no login:', error);
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: () => {
        const state = get();
        set({ isLoading: false, isAuthenticated: !!state.user });
      },
    }),
    {
      name: 'ep-lopes-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
