import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { useAppStore } from '../../src/store/useAppStore';
import { useTaskStore } from '../../src/store/useTaskStore';
import { useHabitStore } from '../../src/store/useHabitStore';
import { useFinanceStore } from '../../src/store/useFinanceStore';
import { useGoalStore } from '../../src/store/useGoalStore';

export default function HomeScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  
  const { userName, setThemePreference } = useAppStore();
  const { tasks, loadTasks, toggleTaskCompletion } = useTaskStore();
  const { habits, completions, loadHabits } = useHabitStore();
  const { expenses, budgets, loadFinances } = useFinanceStore();
  const { goals, contributions, loadGoals } = useGoalStore();

  useEffect(() => {
    loadTasks();
    loadHabits();
    loadFinances();
    loadGoals();
  }, []);

  const toggleTheme = () => {
    setThemePreference(isDark ? 'light' : 'dark');
  };

  // Dynamic greeting based on current local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 22) return 'Good Evening';
    return 'Good Night';
  }, []);

  const greetingIcon = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return '☀️';
    if (hour >= 12 && hour < 17) return '🌤️';
    if (hour >= 17 && hour < 22) return '🌇';
    return '🌙';
  }, []);

  const displayName = userName ? userName : 'Friend';
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  // Tasks calculations
  const todayTasks = useMemo(() => tasks.slice(0, 5), [tasks]);
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasksCount = tasks.length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Finance calculations
  const totalSpentThisMonth = useMemo(() => {
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return expenses
      .filter(e => e.date && e.date.startsWith(currentMonthPrefix))
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const totalBudgetThisMonth = useMemo(() => {
    return budgets.reduce((sum, b) => sum + (Number(b.limit) || 0), 0);
  }, [budgets]);

  const budgetPercent = totalBudgetThisMonth > 0 ? Math.min(Math.round((totalSpentThisMonth / totalBudgetThisMonth) * 100), 100) : 0;

  // Goal calculations
  const topGoal = goals[0] || null;
  const topGoalSaved = useMemo(() => {
    if (!topGoal) return 0;
    return contributions
      .filter(c => c.goalId === topGoal.id)
      .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  }, [topGoal, contributions]);

  const topGoalPercent = topGoal && topGoal.target > 0 
    ? Math.min(Math.round((topGoalSaved / topGoal.target) * 100), 100) 
    : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {greeting} {greetingIcon}
            </Text>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={[styles.date, { color: colors.textSecondary }]}>{todayStr}</Text>
          </View>
          
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn} onPress={toggleTheme}>
              <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/settings')}>
              <Ionicons name="settings-outline" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Progress Card */}
        <View style={[styles.progressCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: '#34D399' }]} />
            </View>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>
          <Text style={styles.progressSubtitle}>
            {totalTasksCount > 0 
              ? `${completedTasksCount} of ${totalTasksCount} tasks completed` 
              : "No tasks created for today yet"}
          </Text>
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Tasks</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {todayTasks.length > 0 ? (
              todayTasks.map((task) => (
                <TouchableOpacity 
                  key={task.id} 
                  style={styles.taskItem}
                  onPress={() => toggleTaskCompletion(task.id)}
                >
                  <Ionicons 
                    name={task.completed ? "checkmark-circle" : "radio-button-off"} 
                    size={24} 
                    color={task.completed ? "#10B981" : colors.primary} 
                  />
                  <Text 
                    style={[
                      styles.taskText, 
                      { 
                        color: task.completed ? colors.textTertiary : colors.text,
                        textDecorationLine: task.completed ? 'line-through' : 'none'
                      }
                    ]}
                  >
                    {task.title}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="checkbox-outline" size={36} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No tasks scheduled yet</Text>
                <TouchableOpacity 
                  style={[styles.addInlineBtn, { backgroundColor: colors.primary + '15' }]} 
                  onPress={() => router.push('/(modals)/add-task')}
                >
                  <Ionicons name="add" size={16} color={colors.primary} />
                  <Text style={[styles.addInlineText, { color: colors.primary }]}>Add Task</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Habit Streak Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Habit Tracker</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/habits')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {habits.length > 0 ? (
              habits.slice(0, 3).map((habit) => {
                const habitCompletionsCount = completions.filter(c => c.habitId === habit.id).length;
                return (
                  <View key={habit.id} style={styles.habitItem}>
                    <View style={[styles.habitIcon, { backgroundColor: habit.color + '20' }]}>
                      <Ionicons name={(habit.icon as any) || "leaf"} size={18} color={habit.color || colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.habitName, { color: colors.text }]}>{habit.name}</Text>
                      <Text style={[styles.habitSub, { color: colors.textSecondary }]}>{habit.target || 'Daily'}</Text>
                    </View>
                    <Text style={[styles.habitDays, { color: colors.text }]}>
                      {habitCompletionsCount} <Text style={{ fontSize: 12, color: colors.textSecondary }}>done</Text>
                    </Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="leaf-outline" size={36} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No habits tracked yet</Text>
                <TouchableOpacity 
                  style={[styles.addInlineBtn, { backgroundColor: colors.primary + '15' }]} 
                  onPress={() => router.push('/(modals)/add-habit')}
                >
                  <Ionicons name="add" size={16} color={colors.primary} />
                  <Text style={[styles.addInlineText, { color: colors.primary }]}>Create Habit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Financial Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Financial Summary</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/finance')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>Manage</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.financeHeader}>
              <View>
                <Text style={[styles.financeSub, { color: colors.textSecondary }]}>Spent This Month</Text>
                <Text style={[styles.financeAmount, { color: colors.text }]}>₹{totalSpentThisMonth.toLocaleString()}</Text>
                {totalBudgetThisMonth > 0 ? (
                  <Text style={[styles.financeSub, { color: colors.textSecondary }]}>
                    {budgetPercent}% of monthly budget (₹{totalBudgetThisMonth.toLocaleString()})
                  </Text>
                ) : (
                  <Text style={[styles.financeSub, { color: colors.textSecondary }]}>
                    {expenses.length} transaction{expenses.length === 1 ? '' : 's'} recorded
                  </Text>
                )}
              </View>
              <TouchableOpacity 
                style={[styles.addQuickBtn, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/(modals)/add-expense')}
              >
                <Ionicons name="add" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Goal Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Goal Progress</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/goals')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {topGoal ? (
              <View>
                <View style={styles.goalHeader}>
                  <View>
                    <Text style={[styles.goalName, { color: colors.text }]}>{topGoal.name}</Text>
                    <Text style={[styles.goalAmount, { color: colors.textSecondary }]}>
                      ₹{topGoalSaved.toLocaleString()} <Text style={{ color: colors.textTertiary }}>/ ₹{topGoal.target.toLocaleString()}</Text>
                    </Text>
                  </View>
                  <View style={[styles.goalImgPlaceholder, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name={(topGoal.icon as any) || "flag"} size={22} color={colors.primary} />
                  </View>
                </View>
                <View style={styles.goalProgressRow}>
                  <View style={[styles.goalProgressBarBg, { backgroundColor: colors.border }]}>
                    <View style={[styles.goalProgressBarFill, { width: `${topGoalPercent}%`, backgroundColor: colors.primary }]} />
                  </View>
                  <Text style={[styles.goalPercent, { color: colors.text }]}>{topGoalPercent}%</Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="flag-outline" size={36} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No active saving goals</Text>
                <TouchableOpacity 
                  style={[styles.addInlineBtn, { backgroundColor: colors.primary + '15' }]} 
                  onPress={() => router.push('/(modals)/add-goal')}
                >
                  <Ionicons name="add" size={16} color={colors.primary} />
                  <Text style={[styles.addInlineText, { color: colors.primary }]}>Set Goal</Text>
                </TouchableOpacity>
              </View>
            )}
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
  headerTextContainer: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  greeting: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 2,
  },
  name: {
    fontSize: 26,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 2,
  },
  date: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(128,128,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  progressTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressPercent: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.bold,
  },
  progressSubtitle: {
    color: 'rgba(255,255,255,0.85)',
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
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
  },
  viewAll: {
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
    paddingVertical: 10,
    gap: 12,
  },
  taskText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    flex: 1,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  habitIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitName: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  habitSub: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.regular,
  },
  habitDays: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
  },
  financeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financeSub: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  financeAmount: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
    marginVertical: 4,
  },
  addQuickBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 2,
  },
  goalAmount: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  goalImgPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
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
    borderRadius: 4,
  },
  goalPercent: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    gap: 6,
  },
  emptyText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  addInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4,
    marginTop: 6,
  },
  addInlineText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
});
