import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Expense, Budget } from '../types';
import { db } from '../db/database';

const isWeb = Platform.OS === 'web';

interface FinanceState {
  expenses: Expense[];
  budgets: Budget[];
  loadFinances: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt'>) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      expenses: [],
      budgets: [],
      loadFinances: async () => {
        if (isWeb) return;
        try {
          const expensesResult = await db.getAllAsync<Expense>('SELECT * FROM expenses ORDER BY date DESC');
          const budgetsResult = await db.getAllAsync<any>('SELECT * FROM budgets ORDER BY createdAt DESC');
          
          const budgets = budgetsResult.map((b) => ({
            ...b,
            limit: b.limitAmount,
          }));

          set({ expenses: expensesResult, budgets });
        } catch (e) {
          console.error('Failed to load finances', e);
        }
      },
      addExpense: async (data) => {
        const newExpense: Expense = {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({ expenses: [newExpense, ...state.expenses] }));
        
        if (isWeb) return;
        try {
          await db.runAsync(
            'INSERT INTO expenses (id, amount, category, date, paymentMethod, note, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
              newExpense.id,
              newExpense.amount,
              newExpense.category,
              newExpense.date,
              newExpense.paymentMethod,
              newExpense.note || null,
              newExpense.createdAt,
            ]
          );
        } catch (e) {
          console.error('Failed to add expense to SQLite', e);
        }
      },
      updateExpense: async (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
        
        if (isWeb) return;
        try {
          const expense = get().expenses.find((e) => e.id === id);
          if (expense) {
            await db.runAsync(
              'UPDATE expenses SET amount = ?, category = ?, date = ?, paymentMethod = ?, note = ? WHERE id = ?',
              [
                expense.amount,
                expense.category,
                expense.date,
                expense.paymentMethod,
                expense.note || null,
                expense.id,
              ]
            );
          }
        } catch (e) {
          console.error('Failed to update expense', e);
          get().loadFinances();
        }
      },
      deleteExpense: async (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));
        if (isWeb) return;
        try {
          await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
        } catch (e) {
          console.error('Failed to delete expense', e);
          get().loadFinances();
        }
      },
      addBudget: async (data) => {
        const newBudget: Budget = {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({ budgets: [...state.budgets, newBudget] }));
        
        if (isWeb) return;
        try {
          await db.runAsync(
            'INSERT INTO budgets (id, category, limitAmount, month, createdAt) VALUES (?, ?, ?, ?, ?)',
            [
              newBudget.id,
              newBudget.category,
              newBudget.limit,
              newBudget.month,
              newBudget.createdAt,
            ]
          );
        } catch (e) {
          console.error('Failed to add budget', e);
        }
      },
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: !isWeb,
    }
  )
);
