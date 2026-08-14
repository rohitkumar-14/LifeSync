import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Habit, HabitCompletion } from '../types';
import { db } from '../db/database';

const isWeb = Platform.OS === 'web';

interface HabitState {
  habits: Habit[];
  completions: HabitCompletion[];
  loadHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitCompletion: (habitId: string, date: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: [],
      loadHabits: async () => {
        if (isWeb) return;
        try {
      const habitsResult = await db.getAllAsync<any>('SELECT * FROM habits ORDER BY createdAt DESC');
      const completionsResult = await db.getAllAsync<any>('SELECT * FROM habit_completions');
      
      const habits: Habit[] = habitsResult.map((h) => ({
        ...h,
        frequency: JSON.parse(h.frequency),
      }));

      const completions: HabitCompletion[] = completionsResult.map((c) => ({
        ...c,
        completed: Boolean(c.completed),
      }));

      set({ habits, completions });
    } catch (e) {
      console.error('Failed to load habits', e);
    }
  },
  addHabit: async (habitData) => {
    const newHabit: Habit = {
      ...habitData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    set((state) => ({ habits: [...state.habits, newHabit] }));
    
    if (isWeb) return;
    try {
      await db.runAsync(
        'INSERT INTO habits (id, name, icon, color, frequency, reminderTime, target, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          newHabit.id,
          newHabit.name,
          newHabit.icon,
          newHabit.color,
          JSON.stringify(newHabit.frequency),
          newHabit.reminderTime || null,
          newHabit.target,
          newHabit.createdAt,
        ]
      );
    } catch (e) {
      console.error('Failed to add habit', e);
      get().loadHabits();
    }
  },
  updateHabit: async (id, updates) => {
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id ? { ...habit, ...updates } : habit
      ),
    }));
    
    if (isWeb) return;
    try {
      const habit = get().habits.find((h) => h.id === id);
      if (habit) {
        await db.runAsync(
          'UPDATE habits SET name = ?, icon = ?, color = ?, frequency = ?, reminderTime = ?, target = ? WHERE id = ?',
          [
            habit.name,
            habit.icon,
            habit.color,
            JSON.stringify(habit.frequency),
            habit.reminderTime || null,
            habit.target,
            habit.id,
          ]
        );
      }
    } catch (e) {
      console.error('Failed to update habit', e);
      get().loadHabits();
    }
  },
  deleteHabit: async (id) => {
    set((state) => ({
      habits: state.habits.filter((habit) => habit.id !== id),
      completions: state.completions.filter((comp) => comp.habitId !== id),
    }));
    
    if (isWeb) return;
    try {
      await db.runAsync('DELETE FROM habits WHERE id = ?', [id]);
    } catch (e) {
      console.error('Failed to delete habit', e);
      get().loadHabits();
    }
  },
  toggleHabitCompletion: async (habitId, date) => {
    const existing = get().completions.find(
      (c) => c.habitId === habitId && c.date === date
    );

    if (existing) {
      set((state) => ({
        completions: state.completions.filter((c) => c.id !== existing.id),
      }));
      if (isWeb) return;
      try {
        await db.runAsync('DELETE FROM habit_completions WHERE id = ?', [existing.id]);
      } catch (e) {
        console.error('Failed to delete completion', e);
        get().loadHabits();
      }
    } else {
      const newCompletion: HabitCompletion = {
        id: Math.random().toString(36).substring(2, 9),
        habitId,
        date,
        completed: true,
      };
      set((state) => ({
        completions: [...state.completions, newCompletion],
      }));
      if (isWeb) return;
      try {
        await db.runAsync(
          'INSERT INTO habit_completions (id, habitId, date, completed) VALUES (?, ?, ?, ?)',
          [newCompletion.id, newCompletion.habitId, newCompletion.date, 1]
        );
      } catch (e) {
        console.error('Failed to add completion', e);
        get().loadHabits();
      }
    }
  },
}),
    {
      name: 'habits-storage',
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: !isWeb,
    }
  )
);
