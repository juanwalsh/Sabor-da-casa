import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

// ============================================
// EMAILJS CONFIG
// ============================================
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_qxk8v7n',
  TEMPLATE_ID: 'service_qxk8v7n',
  PUBLIC_KEY: 'Hul0yYskqCWGqfqzf',
};

interface Address {
  id: string;
  label: string; // Casa, Trabalho, etc
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  addresses: Address[];
  createdAt: string;
}

interface UserState {
  user: User | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Guest mode
  setGuestMode: () => void;

  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;

  // User actions
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | null;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isGuest: false,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setGuestMode: () => {
        set({
          isGuest: true,
          isAuthenticated: false,
          user: null,
          error: null,
        });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = result.user;

          const user: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || email.split('@')[0],
            email: firebaseUser.email || email,
            phone: firebaseUser.phoneNumber || '',
            addresses: get().user?.addresses || [],
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          };

          set({
            user,
            isAuthenticated: true,
            isGuest: false,
            isLoading: false,
          });
          return true;
        } catch (error: unknown) {
          const firebaseError = error as { code?: string };
          let errorMessage = 'Erro ao fazer login';

          if (firebaseError.code === 'auth/user-not-found') {
            errorMessage = 'Usuario nao encontrado';
          } else if (firebaseError.code === 'auth/wrong-password') {
            errorMessage = 'Senha incorreta';
          } else if (firebaseError.code === 'auth/invalid-email') {
            errorMessage = 'Email invalido';
          } else if (firebaseError.code === 'auth/invalid-credential') {
            errorMessage = 'Email ou senha incorretos';
          }

          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
          await updateProfile(result.user, { displayName: data.name });

          // Enviar email de verificacao
          try {
            await sendEmailVerification(result.user);
            console.log('Email de verificacao enviado para:', result.user.email);
          } catch (emailError) {
            console.error('Erro ao enviar email de verificacao:', emailError);
          }

          const newUser: User = {
            id: result.user.uid,
            name: data.name,
            email: data.email,
            phone: data.phone,
            addresses: [],
            createdAt: new Date().toISOString(),
          };

          set({
            user: newUser,
            isAuthenticated: true,
            isGuest: false,
            isLoading: false,
          });

          return true;
        } catch (error: unknown) {
          console.error('Firebase register error:', error);
          const firebaseError = error as { code?: string; message?: string };
          let errorMessage = 'Erro ao criar conta';

          if (firebaseError.code === 'auth/email-already-in-use') {
            errorMessage = 'Este email ja esta em uso';
          } else if (firebaseError.code === 'auth/weak-password') {
            errorMessage = 'Senha muito fraca (minimo 6 caracteres)';
          } else if (firebaseError.code === 'auth/invalid-email') {
            errorMessage = 'Email invalido';
          } else if (firebaseError.code === 'auth/operation-not-allowed') {
            errorMessage = 'Metodo de autenticacao nao habilitado no Firebase';
          } else if (firebaseError.code) {
            errorMessage = `Erro: ${firebaseError.code}`;
          }

          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          await signOut(auth);
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
        }

        set({
          user: null,
          isAuthenticated: false,
          isGuest: false,
          error: null,
        });
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          await sendPasswordResetEmail(auth, email);
          set({ isLoading: false });
          return true;
        } catch (error: unknown) {
          const firebaseError = error as { code?: string };
          let errorMessage = 'Erro ao enviar email';

          if (firebaseError.code === 'auth/user-not-found') {
            errorMessage = 'Usuario nao encontrado';
          } else if (firebaseError.code === 'auth/invalid-email') {
            errorMessage = 'Email invalido';
          }

          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      updateProfile: (data: Partial<User>) => {
        const user = get().user;
        if (!user) return;

        set({
          user: { ...user, ...data },
        });
      },

      addAddress: (address: Omit<Address, 'id'>) => {
        const user = get().user;
        if (!user) return;

        const newAddress: Address = {
          ...address,
          id: `addr-${Date.now()}`,
        };

        // Se for o primeiro endereço, definir como padrão
        if (user.addresses.length === 0) {
          newAddress.isDefault = true;
        }

        set({
          user: {
            ...user,
            addresses: [...user.addresses, newAddress],
          },
        });
      },

      updateAddress: (id: string, addressData: Partial<Address>) => {
        const user = get().user;
        if (!user) return;

        set({
          user: {
            ...user,
            addresses: user.addresses.map((addr) =>
              addr.id === id ? { ...addr, ...addressData } : addr
            ),
          },
        });
      },

      removeAddress: (id: string) => {
        const user = get().user;
        if (!user) return;

        const addresses = user.addresses.filter((addr) => addr.id !== id);

        // Se removeu o endereço padrão, definir outro como padrão
        if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
          addresses[0].isDefault = true;
        }

        set({
          user: {
            ...user,
            addresses,
          },
        });
      },

      setDefaultAddress: (id: string) => {
        const user = get().user;
        if (!user) return;

        set({
          user: {
            ...user,
            addresses: user.addresses.map((addr) => ({
              ...addr,
              isDefault: addr.id === id,
            })),
          },
        });
      },

      getDefaultAddress: () => {
        const user = get().user;
        if (!user) return null;
        return user.addresses.find((a) => a.isDefault) || null;
      },
    }),
    {
      name: 'sabor-da-casa-user',
    }
  )
);
