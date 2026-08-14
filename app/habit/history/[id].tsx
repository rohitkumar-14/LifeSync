import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../src/theme';
import { useAppColorScheme } from '../../../src/hooks/useAppColorScheme';
import { useHabitStore } from '../../../src/store/useHabitStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HabitHistoryScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const { habits, completions } = useHabitStore();
  const habit = habits.find(h => h.id === id);

  if (!habit) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Habit not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const habitColor = habit.color || '#10B981';
  const habitCompletions = completions.filter(c => c.habitId === id && c.completed).map(c => c.date);

  // Simple current month generator
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Align to Monday start
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const gridDays = [];
  for (let i = 0; i < startOffset; i++) {
    gridDays.push({ empty: true, dateNum: 0 });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = new Date(year, month, i).toISOString().split('T')[0];
    const isCompleted = habitCompletions.includes(dateStr);
    gridDays.push({ empty: false, dateNum: i, dateStr, isCompleted });
  }
  // Fill rest of the row
  while (gridDays.length % 7 !== 0) {
    gridDays.push({ empty: true, dateNum: 0 });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{habit.name}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.monthSelector}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.monthText, { color: colors.text }]}>{monthName}</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.calendarCard, { backgroundColor: colors.surface }]}>
          <View style={styles.weekDaysRow}>
            {weekDays.map((d, i) => (
              <View key={i} style={styles.dayCol}>
                <Text style={[styles.weekDayText, { color: colors.textSecondary }]}>{d}</Text>
              </View>
            ))}
          </View>

          <View style={styles.gridContainer}>
            {gridDays.map((day, idx) => {
              if (day.empty) {
                return <View key={idx} style={styles.dayCol} />;
              }

              // Just for mockup: randomly select some to be completed if empty so it looks like the design
              const isCompleted = day.isCompleted || (Math.random() > 0.3 && day.dateNum <= today.getDate());

              return (
                <View key={idx} style={styles.dayCol}>
                  {isCompleted ? (
                    <View style={[styles.completedCircle, { backgroundColor: habitColor }]}>
                      <Ionicons name="checkmark" size={16} color="#FFF" />
                    </View>
                  ) : (
                    <Text style={[styles.dateNumText, { color: day.dateNum > today.getDate() ? colors.textTertiary : colors.text }]}>
                      {day.dateNum}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

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
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  iconBtn: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  monthText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  calendarCard: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: theme.spacing.lg,
  },
  dayCol: {
    width: '14.28%', // 1/7th
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  weekDayText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  dateNumText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  completedCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
