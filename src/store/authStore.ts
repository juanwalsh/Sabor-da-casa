import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

// Mock admin user for demo
const MOCK_ADMIN: User = {
  id: 'admin-1',
  name: 'Administrador',
  email: 'admin@sabordacasa.com.br',
  role: 'admin',
  createdAt: new Date(),
};

// Simple demo credentials
const DEMO_CREDENTIALS = {
  email: 'admin@sabordacasa.com.br',
  password: 'admin123',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (
          email === DEMO_CREDENTIALS.email &&
          password === DEMO_CREDENTIALS.password
        ) {
          set({ user: MOCK_ADMIN, isAuthenticated: true, isLoading: false });
          return true;
        }

        return false;
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
      name: 'sabor-da-casa-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
