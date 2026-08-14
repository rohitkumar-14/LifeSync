import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../theme';

export function useAppColorScheme() {
  const systemTheme = useNativeColorScheme();
  const themePreference = useAppStore((state) => state.themePreference);

  if (themePreference === 'system') {
    return systemTheme === 'dark';
  }
  return themePreference === 'dark';
}

export function useThemeColors() {
  const isDark = useAppColorScheme();
  const accentColor = useAppStore((state) => state.accentColor);
  
  const baseColors = isDark ? theme.colors.dark : theme.colors.light;
  
  return {
    ...baseColors,
    primary: accentColor,
  };
}
