import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GroceryItem {
  id: string;
  name: string;
  isCompleted: boolean;
  createdAt: string;
}

interface GroceryState {
  items: GroceryItem[];
  isLoading: boolean;
  addItem: (name: string) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  loadItems: () => Promise<void>;
}

export const useGroceryStore = create<GroceryState>((set, get) => ({
  items: [],
  isLoading: false,

  loadItems: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem('@lifesyncc_groceries');
      if (stored) {
        set({ items: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load groceries:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (name) => {
    try {
      const newItem: GroceryItem = {
        id: Date.now().toString(),
        name: name.trim(),
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      
      const updatedItems = [newItem, ...get().items];
      await AsyncStorage.setItem('@lifesyncc_groceries', JSON.stringify(updatedItems));
      set({ items: updatedItems });
    } catch (error) {
      console.error('Failed to add grocery item:', error);
    }
  },

  toggleItem: async (id) => {
    try {
      const updatedItems = get().items.map(item => 
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      );
      await AsyncStorage.setItem('@lifesyncc_groceries', JSON.stringify(updatedItems));
      set({ items: updatedItems });
    } catch (error) {
      console.error('Failed to toggle grocery item:', error);
    }
  },

  deleteItem: async (id) => {
    try {
      const updatedItems = get().items.filter(i => i.id !== id);
      await AsyncStorage.setItem('@lifesyncc_groceries', JSON.stringify(updatedItems));
      set({ items: updatedItems });
    } catch (error) {
      console.error('Failed to delete grocery item:', error);
    }
  },

  clearCompleted: async () => {
    try {
      const updatedItems = get().items.filter(i => !i.isCompleted);
      await AsyncStorage.setItem('@lifesyncc_groceries', JSON.stringify(updatedItems));
      set({ items: updatedItems });
    } catch (error) {
      console.error('Failed to clear completed groceries:', error);
    }
  }
}));
