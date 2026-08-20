import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { theme } from '../src/theme';
import { useAppStore } from '../src/store/useAppStore';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';
import { exportData } from '../src/services/backupService';
import { LogoutModal } from '../src/components/modals/LogoutModal';

export default function SettingsScreen() {
  const router = useRouter();
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  const { 
    userName, 
    userEmail, 
    isBiometricEnabled, 
    setBiometricEnabled, 
    setThemePreference,
    logout 
  } = useAppStore();
  
  const [hasHardware, setHasHardware] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setHasHardware(compatible && enrolled);
    })();
  }, []);

  const handleConfirmLogout = () => {
    setIsLogoutModalVisible(false);
    logout();
    router.replace('/(auth)/login');
  };

  const renderRow = (icon: keyof typeof Ionicons.glyphMap, title: string, rightContent?: React.ReactNode, isLast = false, onPress?: () => void) => (
    <TouchableOpacity 
      style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconBox, { backgroundColor: colors.surfaceHighlight || 'rgba(128,128,128,0.1)' }]}>
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {(userName ? userName.charAt(0) : 'U').toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {userName || 'LifeSync User'}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              {userEmail || 'user@lifesync.app'}
            </Text>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {renderRow(
              'moon-outline', 
              'Theme', 
              <Text style={[styles.rightText, { color: colors.textSecondary }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>, 
              true,
              () => setThemePreference(isDark ? 'light' : 'dark')
            )}
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Privacy & Security</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {renderRow(
              'finger-print-outline', 
              'Biometric Lock', 
              <Text style={[styles.rightText, { color: colors.textSecondary }]}>
                {isBiometricEnabled ? 'Enabled' : 'Disabled'}
              </Text>, 
              true, 
              () => setBiometricEnabled(!isBiometricEnabled)
            )}
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Data & Backup</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {renderRow('download-outline', 'Export Local Data', null, true, async () => {
              const success = await exportData();
              if (success) {
                Alert.alert("Success", "Data exported successfully");
              }
            })}
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.logoutBtn, { borderColor: '#EF4444' }]} 
            onPress={() => setIsLogoutModalVisible(true)}
            activeOpacity={0.75}
          >
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Modern Beautiful Logout Modal */}
      <LogoutModal
        visible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onConfirm={handleConfirmLogout}
        isDark={isDark}
      />
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
    includeFontPadding: false,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  scrollContent: {
    padding: theme.spacing.xl,
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 22,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  profileEmail: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.regular,
    marginTop: 2,
    includeFontPadding: false,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginBottom: theme.spacing.sm,
    marginLeft: 4,
    includeFontPadding: false,
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
    includeFontPadding: false,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    includeFontPadding: false,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    gap: 8,
    marginTop: theme.spacing.md,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
});
