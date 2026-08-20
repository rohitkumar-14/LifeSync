import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { useGoalStore } from '../../src/store/useGoalStore';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { SwipeableRow } from '../../src/components/ui/SwipeableRow';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

export default function GoalsScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();

  const { goals, contributions, deleteGoal } = useGoalStore();

  const getGoalIcon = (name: string) => {
    if (name.toLowerCase().includes('macbook')) return { icon: '💻', bg: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5' };
    if (name.toLowerCase().includes('trip') || name.toLowerCase().includes('vacation')) return { icon: '✈️', bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' };
    if (name.toLowerCase().includes('emergency') || name.toLowerCase().includes('fund')) return { icon: '🏥', bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981' };
    if (name.toLowerCase().includes('car') || name.toLowerCase().includes('bike')) return { icon: '🚗', bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' };
    return { icon: '🎯', bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' };
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header with Top-Right Add Goal Button */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Goals</Text>
        <TouchableOpacity 
          onPress={() => router.push('/(modals)/add-goal')} 
          style={[styles.headerAddBtn, { backgroundColor: colors.primary }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {goals.length === 0 ? (
          <EmptyState
            icon="flag-outline"
            title="No goals yet"
            description="Tap the + button in the top right to set your first financial goal."
          />
        ) : (
          goals.map((goal, index) => {
            const currentAmount = contributions
              .filter((c) => c.goalId === goal.id)
              .reduce((sum, c) => sum + c.amount, 0);
            
            const progress = goal.target > 0 ? currentAmount / goal.target : 0;
            const progressPercent = Math.min(Math.round(progress * 100), 100);
            const ui = getGoalIcon(goal.name);

            return (
              <Animated.View
                key={goal.id}
                entering={FadeInUp.delay(index * 80).springify().damping(14)}
                layout={Layout.springify()}
                style={{ marginBottom: theme.spacing.md }}
              >
                <SwipeableRow 
                  onDelete={() => deleteGoal(goal.id)} 
                  onEdit={() => router.push({ pathname: '/(modals)/add-goal', params: { id: goal.id } })}
                  isDark={isDark}
                >
                  <TouchableOpacity 
                    style={[styles.goalCard, { backgroundColor: colors.surface }]}
                    onPress={() => router.push({ pathname: '/(modals)/add-contribution', params: { goalId: goal.id, goalName: goal.name } })}
                    activeOpacity={0.85}
                  >
                    <View style={styles.cardHeader}>
                      <View style={[styles.iconBox, { backgroundColor: ui.bg }]}>
                        <Text style={{ fontSize: 26 }}>{goal.icon || ui.icon}</Text>
                      </View>
                      <View style={styles.goalInfo}>
                        <Text style={[styles.goalName, { color: colors.text }]}>{goal.name}</Text>
                        <Text style={[styles.goalAmount, { color: colors.textSecondary }]}>
                          <Text style={{ color: colors.primary, fontFamily: theme.typography.fontFamily.bold }}>₹{currentAmount.toLocaleString()}</Text>
                          {' / '}₹{goal.target.toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.addFundsBadge}>
                        <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
                        <Text style={[styles.addFundsText, { color: colors.primary }]}>Funds</Text>
                      </View>
                    </View>

                    <View style={styles.progressContainer}>
                      <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                        <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: colors.primary }]} />
                      </View>
                      <Text style={[styles.percentText, { color: colors.textSecondary }]}>{progressPercent}%</Text>
                    </View>
                  </TouchableOpacity>
                </SwipeableRow>
              </Animated.View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  headerAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  goalCard: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 4,
    includeFontPadding: false,
  },
  goalAmount: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    includeFontPadding: false,
  },
  addFundsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 70, 229, 0.08)',
    gap: 4,
  },
  addFundsText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.semiBold,
    includeFontPadding: false,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  percentText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
});
