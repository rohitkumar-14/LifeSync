import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { theme } from '../src/theme';
import { useAppStore } from '../src/store/useAppStore';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';
import { exportData } from '../src/services/backupService';

export default function SettingsScreen() {
  const router = useRouter();
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  const { themePreference, isBiometricEnabled, setBiometricEnabled } = useAppStore();
  const [hasHardware, setHasHardware] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setHasHardware(compatible && enrolled);
    })();
  }, []);

  const renderRow = (icon: keyof typeof Ionicons.glyphMap, title: string, rightContent?: React.ReactNode, isLast = false, onPress?: () => void) => (
    <TouchableOpacity 
      style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight }]}>
          <Ionicons name={icon} size={20} color={colors.text} />
        </View>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.rowRight}>
        {rightContent}
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} style={{ marginLeft: 8 }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {renderRow('moon-outline', 'Dark Mode', <Text style={[styles.rightText, { color: colors.textSecondary }]}>System</Text>, true)}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Notifications</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {renderRow('notifications-outline', 'Notifications')}
            {renderRow('alarm-outline', 'Reminders', null, true)}
          </View>
        </View>

        {/* Privacy & Security Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Privacy & Security</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {renderRow('finger-print-outline', 'Biometric Lock', <Text style={[styles.rightText, { color: colors.textSecondary }]}>{isBiometricEnabled ? 'On' : 'Off'}</Text>, !hasHardware, () => setBiometricEnabled(!isBiometricEnabled))}
            {renderRow('lock-closed-outline', 'Change Passcode', null, true)}
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Data</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {renderRow('download-outline', 'Export Data', null, true, async () => {
              const success = await exportData();
              if (success) {
                Alert.alert("Success", "Data exported successfully");
              }
            })}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  scrollContent: {
    padding: theme.spacing.xl,
    paddingBottom: 100,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginBottom: theme.spacing.md,
    marginLeft: 8,
  },
  card: {
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  rowTitle: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
});
