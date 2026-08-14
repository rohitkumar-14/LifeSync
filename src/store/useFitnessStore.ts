import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FitnessData {
  steps: number;
  calories: number;
  waterGlasses: number;
  lastUpdated: string;
}

interface FitnessState {
  data: FitnessData;
  isLoading: boolean;
  updateData: (partial: Partial<FitnessData>) => Promise<void>;
  loadData: () => Promise<void>;
  resetDailyIfNeeded: () => Promise<void>;
}

const defaultData: FitnessData = {
  steps: 0,
  calories: 0,
  waterGlasses: 0,
  lastUpdated: new Date().toISOString(),
};

export const useFitnessStore = create<FitnessState>((set, get) => ({
  data: defaultData,
  isLoading: false,

  loadData: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem('@lifesyncc_fitness');
      if (stored) {
        set({ data: JSON.parse(stored) });
      }
      await get().resetDailyIfNeeded();
    } catch (error) {
      console.error('Failed to load fitness data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateData: async (partial) => {
    try {
      const newData = { ...get().data, ...partial, lastUpdated: new Date().toISOString() };
      await AsyncStorage.setItem('@lifesyncc_fitness', JSON.stringify(newData));
      set({ data: newData });
    } catch (error) {
      console.error('Failed to update fitness data:', error);
    }
  },

  resetDailyIfNeeded: async () => {
    const { data } = get();
    const lastUpdateDate = new Date(data.lastUpdated).toDateString();
    const today = new Date().toDateString();
    
    if (lastUpdateDate !== today) {
      const newData = { ...defaultData, lastUpdated: new Date().toISOString() };
      await AsyncStorage.setItem('@lifesyncc_fitness', JSON.stringify(newData));
      set({ data: newData });
    }
  }
}));
