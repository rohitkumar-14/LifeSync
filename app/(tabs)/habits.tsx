import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { SwipeableRow } from '../../src/components/ui/SwipeableRow';
import { useHabitStore } from '../../src/store/useHabitStore';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

type Tab = 'All' | 'Today' | 'Completed';

export default function HabitsScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();

  const { habits, completions, toggleHabitCompletion, deleteHabit } = useHabitStore();
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const todayStr = new Date().toISOString().split('T')[0];

  const getStreak = (habitId: string) => {
    let currentStreak = 0;
    const habitCompletions = completions
      .filter((c) => c.habitId === habitId && c.completed)
      .map((c) => c.date);

    let checkDate = new Date();
    while (true) {
      const dateString = checkDate.toISOString().split('T')[0];
      if (habitCompletions.includes(dateString)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return currentStreak;
  };

  const filteredHabits = habits.filter(habit => {
    const isCompletedToday = completions.some(c => c.habitId === habit.id && c.date === todayStr && c.completed);
    if (activeTab === 'Completed') return isCompletedToday;
    if (activeTab === 'Today') return !isCompletedToday;
    return true;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header with Top-Right Add Habit Button */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Habits</Text>
        <TouchableOpacity 
          onPress={() => router.push('/(modals)/add-habit')} 
          style={[styles.headerAddBtn, { backgroundColor: colors.primary }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['All', 'Today', 'Completed'] as Tab[]).map(tab => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.textSecondary }]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.cardGroup, { backgroundColor: colors.surface }]}>
          {filteredHabits.length === 0 ? (
            <EmptyState
              icon="leaf-outline"
              title={`No ${activeTab.toLowerCase()} habits`}
              description="Tap the + button in the top right to start tracking a habit."
            />
          ) : (
            filteredHabits.map((habit, index) => {
              const isCompletedToday = completions.some(
                (c) => c.habitId === habit.id && c.date === todayStr && c.completed
              );
              const streak = getStreak(habit.id);
              const isLast = index === filteredHabits.length - 1;

              return (
                <Animated.View 
                  key={habit.id} 
                  entering={FadeInUp.delay(index * 80).springify().damping(14)}
                  layout={Layout.springify()}
                >
                  <SwipeableRow 
                    onDelete={() => deleteHabit(habit.id)} 
                    onEdit={() => router.push({ pathname: '/(modals)/add-habit', params: { id: habit.id } })}
                    isDark={isDark}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.habitRow, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                      onPress={() => toggleHabitCompletion(habit.id, todayStr)}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
                        <Text style={{ fontSize: 24 }}>{habit.icon}</Text>
                      </View>
                      
                      <View style={styles.habitInfo}>
                        <Text style={[styles.habitName, { color: colors.text }]}>{habit.name}</Text>
                        <View style={styles.streakContainer}>
                          <Ionicons name="flame" size={14} color="#F59E0B" />
                          <Text style={[styles.streakText, { color: colors.textSecondary }]}>
                            {streak} {streak === 1 ? 'day' : 'days'} streak
                          </Text>
                        </View>
                      </View>
                      
                      <TouchableOpacity 
                        style={[
                          styles.checkBtn, 
                          { borderColor: isCompletedToday ? habit.color : colors.border },
                          isCompletedToday && { backgroundColor: habit.color }
                        ]}
                        onPress={() => toggleHabitCompletion(habit.id, todayStr)}
                      >
                        {isCompletedToday && <Ionicons name="checkmark" size={16} color="#FFF" />}
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </SwipeableRow>
                </Animated.View>
              );
            })
          )}
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xl,
  },
  tab: {
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
    includeFontPadding: false,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    left: '10%',
    width: '80%',
    height: 3,
    borderRadius: 1.5,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  cardGroup: {
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
    overflow: 'hidden',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  habitInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  habitName: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 4,
    includeFontPadding: false,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
    includeFontPadding: false,
  },
  checkBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
