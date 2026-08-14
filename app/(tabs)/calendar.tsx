import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { useTaskStore } from '../../src/store/useTaskStore';
import { useHabitStore } from '../../src/store/useHabitStore';
import { useFinanceStore } from '../../src/store/useFinanceStore';
import { TaskCard } from '../../src/components/cards/TaskCard';
import { HabitCard } from '../../src/components/cards/HabitCard';

export default function CalendarScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  const [selectedDate, setSelectedDate] = useState(new Date());

  const { tasks, toggleTaskCompletion } = useTaskStore();
  const { habits, toggleHabitCompletion } = useHabitStore();
  const { expenses } = useFinanceStore();

  // Generate a week of dates around the selected date
  const weekDates = useMemo(() => {
    const dates = [];
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - 3);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [selectedDate]);

  const selectedDateStr = selectedDate.toDateString();

  const dailyTasks = tasks.filter(t => 
    (!t.dueDate && selectedDateStr === new Date().toDateString()) || 
    (t.dueDate && new Date(t.dueDate).toDateString() === selectedDateStr)
  );

  // Simplified: show all habits, but their completion state is based on selectedDate
  const dailyHabits = habits; 

  const dailyExpenses = expenses.filter(e => new Date(e.date).toDateString() === selectedDateStr);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Calendar</Text>
      </View>

      <View style={[styles.calendarStrip, { borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stripContent}>
          {weekDates.map((date, i) => {
            const isSelected = date.toDateString() === selectedDateStr;
            const isToday = date.toDateString() === new Date().toDateString();
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNumber = date.getDate();

            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dateBox,
                  isSelected && { backgroundColor: colors.primary },
                  !isSelected && isToday && { borderColor: colors.primary, borderWidth: 1 }
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[styles.dayName, { color: isSelected ? colors.white : colors.textSecondary }]}>
                  {dayName}
                </Text>
                <Text style={[styles.dayNumber, { color: isSelected ? colors.white : colors.text }]}>
                  {dayNumber}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tasks</Text>
          </View>
          {dailyTasks.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No tasks for this day.</Text>
          ) : (
            dailyTasks.map(task => (
              <View key={task.id} style={{ marginBottom: theme.spacing.sm }}>
                <TaskCard task={task} onToggle={toggleTaskCompletion} isDark={isDark} />
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="leaf" size={20} color={colors.success} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Habits</Text>
          </View>
          {dailyHabits.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No habits tracking yet.</Text>
          ) : (
            dailyHabits.map(habit => (
              <View key={habit.id} style={{ marginBottom: theme.spacing.sm }}>
                <HabitCard 
                  habit={habit} 
                  dateStr={selectedDate.toISOString().split('T')[0]} 
                  onToggle={toggleHabitCompletion} 
                  isDark={isDark} 
                />
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="wallet" size={20} color={colors.error} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Expenses</Text>
          </View>
          {dailyExpenses.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No expenses on this day.</Text>
          ) : (
            dailyExpenses.map(expense => (
              <View key={expense.id} style={[styles.expenseRow, { backgroundColor: colors.surface }]}>
                <View style={[styles.expenseIcon, { backgroundColor: colors.error + '20' }]}>
                  <Ionicons name="card" size={20} color={colors.error} />
                </View>
                <View style={styles.expenseDetails}>
                  <Text style={[styles.expenseCategory, { color: colors.text }]}>{expense.category}</Text>
                  {expense.note ? <Text style={[styles.expenseNote, { color: colors.textSecondary }]}>{expense.note}</Text> : null}
                </View>
                <Text style={[styles.expenseAmount, { color: colors.text }]}>${expense.amount.toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>
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
    fontSize: theme.typography.size.xxl,
    fontFamily: theme.typography.fontFamily.bold,
  },
  calendarStrip: {
    borderBottomWidth: 1,
    paddingBottom: theme.spacing.md,
  },
  stripContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  dateBox: {
    width: 60,
    height: 70,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayName: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.bold,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.bold,
    marginLeft: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.regular,
    fontStyle: 'italic',
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.sm,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  expenseNote: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.regular,
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
});
