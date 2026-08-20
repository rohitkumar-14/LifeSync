import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { useAppStore } from '../../src/store/useAppStore';
import { useRouter } from 'expo-router';
import { LogoutModal } from '../../src/components/modals/LogoutModal';

const { width } = Dimensions.get('window');
const itemWidth = (width - theme.spacing.lg * 3) / 2;

export default function MenuScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const { userName, userEmail, logout } = useAppStore();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleConfirmLogout = () => {
    setIsLogoutModalVisible(false);
    logout();
    router.replace('/(auth)/login');
  };

  const coreDashboards = [
    { id: 'finance', title: 'Finance & Wallet', icon: 'wallet-outline', color: '#10B981', route: '/(tabs)/finance', badge: 'Active' },
    { id: 'goals', title: 'Goals & Targets', icon: 'flag-outline', color: '#F59E0B', route: '/(tabs)/goals' },
    { id: 'focus', title: 'Focus Timer', icon: 'timer-outline', color: '#8B5CF6', route: '/focus', badge: 'Pomodoro' },
    { id: 'fitness', title: 'Activity Rings', icon: 'fitness-outline', color: '#EC4899', route: '/fitness', badge: '3 Rings' },
  ];

  const lifestyleFeatures = [
    { id: 'journal', title: 'Daily Journal', icon: 'book-outline', color: '#6366F1', route: '/journal' },
    { id: 'groceries', title: 'Groceries & List', icon: 'cart-outline', color: '#14B8A6', route: '/groceries' },
    { id: 'wrapped', title: 'Life Wrapped', icon: 'sparkles-outline', color: '#F43F5E', route: '/wrapped', badge: 'Special' },
    { id: 'analytics', title: 'Analytics & Trends', icon: 'bar-chart-outline', color: '#3B82F6', route: '/analytics' },
    { id: 'budgets', title: 'Monthly Budgets', icon: 'pie-chart-outline', color: '#10B981', route: '/budgets' },
    { id: 'agenda', title: 'Calendar Agenda', icon: 'calendar-outline', color: '#8B5CF6', route: '/agenda' },
  ];

  const toolItems = [
    { id: 'settings', title: 'App Settings', icon: 'settings-outline', color: '#3B82F6', route: '/settings' },
  ];

  const renderCard = (item: any) => (
    <TouchableOpacity 
      key={item.id} 
      style={[styles.menuCard, { backgroundColor: colors.surface }]}
      onPress={() => router.push(item.route as any)}
      activeOpacity={0.75}
    >
      <View style={styles.cardTop}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + '18' }]}>
          <Ionicons name={item.icon} size={24} color={item.color} />
        </View>
        {item.badge && (
          <View style={[styles.badge, { backgroundColor: item.color + '20' }]}>
            <Text style={[styles.badgeText, { color: item.color }]}>{item.badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Explore & More</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* User Profile Card */}
        <TouchableOpacity 
          style={[styles.userCard, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/settings')}
          activeOpacity={0.8}
        >
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {(userName ? userName.charAt(0) : 'U').toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>{userName || 'LifeSync User'}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userEmail || 'user@lifesync.app'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        {/* Section 1: Core Dashboards */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CORE DASHBOARDS</Text>
        <View style={styles.grid}>
          {coreDashboards.map(renderCard)}
        </View>

        {/* Section 2: Lifestyle & Productivity */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: theme.spacing.md }]}>LIFESTYLE & INSIGHTS</Text>
        <View style={styles.grid}>
          {lifestyleFeatures.map(renderCard)}
        </View>

        {/* Section 3: Settings & Tools */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: theme.spacing.md }]}>ACCOUNT & APP</Text>
        <View style={styles.grid}>
          {toolItems.map(renderCard)}
          <TouchableOpacity 
            style={[styles.menuCard, { backgroundColor: colors.surface }]}
            onPress={() => setIsLogoutModalVisible(true)}
            activeOpacity={0.75}
          >
            <View style={styles.cardTop}>
              <View style={[styles.iconContainer, { backgroundColor: '#EF444418' }]}>
                <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              </View>
            </View>
            <Text style={[styles.menuTitle, { color: '#EF4444' }]}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    marginVertical: theme.spacing.md,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  userEmail: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.regular,
    marginTop: 2,
    includeFontPadding: false,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: theme.spacing.sm,
    marginLeft: 4,
    marginTop: theme.spacing.sm,
    includeFontPadding: false,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: itemWidth,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    marginBottom: theme.spacing.md,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  menuTitle: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  bottomPadding: {
    height: 120,
  }
});
