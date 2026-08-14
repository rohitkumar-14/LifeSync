import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';

export default function OfflineScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>You're Offline</Text>
      </View>

      {/* Main Content (Centered) */}
      <View style={styles.content}>
        
        {/* Mock Illustration Area */}
        <View style={styles.illustrationContainer}>
          <View style={styles.cloudBg}>
            <Ionicons name="cloud-offline" size={120} color="#E0E7FF" />
          </View>
          <View style={styles.phoneOverlay}>
            <Ionicons name="phone-portrait" size={80} color="#4F46E5" />
          </View>
          <View style={styles.dot1} />
          <View style={styles.dot2} />
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          No internet connection.{'\n'}
          Your changes will remain{'\n'}
          available on this device.
        </Text>
      </View>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: theme.typography.fontFamily.bold,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xxxl,
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  cloudBg: {
    position: 'absolute',
    top: 20,
  },
  phoneOverlay: {
    position: 'absolute',
    bottom: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  dot1: {
    position: 'absolute',
    top: 40,
    right: 30,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
  },
  dot2: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F59E0B',
    opacity: 0.5,
  },
  description: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  retryButton: {
    backgroundColor: '#4F46E5',
    height: 56,
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
