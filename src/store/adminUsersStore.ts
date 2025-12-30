import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
  points: number;
  totalPointsEarned: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  pointsHistory: Array<{
    id: string;
    date: string;
    points: number;
    type: 'earned' | 'redeemed' | 'manual_add' | 'manual_remove';
    description: string;
    addedBy?: string; // Admin que adicionou
  }>;
}

interface AdminUsersState {
  users: AdminUser[];

  // Actions
  addUser: (user: Omit<AdminUser, 'points' | 'totalPointsEarned' | 'level' | 'pointsHistory'>) => void;
  removeUser: (userId: string) => void;
  getUserByEmail: (email: string) => AdminUser | undefined;
  getUserById: (userId: string) => AdminUser | undefined;

  // Points management
  addPoints: (userId: string, points: number, description: string, adminName?: string) => void;
  removePoints: (userId: string, points: number, description: string, adminName?: string) => void;
  setPoints: (userId: string, points: number, description: string, adminName?: string) => void;

  // Search
  searchUsers: (query: string) => AdminUser[];

  // Sync - sincroniza usuario do Firebase quando ele faz login
  syncUserFromAuth: (id: string, email: string, name: string, phone?: string) => void;
}

// Calcula o nivel baseado nos pontos totais ganhos
const calculateLevel = (totalPoints: number): 'bronze' | 'silver' | 'gold' | 'platinum' => {
  if (totalPoints >= 5000) return 'platinum';
  if (totalPoints >= 1500) return 'gold';
  if (totalPoints >= 500) return 'silver';
  return 'bronze';
};

// Usuarios mock para demonstracao
const mockUsers: AdminUser[] = [
  {
    id: 'user-1',
    email: 'maria@exemplo.com',
    name: 'Maria Silva',
    phone: '(11) 99999-1111',
    createdAt: '2024-06-15T10:00:00Z',
    points: 250,
    totalPointsEarned: 450,
    level: 'bronze',
    pointsHistory: [
      { id: 'h1', date: '2024-12-20T14:30:00Z', points: 150, type: 'earned', description: 'Pedido #abc123' },
      { id: 'h2', date: '2024-12-18T12:00:00Z', points: 100, type: 'earned', description: 'Pedido #def456' },
      { id: 'h3', date: '2024-12-15T18:00:00Z', points: -100, type: 'redeemed', description: 'Frete Gratis' },
      { id: 'h4', date: '2024-12-10T09:00:00Z', points: 200, type: 'earned', description: 'Pedido #ghi789' },
    ],
  },
  {
    id: 'user-2',
    email: 'joao@exemplo.com',
    name: 'Joao Santos',
    phone: '(11) 99999-2222',
    createdAt: '2024-08-20T14:00:00Z',
    points: 680,
    totalPointsEarned: 780,
    level: 'silver',
    pointsHistory: [
      { id: 'h5', date: '2024-12-22T16:00:00Z', points: 280, type: 'earned', description: 'Pedido #jkl012' },
      { id: 'h6', date: '2024-12-19T11:30:00Z', points: -100, type: 'redeemed', description: 'Frete Gratis' },
      { id: 'h7', date: '2024-12-15T20:00:00Z', points: 500, type: 'earned', description: 'Pedido #mno345' },
    ],
  },
  {
    id: 'user-3',
    email: 'ana@exemplo.com',
    name: 'Ana Costa',
    phone: '(11) 99999-3333',
    createdAt: '2024-03-10T08:00:00Z',
    points: 1850,
    totalPointsEarned: 2200,
    level: 'gold',
    pointsHistory: [
      { id: 'h8', date: '2024-12-21T13:00:00Z', points: 350, type: 'earned', description: 'Pedido #pqr678' },
      { id: 'h9', date: '2024-12-20T19:00:00Z', points: 500, type: 'manual_add', description: 'Bonus especial', addedBy: 'Admin' },
      { id: 'h10', date: '2024-12-18T10:00:00Z', points: -200, type: 'redeemed', description: '10% de Desconto' },
    ],
  },
  {
    id: 'user-4',
    email: 'pedro@exemplo.com',
    name: 'Pedro Oliveira',
    phone: '(11) 99999-4444',
    createdAt: '2024-01-05T16:00:00Z',
    points: 5200,
    totalPointsEarned: 6500,
    level: 'platinum',
    pointsHistory: [
      { id: 'h11', date: '2024-12-23T12:00:00Z', points: 700, type: 'earned', description: 'Pedido #stu901' },
      { id: 'h12', date: '2024-12-22T15:00:00Z', points: 1000, type: 'manual_add', description: 'Cliente VIP', addedBy: 'Admin' },
    ],
  },
  {
    id: 'user-5',
    email: 'carla@exemplo.com',
    name: 'Carla Ferreira',
    phone: '(11) 99999-5555',
    createdAt: '2024-11-01T11:00:00Z',
    points: 45,
    totalPointsEarned: 45,
    level: 'bronze',
    pointsHistory: [
      { id: 'h13', date: '2024-12-20T17:00:00Z', points: 45, type: 'earned', description: 'Pedido #vwx234' },
    ],
  },
];

export const useAdminUsersStore = create<AdminUsersState>()(
  persist(
    (set, get) => ({
      users: mockUsers,

      addUser: (userData) => {
        const newUser: AdminUser = {
          ...userData,
          points: 0,
          totalPointsEarned: 0,
          level: 'bronze',
          pointsHistory: [],
        };

        set((state) => ({
          users: [...state.users, newUser],
        }));
      },

      removeUser: (userId) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
        }));
      },

      getUserByEmail: (email) => {
        return get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      },

      getUserById: (userId) => {
        return get().users.find((u) => u.id === userId);
      },

      addPoints: (userId, points, description, adminName = 'Admin') => {
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id !== userId) return user;

            const newTotalPoints = user.totalPointsEarned + points;
            const newPoints = user.points + points;

            return {
              ...user,
              points: newPoints,
              totalPointsEarned: newTotalPoints,
              level: calculateLevel(newTotalPoints),
              pointsHistory: [
                {
                  id: `h-${Date.now()}`,
                  date: new Date().toISOString(),
                  points: points,
                  type: 'manual_add',
                  description,
                  addedBy: adminName,
                },
                ...user.pointsHistory,
              ],
            };
          }),
        }));
      },

      removePoints: (userId, points, description, adminName = 'Admin') => {
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id !== userId) return user;

            const newPoints = Math.max(0, user.points - points);

            return {
              ...user,
              points: newPoints,
              pointsHistory: [
                {
                  id: `h-${Date.now()}`,
                  date: new Date().toISOString(),
                  points: -points,
                  type: 'manual_remove',
                  description,
                  addedBy: adminName,
                },
                ...user.pointsHistory,
              ],
            };
          }),
        }));
      },

      setPoints: (userId, points, description, adminName = 'Admin') => {
        set((state) => ({
          users: state.users.map((user) => {
            if (user.id !== userId) return user;

            const difference = points - user.points;
            const newTotalPoints = difference > 0
              ? user.totalPointsEarned + difference
              : user.totalPointsEarned;

            return {
              ...user,
              points: points,
              totalPointsEarned: newTotalPoints,
              level: calculateLevel(newTotalPoints),
              pointsHistory: [
                {
                  id: `h-${Date.now()}`,
                  date: new Date().toISOString(),
                  points: difference,
                  type: difference >= 0 ? 'manual_add' : 'manual_remove',
                  description: description || `Pontos ajustados para ${points}`,
                  addedBy: adminName,
                },
                ...user.pointsHistory,
              ],
            };
          }),
        }));
      },

      searchUsers: (query) => {
        const q = query.toLowerCase().trim();
        if (!q) return get().users;

        return get().users.filter(
          (user) =>
            user.email.toLowerCase().includes(q) ||
            user.name.toLowerCase().includes(q) ||
            user.phone?.includes(q)
        );
      },

      syncUserFromAuth: (id, email, name, phone) => {
        const existingUser = get().getUserByEmail(email);

        if (existingUser) {
          // Atualiza dados se o usuario ja existe
          set((state) => ({
            users: state.users.map((u) =>
              u.email.toLowerCase() === email.toLowerCase()
                ? { ...u, id, name: name || u.name, phone: phone || u.phone }
                : u
            ),
          }));
        } else {
          // Cria novo usuario
          get().addUser({
            id,
            email,
            name,
            phone,
            createdAt: new Date().toISOString(),
          });
        }
      },
    }),
    {
      name: 'sabor-da-casa-admin-users',
    }
  )
);
