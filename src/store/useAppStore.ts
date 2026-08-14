import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AppState {
  hasCompletedOnboarding: boolean;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  themePreference: 'light' | 'dark' | 'system';
  accentColor: string;
  isBiometricEnabled: boolean;
  setHasCompletedOnboarding: (val: boolean) => void;
  setIsAuthenticated: (val: boolean) => void;
  setHasHydrated: (val: boolean) => void;
  setThemePreference: (theme: 'light' | 'dark' | 'system') => void;
  setAccentColor: (color: string) => void;
  setBiometricEnabled: (val: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      isAuthenticated: false,
      _hasHydrated: false,
      themePreference: 'system',
      accentColor: '#007AFF', // Default Blue
      isBiometricEnabled: false,
      setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),
      setIsAuthenticated: (val) => {
        if (Platform.OS !== 'web') {
          if (val) {
            SecureStore.setItemAsync('userToken', 'mock-secure-token').catch(() => {});
          } else {
            SecureStore.deleteItemAsync('userToken').catch(() => {});
          }
        }
        set({ isAuthenticated: val });
      },
      setHasHydrated: (val) => set({ _hasHydrated: val }),
      setThemePreference: (theme) => set({ themePreference: theme }),
      setAccentColor: (color) => set({ accentColor: color }),
      setBiometricEnabled: (val) => set({ isBiometricEnabled: val }),
      logout: () => {
        if (Platform.OS !== 'web') {
          SecureStore.deleteItemAsync('userToken').catch(() => {});
        }
        set({ isAuthenticated: false });
      },
    }),
    {
      name: 'life-sync-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
