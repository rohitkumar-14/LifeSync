import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useAppStore } from '../src/store/useAppStore';
import { Platform, View, StyleSheet } from 'react-native';
import { NetworkBanner } from '../src/components/ui/NetworkBanner';
import { registerForPushNotificationsAsync } from '../src/services/notifications';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';
import { theme } from '../src/theme';
import '../src/i18n';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

// Keep native splash screen visible while loading resources
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { setHasHydrated } = useAppStore();
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  const modalHeaderOptions = {
    headerShown: false,
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.text,
    headerTitleStyle: { fontFamily: theme.typography.fontFamily.semiBold },
    presentation: Platform.OS === 'ios' ? 'modal' as const : 'card' as const,
    headerBackTitle: 'Back',
  };

  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  // Push notification registration
  useEffect(() => {
    try {
      registerForPushNotificationsAsync().catch(() => {});
    } catch (e) {}
  }, []);

  // Hydration fallback safety in case onRehydrateStorage didn't fire
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setHasHydrated(true);
    }, 200);
    return () => clearTimeout(fallbackTimer);
  }, []);

  // Hide splash screen immediately when fonts are ready or after 1 second max
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }

    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 1000);

    return () => clearTimeout(timer);
  }, [fontsLoaded, fontError]);

  return (
    <View style={styles.container}>
      <NetworkBanner />
      
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="settings" options={{ presentation: Platform.OS === 'ios' ? 'modal' : 'card' }} />
        <Stack.Screen name="(modals)/add-task" options={{ ...modalHeaderOptions, title: 'New Task' }} />
        <Stack.Screen name="(modals)/add-habit" options={{ ...modalHeaderOptions, title: 'New Habit' }} />
        <Stack.Screen name="(modals)/add-expense" options={{ ...modalHeaderOptions, title: 'New Expense' }} />
        <Stack.Screen name="(modals)/add-goal" options={{ ...modalHeaderOptions, title: 'New Goal' }} />
        <Stack.Screen name="(modals)/add-contribution" options={{ ...modalHeaderOptions, title: 'Add Funds' }} />
        <Stack.Screen name="(modals)/set-budget" options={{ ...modalHeaderOptions, title: 'Set Budget' }} />
        <Stack.Screen name="(modals)/action-sheet" options={{ presentation: Platform.OS === 'ios' ? 'modal' : 'card', headerShown: false }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
