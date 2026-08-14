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
    if (name.toLowerCase().includes('trip')) return { icon: '✈️', bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' };
    if (name.toLowerCase().includes('fund')) return { icon: '🏥', bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981' };
    return { icon: '🎯', bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' };
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Goals</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Goals</Text>
        
        {goals.length === 0 ? (
          <EmptyState
            icon="flag"
            title="No goals yet"
            description="Aim high! Tap the + button to set your first financial goal."
          />
        ) : (
          goals.map((goal, index) => {
            const currentAmount = contributions
              .filter((c) => c.goalId === goal.id)
              .reduce((sum, c) => sum + c.amount, 0);
            
            // Mock display data
            const displayAmount = currentAmount > 0 ? currentAmount : goal.target * (Math.random() * 0.8 + 0.1); 
            const progress = displayAmount / goal.target;
            const progressPercent = Math.min(Math.round(progress * 1000) / 10, 100);
            const ui = getGoalIcon(goal.name);

            return (
              <Animated.View
                key={goal.id}
                entering={FadeInUp.delay(index * 100).springify().damping(14)}
                layout={Layout.springify()}
                style={{ marginBottom: theme.spacing.lg }}
              >
                <SwipeableRow 
                  onDelete={() => deleteGoal(goal.id)} 
                  onEdit={() => router.push({ pathname: '/(modals)/add-goal', params: { id: goal.id } })}
                  isDark={isDark}
                >
                  <TouchableOpacity 
                    style={[styles.goalCard, { backgroundColor: colors.surface }]}
                    onPress={() => router.push(`/goal/${goal.id}`)}
                    activeOpacity={0.9}
                  >
                    <View style={styles.cardHeader}>
                      <View style={[styles.iconBox, { backgroundColor: ui.bg }]}>
                        <Text style={{ fontSize: 24 }}>{ui.icon}</Text>
                      </View>
                      <View style={styles.goalInfo}>
                        <Text style={[styles.goalName, { color: colors.text }]}>{goal.name}</Text>
                        <Text style={[styles.goalAmount, { color: colors.textSecondary }]}>
                          <Text style={{ color: colors.textTertiary }}>₹{displayAmount.toLocaleString()} / </Text> 
                          ₹{goal.target.toLocaleString()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.progressContainer}>
                      <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                        <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: '#4F46E5' }]} />
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

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: '#4F46E5' }]} 
        onPress={() => router.push('/(modals)/add-goal')}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 120, // leave space for FAB
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginBottom: theme.spacing.lg,
  },
  goalCard: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 4,
  },
  goalAmount: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
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
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
