import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Network from 'expo-network';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { useAppColorScheme } from '../../hooks/useAppColorScheme';

export function NetworkBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  useEffect(() => {
    // Check initial state
    const checkNetwork = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        if (state) {
          setIsOffline(!state.isConnected || !state.isInternetReachable);
        }
      } catch (e) {
        // Fallback gracefully if network module permissions/state isn't ready
      }
    };
    checkNetwork();

    const interval = setInterval(checkNetwork, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isOffline) return null;

  return (
    <Animated.View 
      entering={FadeIn} 
      exiting={FadeOut} 
      style={[styles.container, { backgroundColor: colors.warning + '20' }]}
    >
      <Ionicons name="cloud-offline" size={20} color={colors.warning} />
      <Text style={[styles.text, { color: colors.warning }]}>
        You're offline. Changes are saved locally.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  text: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
});
