import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useAppStore } from '../src/store/useAppStore';
import { initializeDatabase } from '../src/db/database';
import { Platform, View, StyleSheet, Text } from 'react-native';
import Animated, { FadeOut, FadeIn, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
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

let SQLiteProvider: any = ({ children }: any) => <>{children}</>;
if (Platform.OS !== 'web') {
  SQLiteProvider = require('expo-sqlite').SQLiteProvider;
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const { hasCompletedOnboarding, isAuthenticated, _hasHydrated } = useAppStore();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
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

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const splashProgress = useSharedValue(0);

  const loadingBarStyle = useAnimatedStyle(() => {
    return {
      width: `${splashProgress.value * 100}%`
    };
  });

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    if (!_hasHydrated || !rootNavigationState?.key || !fontsLoaded) return; // Wait for async storage, router, and fonts to load

    if (showSplash) {
      splashProgress.value = withTiming(1, { duration: 2000 });
    }

    // Wrap in setTimeout to ensure the Root Layout is fully mounted before attempting navigation
    // This resolves the "Attempted to navigate before mounting the Root Layout component" error
    const timer = setTimeout(() => {
      const inTabsGroup = segments[0] === '(tabs)';
      const inAuthGroup = segments[0] === '(auth)';
      const inOnboardingGroup = segments[0] === '(onboarding)';
      const inModalsGroup = segments[0] === '(modals)';

      // Hide native splash screen
      SplashScreen.hideAsync();

      // Show custom splash for 2 seconds, then navigate
      setTimeout(() => {
        if (!hasCompletedOnboarding && !inOnboardingGroup) {
          router.replace('/(onboarding)');
        } else if (hasCompletedOnboarding && !isAuthenticated && !inAuthGroup) {
          router.replace('/(auth)/login');
        } else if (hasCompletedOnboarding && isAuthenticated && !inTabsGroup && !inModalsGroup) {
          router.replace('/(tabs)');
        }
        setShowSplash(false);
      }, 2000);

    }, 0);

    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding, isAuthenticated, _hasHydrated, segments, rootNavigationState?.key, fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SQLiteProvider databaseName="lifesync.db" onInit={initializeDatabase}>
      <View style={styles.container}>
        <NetworkBanner />
        
        {showSplash ? (
          <Animated.View exiting={FadeOut.duration(500)} style={[styles.splashContainer, { backgroundColor: '#4F46E5' }]}>
            <View style={styles.logoWrapper}>
              <Svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M8 12l3 3 8-8"
                  stroke="#4ade80"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.splashTitle}>LifeSync</Text>
            <Text style={styles.splashSubtitle}>Sync your life. Achieve more.</Text>
            
            <View style={styles.loadingBarContainer}>
              <Animated.View style={[styles.loadingBarFill, loadingBarStyle]} />
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(500)} style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
              <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
              <Stack.Screen name="settings" options={{ presentation: Platform.OS === 'ios' ? 'modal' : 'card' }} />
              <Stack.Screen name="(modals)/add-task" options={{ ...modalHeaderOptions, title: 'New Task' }} />
              <Stack.Screen name="(modals)/add-habit" options={{ ...modalHeaderOptions, title: 'New Habit' }} />
              <Stack.Screen name="(modals)/add-expense" options={{ ...modalHeaderOptions, title: 'New Expense' }} />
              <Stack.Screen name="(modals)/add-goal" options={{ ...modalHeaderOptions, title: 'New Goal' }} />
              <Stack.Screen name="(modals)/add-contribution" options={{ ...modalHeaderOptions, title: 'Add Funds' }} />
              <Stack.Screen name="(modals)/set-budget" options={{ ...modalHeaderOptions, title: 'Set Budget' }} />
              <Stack.Screen name="(modals)/action-sheet" options={{ presentation: Platform.OS === 'ios' ? 'modal' : 'card', headerShown: false }} />
            </Stack>
          </Animated.View>
        )}
      </View>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  logoWrapper: {
    marginBottom: 20,
  },
  splashTitle: {
    fontSize: 42,
    color: '#FFFFFF',
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 12,
  },
  splashSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: theme.typography.fontFamily.medium,
  },
  loadingBarContainer: {
    position: 'absolute',
    bottom: 80,
    width: 180,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  }
});
