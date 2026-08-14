import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useAppStore } from '../../src/store/useAppStore';

export default function HomeScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const { setThemePreference } = useAppStore();

  const toggleTheme = () => {
    setThemePreference(isDark ? 'light' : 'dark');
  };

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good Morning</Text>
            <Text style={[styles.name, { color: colors.text }]}>Arjun 🔥</Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>{todayStr}</Text>
          </View>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/search')}>
              <Ionicons name="search-outline" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={toggleTheme}>
              <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/settings')}>
              <Ionicons name="person-outline" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: '78%', backgroundColor: '#34D399' }]} />
            </View>
            <Text style={styles.progressPercent}>78%</Text>
          </View>
          <Text style={styles.progressSubtitle}>4 / 5 tasks completed</Text>
        </View>

        {/* Today's Tasks */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Tasks</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {['Workout', 'Read 30 pages', 'Complete React Native project', 'Drink 2L water'].map((task, index) => (
              <TouchableOpacity key={index} style={styles.taskItem}>
                <Ionicons name="radio-button-off" size={22} color="#4F46E5" />
                <Text style={[styles.taskText, { color: colors.text }]}>{task}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Habit Streak */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Habit Streak</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/habits')}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.habitItem}>
              <View style={[styles.habitIcon, { backgroundColor: '#10B98120' }]}>
                <Ionicons name="water" size={16} color="#10B981" />
              </View>
              <Text style={[styles.habitDays, { color: colors.text }]}>18 <Text style={{ fontSize: 12, color: colors.textSecondary }}>days streak</Text></Text>
            </View>
            <View style={styles.habitItem}>
              <View style={[styles.habitIcon, { backgroundColor: '#F59E0B20' }]}>
                <Ionicons name="book" size={16} color="#F59E0B" />
              </View>
              <Text style={[styles.habitDays, { color: colors.text }]}>4 <Text style={{ fontSize: 12, color: colors.textSecondary }}>days streak</Text></Text>
            </View>
          </View>
        </View>

        {/* Financial Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Financial Summary</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, padding: 0 }]}>
            <View style={{ padding: theme.spacing.lg }}>
              <Text style={[styles.financeSub, { color: colors.textSecondary }]}>August Spending</Text>
              <Text style={[styles.financeAmount, { color: colors.text }]}>₹11,350</Text>
              <Text style={[styles.financeSub, { color: colors.textSecondary }]}>76% of monthly budget</Text>
            </View>
            
            {/* SVG Line Chart Mock */}
            <View style={{ height: 100, width: '100%' }}>
              <Svg height="100" width="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                <Defs>
                  <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#4F46E5" stopOpacity="0.3" />
                    <Stop offset="1" stopColor="#4F46E5" stopOpacity="0" />
                  </LinearGradient>
                </Defs>
                <Path d="M0,80 C30,75 50,80 80,70 C110,60 130,75 160,65 C190,55 210,40 240,45 C270,50 290,20 300,20 L300,100 L0,100 Z" fill="url(#grad)" />
                <Path d="M0,80 C30,75 50,80 80,70 C110,60 130,75 160,65 C190,55 210,40 240,45 C270,50 290,20 300,20" fill="none" stroke="#4F46E5" strokeWidth="3" />
                <View style={styles.chartDots}>
                   {/* Decorative dots to match the design */}
                </View>
              </Svg>
            </View>
          </View>
        </View>

        {/* Goal Progress */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Goal Progress</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.goalHeader}>
              <View>
                <Text style={[styles.goalName, { color: colors.text }]}>MacBook</Text>
                <Text style={[styles.goalAmount, { color: colors.textSecondary }]}>₹40,500 <Text style={{color: colors.textTertiary}}>/ ₹120,000</Text></Text>
              </View>
              <View style={[styles.goalImgPlaceholder, { backgroundColor: '#1E293B' }]}>
                <Text style={{fontSize: 20}}>💻</Text>
              </View>
            </View>
            <View style={styles.goalProgressRow}>
              <View style={[styles.goalProgressBarBg, { backgroundColor: colors.border }]}>
                <View style={[styles.goalProgressBarFill, { width: '38.7%' }]} />
              </View>
              <Text style={[styles.goalPercent, { color: colors.text }]}>38.7%</Text>
            </View>
          </View>
        </View>

        {/* Smart Insights */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Smart insights</Text>
          
          <View style={[styles.insightCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.insightIcon, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="fast-food-outline" size={20} color="#F97316" />
            </View>
            <Text style={[styles.insightText, { color: colors.text }]}>
              You spent 18% more on food than last month.
            </Text>
          </View>
          
          <View style={[styles.insightCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.insightIcon, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="code-slash-outline" size={20} color="#4F46E5" />
            </View>
            <Text style={[styles.insightText, { color: colors.text }]}>
              Your coding habit is on a 25-day streak.
            </Text>
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
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 4,
  },
  date: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    backgroundColor: '#4F46E5',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  progressTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  progressBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressPercent: {
    color: '#FFF',
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
  },
  progressSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.md,
  },
  viewAll: {
    color: '#4F46E5',
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  card: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  taskText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  habitIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitDays: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
  },
  financeSub: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  financeAmount: {
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.bold,
    marginVertical: 4,
  },
  chartDots: {
    position: 'absolute',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalName: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 4,
  },
  goalAmount: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  goalImgPlaceholder: {
    width: 60,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalProgressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalProgressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  goalPercent: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    marginBottom: 12,
    gap: 12,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightText: {
    flex: 1,
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    lineHeight: 20,
  }
});
