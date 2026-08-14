import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Goal, GoalContribution } from '../types';
import { db } from '../db/database';

const isWeb = Platform.OS === 'web';

interface GoalState {
  goals: Goal[];
  contributions: GoalContribution[];
  loadGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addContribution: (contribution: Omit<GoalContribution, 'id'>) => Promise<void>;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: [],
      contributions: [],
      loadGoals: async () => {
        if (isWeb) return;
        try {
      const goalsResult = await db.getAllAsync<Goal>('SELECT * FROM goals ORDER BY createdAt DESC');
      const contributionsResult = await db.getAllAsync<GoalContribution>('SELECT * FROM goal_contributions ORDER BY date DESC');
      set({ goals: goalsResult, contributions: contributionsResult });
    } catch (e) {
      console.error('Failed to load goals', e);
    }
  },
  addGoal: async (data) => {
    const newGoal: Goal = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({ goals: [...state.goals, newGoal] }));
    
    if (isWeb) return;
    try {
      await db.runAsync(
        'INSERT INTO goals (id, name, target, deadline, icon, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        [
          newGoal.id,
          newGoal.name,
          newGoal.target,
          newGoal.deadline || null,
          newGoal.icon || null,
          newGoal.createdAt,
        ]
      );
    } catch (e) {
      console.error('Failed to add goal', e);
      get().loadGoals();
    }
  },
  updateGoal: async (id, updates) => {
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
    
    if (isWeb) return;
    try {
      const goal = get().goals.find((g) => g.id === id);
      if (goal) {
        await db.runAsync(
          'UPDATE goals SET name = ?, target = ?, deadline = ?, icon = ? WHERE id = ?',
          [
            goal.name,
            goal.target,
            goal.deadline || null,
            goal.icon || null,
            goal.id,
          ]
        );
      }
    } catch (e) {
      console.error('Failed to update goal', e);
      get().loadGoals();
    }
  },
  deleteGoal: async (id) => {
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
      contributions: state.contributions.filter((c) => c.goalId !== id),
    }));
    if (isWeb) return;
    try {
      await db.runAsync('DELETE FROM goals WHERE id = ?', [id]);
    } catch (e) {
      console.error('Failed to delete goal', e);
      get().loadGoals();
    }
  },
  addContribution: async (data) => {
    const newContrib: GoalContribution = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    set((state) => ({ contributions: [...state.contributions, newContrib] }));
    
    if (isWeb) return;
    try {
      await db.runAsync(
        'INSERT INTO goal_contributions (id, goalId, amount, date, note) VALUES (?, ?, ?, ?, ?)',
        [
          newContrib.id,
          newContrib.goalId,
          newContrib.amount,
          newContrib.date,
          newContrib.note || null,
        ]
      );
    } catch (e) {
      console.error('Failed to add contribution', e);
      get().loadGoals();
    }
  },
}),
    {
      name: 'goals-storage',
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: !isWeb,
    }
  )
);
