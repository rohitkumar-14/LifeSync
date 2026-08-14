import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Purple Hero Section */}
      <View style={styles.heroSection}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.userInfoRow}>
            <View style={styles.userLeft}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
                style={styles.avatar}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>Arjun Sharma</Text>
                <Text style={styles.userEmail}>you@example.com</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* Main Content Area */}
      <View style={[styles.contentWrapper, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
            
            <TouchableOpacity style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <Ionicons name="person-outline" size={22} color={colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuText, { color: colors.text }]}>Account</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuRow} onPress={() => router.push('/settings')}>
              <View style={styles.menuLeft}>
                <Ionicons name="settings-outline" size={22} color={colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuText, { color: colors.text }]}>Preferences</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <Ionicons name="finger-print-outline" size={22} color={colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuText, { color: colors.text }]}>Biometric</Text>
              </View>
              <View style={styles.menuRight}>
                <Text style={[styles.statusText, { color: '#4F46E5' }]}>On</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <Ionicons name="server-outline" size={22} color={colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuText, { color: colors.text }]}>Data & Storage</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <View style={styles.menuLeft}>
                <Ionicons name="help-circle-outline" size={22} color={colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuText, { color: colors.text }]}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

          </View>

          <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="log-out-outline" size={22} color="#EF4444" style={styles.menuIcon} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: 220,
    width: '100%',
    backgroundColor: '#4F46E5', // Distinct purple from mockup
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  backBtn: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.xs,
    alignSelf: 'flex-start',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  userDetails: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: 'rgba(255,255,255,0.8)',
  },
  contentWrapper: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxxl,
    paddingBottom: 100,
  },
  menuCard: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: theme.spacing.md,
  },
  menuText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginRight: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
  },
  logoutText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#EF4444', // Red for logout
  },
});
