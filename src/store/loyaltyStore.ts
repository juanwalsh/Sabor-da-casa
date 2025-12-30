import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'freeItem' | 'freeDelivery';
  value: number; // percentage for discount, or product id for freeItem
}

interface LoyaltyState {
  points: number;
  totalPointsEarned: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  history: Array<{
    id: string;
    date: string;
    points: number;
    type: 'earned' | 'redeemed';
    description: string;
  }>;
  redeemedRewards: string[];
  addPoints: (amount: number, orderId: string) => void;
  redeemReward: (reward: LoyaltyReward) => boolean;
  getLevel: () => 'bronze' | 'silver' | 'gold' | 'platinum';
  getNextLevelProgress: () => { current: number; next: number; progress: number };
  getAvailableRewards: () => LoyaltyReward[];
}

// R$1 = 1 ponto
export const POINTS_PER_REAL = 1;

// Níveis de fidelidade
export const LOYALTY_LEVELS = {
  bronze: { min: 0, multiplier: 1, name: 'Bronze' },
  silver: { min: 500, multiplier: 1.2, name: 'Prata' },
  gold: { min: 1500, multiplier: 1.5, name: 'Ouro' },
  platinum: { min: 5000, multiplier: 2, name: 'Platina' },
};

// Recompensas disponíveis
export const LOYALTY_REWARDS: LoyaltyReward[] = [
  {
    id: 'reward-1',
    name: 'Frete Grátis',
    description: 'Entrega grátis no próximo pedido',
    pointsCost: 100,
    type: 'freeDelivery',
    value: 0,
  },
  {
    id: 'reward-2',
    name: '10% de Desconto',
    description: 'Desconto de 10% no próximo pedido',
    pointsCost: 200,
    type: 'discount',
    value: 10,
  },
  {
    id: 'reward-3',
    name: '15% de Desconto',
    description: 'Desconto de 15% no próximo pedido',
    pointsCost: 350,
    type: 'discount',
    value: 15,
  },
  {
    id: 'reward-4',
    name: 'Sobremesa Grátis',
    description: 'Uma sobremesa grátis no próximo pedido',
    pointsCost: 250,
    type: 'freeItem',
    value: 0,
  },
  {
    id: 'reward-5',
    name: '25% de Desconto',
    description: 'Desconto de 25% no próximo pedido',
    pointsCost: 600,
    type: 'discount',
    value: 25,
  },
];

export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      points: 0,
      totalPointsEarned: 0,
      level: 'bronze',
      history: [],
      redeemedRewards: [],

      addPoints: (amount: number, orderId: string) => {
        const state = get();
        const level = state.getLevel();
        const multiplier = LOYALTY_LEVELS[level].multiplier;
        const pointsToAdd = Math.floor(amount * POINTS_PER_REAL * multiplier);

        set((state) => ({
          points: state.points + pointsToAdd,
          totalPointsEarned: state.totalPointsEarned + pointsToAdd,
          history: [
            {
              id: `earn-${Date.now()}`,
              date: new Date().toISOString(),
              points: pointsToAdd,
              type: 'earned',
              description: `Pedido #${orderId.slice(0, 8)}`,
            },
            ...state.history,
          ],
        }));

        // Update level after adding points
        const newTotalPoints = get().totalPointsEarned;
        let newLevel: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
        if (newTotalPoints >= LOYALTY_LEVELS.platinum.min) newLevel = 'platinum';
        else if (newTotalPoints >= LOYALTY_LEVELS.gold.min) newLevel = 'gold';
        else if (newTotalPoints >= LOYALTY_LEVELS.silver.min) newLevel = 'silver';

        set({ level: newLevel });
      },

      redeemReward: (reward: LoyaltyReward) => {
        const state = get();
        if (state.points < reward.pointsCost) return false;

        set((state) => ({
          points: state.points - reward.pointsCost,
          redeemedRewards: [...state.redeemedRewards, reward.id],
          history: [
            {
              id: `redeem-${Date.now()}`,
              date: new Date().toISOString(),
              points: -reward.pointsCost,
              type: 'redeemed',
              description: reward.name,
            },
            ...state.history,
          ],
        }));

        return true;
      },

      getLevel: () => {
        const totalPoints = get().totalPointsEarned;
        if (totalPoints >= LOYALTY_LEVELS.platinum.min) return 'platinum';
        if (totalPoints >= LOYALTY_LEVELS.gold.min) return 'gold';
        if (totalPoints >= LOYALTY_LEVELS.silver.min) return 'silver';
        return 'bronze';
      },

      getNextLevelProgress: () => {
        const totalPoints = get().totalPointsEarned;
        const currentLevel = get().getLevel();

        const levels = ['bronze', 'silver', 'gold', 'platinum'] as const;
        const currentIndex = levels.indexOf(currentLevel);

        if (currentIndex === levels.length - 1) {
          return { current: totalPoints, next: totalPoints, progress: 100 };
        }

        const nextLevel = levels[currentIndex + 1];
        const currentMin = LOYALTY_LEVELS[currentLevel].min;
        const nextMin = LOYALTY_LEVELS[nextLevel].min;

        const progress = ((totalPoints - currentMin) / (nextMin - currentMin)) * 100;

        return {
          current: totalPoints,
          next: nextMin,
          progress: Math.min(progress, 100),
        };
      },

      getAvailableRewards: () => {
        const points = get().points;
        return LOYALTY_REWARDS.filter((r) => r.pointsCost <= points);
      },
    }),
    {
      name: 'sabor-da-casa-loyalty',
    }
  )
);
