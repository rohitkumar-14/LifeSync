import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface JournalEntry {
  id: string;
  mood: string; // Emoji
  content: string;
  createdAt: string;
}

interface JournalState {
  entries: JournalEntry[];
  isLoading: boolean;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  loadEntries: () => Promise<void>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  isLoading: false,

  loadEntries: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem('@lifesyncc_journal');
      if (stored) {
        set({ entries: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load journal entries:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addEntry: async (entryData) => {
    try {
      const newEntry: JournalEntry = {
        ...entryData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      const currentEntries = get().entries;
      const updatedEntries = [newEntry, ...currentEntries];
      
      await AsyncStorage.setItem('@lifesyncc_journal', JSON.stringify(updatedEntries));
      set({ entries: updatedEntries });
    } catch (error) {
      console.error('Failed to add journal entry:', error);
    }
  },

  deleteEntry: async (id) => {
    try {
      const updatedEntries = get().entries.filter(e => e.id !== id);
      await AsyncStorage.setItem('@lifesyncc_journal', JSON.stringify(updatedEntries));
      set({ entries: updatedEntries });
    } catch (error) {
      console.error('Failed to delete journal entry:', error);
    }
  },
}));
