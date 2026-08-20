import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore } from '../src/store/useTaskStore';
import { useHabitStore } from '../src/store/useHabitStore';
import { useFinanceStore } from '../src/store/useFinanceStore';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function AgendaScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { tasks, toggleTaskCompletion } = useTaskStore();
  const { habits, toggleHabitCompletion } = useHabitStore();
  const { expenses } = useFinanceStore();

  // Generate a dynamic rolling 14-day date strip centered around today
  const stripDates = useMemo(() => {
    const dates: Date[] = [];
    const base = new Date();
    // Start 5 days in the past, end 8 days in the future
    for (let i = -5; i <= 8; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  const selectedDateStr = selectedDate.toDateString();
  const isToday = selectedDateStr === new Date().toDateString();

  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const fullDateTitle = selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });

  // Filter tasks for the selected date
  const dailyTasks = useMemo(() => {
    return tasks.filter(t => {
      if (!t.dueDate) {
        return isToday; // Unscheduled tasks show on today
      }
      return new Date(t.dueDate).toDateString() === selectedDateStr;
    });
  }, [tasks, selectedDateStr, isToday]);

  // Filter habits for the selected day of week
  const dayNameShort = selectedDate.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue", etc.
  const dateIsoString = selectedDate.toISOString().split('T')[0];

  const dailyHabits = useMemo(() => {
    return habits.filter(h => {
      if (!h.frequency || h.frequency.length === 0) return true;
      return h.frequency.includes(dayNameShort);
    });
  }, [habits, dayNameShort]);

  // Filter expenses for selected date
  const dailyExpenses = useMemo(() => {
    return expenses.filter(e => {
      if (!e.date) return false;
      return new Date(e.date).toDateString() === selectedDateStr;
    });
  }, [expenses, selectedDateStr]);

  const totalExpenseAmount = dailyExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const handleSelectDate = (d: Date) => {
    Haptics.selectionAsync();
    setSelectedDate(d);
  };

  const handleJumpToToday = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(new Date());
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{monthName}</Text>
        </View>
        {!isToday ? (
          <TouchableOpacity style={[styles.todayBadge, { backgroundColor: colors.primary + '20' }]} onPress={handleJumpToToday}>
            <Text style={[styles.todayBadgeText, { color: colors.primary }]}>Today</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Dynamic Horizontal Date Strip */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.stripScrollContent}
          style={styles.stripContainer}
        >
          {stripDates.map((date, idx) => {
            const isSelected = date.toDateString() === selectedDateStr;
            const isDateToday = date.toDateString() === new Date().toDateString();
            const dayLetter = date.toLocaleDateString('en-US', { weekday: 'narrow' });
            const dayNum = date.getDate();

            return (
              <TouchableOpacity 
                key={idx} 
                style={[
                  styles.dayCol,
                  isSelected && [styles.selectedDayCol, { backgroundColor: colors.primary }],
                  !isSelected && isDateToday && [styles.todayDayCol, { borderColor: colors.primary, backgroundColor: colors.surface }]
                ]}
                onPress={() => handleSelectDate(date)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.dayLetterText, 
                  { color: isSelected ? '#FFF' : colors.textSecondary }
                ]}>
                  {dayLetter}
                </Text>
                <Text style={[
                  styles.dayNumText, 
                  { color: isSelected ? '#FFF' : colors.text }
                ]}>
                  {dayNum}
                </Text>
                {isDateToday && !isSelected && (
                  <View style={[styles.todayDot, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Date Header */}
        <View style={styles.dateTitleRow}>
          <Text style={[styles.fullDateTitle, { color: colors.text }]}>{fullDateTitle}</Text>
          {isToday && (
            <View style={[styles.currentDayPill, { backgroundColor: colors.primary + '18' }]}>
              <Text style={[styles.currentDayPillText, { color: colors.primary }]}>Today</Text>
            </View>
          )}
        </View>

        {/* 2-Column Overview Summary Cards */}
        <View style={styles.overviewGrid}>
          {/* Tasks Column */}
          <View style={[styles.overviewBox, { backgroundColor: colors.surface }]}>
            <View style={styles.overviewHeader}>
              <View style={[styles.overviewIconBox, { backgroundColor: colors.primary + '18' }]}>
                <Ionicons name="checkmark-done" size={16} color={colors.primary} />
              </View>
              <Text style={[styles.boxTitle, { color: colors.textSecondary }]}>Tasks ({dailyTasks.length})</Text>
            </View>
            {dailyTasks.length > 0 ? (
              <Text style={[styles.overviewItemText, { color: colors.text }]} numberOfLines={1}>
                {dailyTasks[0].title}
              </Text>
            ) : (
              <Text style={[styles.overviewEmptyText, { color: colors.textTertiary }]}>No tasks scheduled</Text>
            )}
          </View>
          
          {/* Habits Column */}
          <View style={[styles.overviewBox, { backgroundColor: colors.surface }]}>
            <View style={styles.overviewHeader}>
              <View style={[styles.overviewIconBox, { backgroundColor: '#10B98118' }]}>
                <Ionicons name="leaf" size={16} color="#10B981" />
              </View>
              <Text style={[styles.boxTitle, { color: colors.textSecondary }]}>Habits ({dailyHabits.length})</Text>
            </View>
            {dailyHabits.length > 0 ? (
              <Text style={[styles.overviewItemText, { color: colors.text }]} numberOfLines={1}>
                {dailyHabits[0].title}
              </Text>
            ) : (
              <Text style={[styles.overviewEmptyText, { color: colors.textTertiary }]}>No habits tracking</Text>
            )}
          </View>
        </View>

        {/* Section 1: Tasks for Day */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <Ionicons name="checkbox-outline" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tasks for the Day</Text>
            </View>
            <TouchableOpacity 
              style={[styles.addInlineBtn, { backgroundColor: colors.primary + '15' }]}
              onPress={() => router.push('/(modals)/add-task')}
            >
              <Ionicons name="add" size={16} color={colors.primary} />
              <Text style={[styles.addInlineText, { color: colors.primary }]}>Add</Text>
            </TouchableOpacity>
          </View>

          {dailyTasks.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="checkmark-circle-outline" size={32} color={colors.textTertiary} />
              <Text style={[styles.emptyCardTitle, { color: colors.text }]}>No tasks for this day</Text>
              <Text style={[styles.emptyCardSub, { color: colors.textSecondary }]}>Tap Add above to schedule a new task</Text>
            </View>
          ) : (
            <View style={[styles.cardList, { backgroundColor: colors.surface }]}>
              {dailyTasks.map((task, index) => {
                const isCompleted = task.status === 'completed';
                return (
                  <TouchableOpacity 
                    key={task.id} 
                    style={[
                      styles.taskRow, 
                      index < dailyTasks.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      toggleTaskCompletion(task.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.taskCheckbox, 
                      { borderColor: isCompleted ? colors.primary : colors.textTertiary },
                      isCompleted && { backgroundColor: colors.primary }
                    ]}>
                      {isCompleted && <Ionicons name="checkmark" size={14} color="#FFF" />}
                    </View>
                    <View style={styles.taskTextCol}>
                      <Text style={[
                        styles.taskTitle, 
                        { color: isCompleted ? colors.textTertiary : colors.text },
                        isCompleted && styles.completedText
                      ]}>
                        {task.title}
                      </Text>
                      {task.category && (
                        <Text style={[styles.taskCategory, { color: colors.primary }]}>
                          {task.category}
                        </Text>
                      )}
                    </View>
                    {task.priority && (
                      <View style={[
                        styles.priorityBadge, 
                        { 
                          backgroundColor: task.priority === 'Urgent' ? '#EF444420' : 
                                           task.priority === 'High' ? '#F59E0B20' : '#3B82F620' 
                        }
                      ]}>
                        <Text style={[
                          styles.priorityBadgeText,
                          { 
                            color: task.priority === 'Urgent' ? '#EF4444' : 
                                   task.priority === 'High' ? '#F59E0B' : '#3B82F6' 
                          }
                        ]}>
                          {task.priority}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Section 2: Habits for Day */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <Ionicons name="leaf-outline" size={20} color="#10B981" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Habits</Text>
            </View>
            <TouchableOpacity 
              style={[styles.addInlineBtn, { backgroundColor: '#10B98115' }]}
              onPress={() => router.push('/(modals)/add-habit')}
            >
              <Ionicons name="add" size={16} color="#10B981" />
              <Text style={[styles.addInlineText, { color: '#10B981' }]}>Add</Text>
            </TouchableOpacity>
          </View>

          {dailyHabits.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="leaf-outline" size={32} color={colors.textTertiary} />
              <Text style={[styles.emptyCardTitle, { color: colors.text }]}>No habits tracking today</Text>
              <Text style={[styles.emptyCardSub, { color: colors.textSecondary }]}>Build consistent daily routines</Text>
            </View>
          ) : (
            <View style={[styles.cardList, { backgroundColor: colors.surface }]}>
              {dailyHabits.map((habit, index) => {
                const isCompleted = habit.completedDates?.includes(dateIsoString);
                return (
                  <TouchableOpacity 
                    key={habit.id} 
                    style={[
                      styles.habitRow, 
                      index < dailyHabits.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      toggleHabitCompletion(habit.id, dateIsoString);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.habitIconBox, 
                      { backgroundColor: (habit.color || '#10B981') + '18' }
                    ]}>
                      <Ionicons name={(habit.icon as any) || 'leaf'} size={18} color={habit.color || '#10B981'} />
                    </View>
                    <View style={styles.habitTextCol}>
                      <Text style={[styles.habitTitle, { color: colors.text }]}>{habit.title}</Text>
                      <Text style={[styles.habitSub, { color: colors.textSecondary }]}>
                        Target: {habit.targetDays || 1} / day
                      </Text>
                    </View>
                    <View style={[
                      styles.habitCheckCircle,
                      { borderColor: isCompleted ? '#10B981' : colors.textTertiary },
                      isCompleted && { backgroundColor: '#10B981' }
                    ]}>
                      {isCompleted && <Ionicons name="checkmark" size={14} color="#FFF" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Section 3: Expenses for Day */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <Ionicons name="wallet-outline" size={20} color="#F59E0B" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Expenses {totalExpenseAmount > 0 ? `(₹${totalExpenseAmount.toLocaleString()})` : ''}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.addInlineBtn, { backgroundColor: '#F59E0B15' }]}
              onPress={() => router.push('/(modals)/add-expense')}
            >
              <Ionicons name="add" size={16} color="#F59E0B" />
              <Text style={[styles.addInlineText, { color: '#F59E0B' }]}>Add</Text>
            </TouchableOpacity>
          </View>
          
          {dailyExpenses.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="wallet-outline" size={32} color={colors.textTertiary} />
              <Text style={[styles.emptyCardTitle, { color: colors.text }]}>No expenses on this date</Text>
              <Text style={[styles.emptyCardSub, { color: colors.textSecondary }]}>Track spending to stay on budget</Text>
            </View>
          ) : (
            <View style={[styles.cardList, { backgroundColor: colors.surface }]}>
              {dailyExpenses.map((expense, index) => (
                <View 
                  key={expense.id} 
                  style={[
                    styles.expenseRow,
                    index < dailyExpenses.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                  ]}
                >
                  <View style={styles.expenseLeft}>
                    <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                    <View>
                      <Text style={[styles.expenseName, { color: colors.text }]}>
                        {expense.note || expense.category}
                      </Text>
                      <Text style={[styles.expenseSub, { color: colors.textSecondary }]}>
                        {expense.category} • {expense.paymentMethod || 'Cash'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.expenseAmount, { color: colors.text }]}>
                    ₹{expense.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  headerCenter: {
    alignItems: 'center',
  },
  iconBtn: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  todayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  todayBadgeText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  stripContainer: {
    marginVertical: theme.spacing.md,
  },
  stripScrollContent: {
    gap: 8,
    paddingHorizontal: 2,
  },
  dayCol: {
    width: 48,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(128,128,128,0.06)',
  },
  selectedDayCol: {
    elevation: 4,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  todayDayCol: {
    borderWidth: 1.5,
  },
  dayLetterText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 4,
    includeFontPadding: false,
  },
  dayNumText: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  dateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xs,
    gap: 8,
  },
  fullDateTitle: {
    fontSize: 22,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  currentDayPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  currentDayPillText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  overviewBox: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    elevation: 1,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  overviewIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxTitle: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.semiBold,
    includeFontPadding: false,
  },
  overviewItemText: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  overviewEmptyText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.regular,
    includeFontPadding: false,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    marginLeft: 2,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  addInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addInlineText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  emptyCard: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyCardTitle: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    marginTop: 4,
    includeFontPadding: false,
  },
  emptyCardSub: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.regular,
    includeFontPadding: false,
  },
  cardList: {
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.md,
    elevation: 1,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  taskCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskTextCol: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.medium,
    includeFontPadding: false,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  taskCategory: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.regular,
    marginTop: 2,
    includeFontPadding: false,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  priorityBadgeText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  habitIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitTextCol: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  habitSub: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.regular,
    marginTop: 2,
    includeFontPadding: false,
  },
  habitCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  expenseName: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  expenseSub: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.regular,
    marginTop: 2,
    includeFontPadding: false,
  },
  expenseAmount: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  bottomPadding: {
    height: 80,
  }
});
