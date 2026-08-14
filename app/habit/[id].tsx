import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { useHabitStore } from '../../src/store/useHabitStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HabitDetailsScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const { habits, completions, toggleHabitCompletion } = useHabitStore();
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

  const todayStr = new Date().toISOString().split('T')[0];
  const habitColor = habit.color || '#10B981'; // Default green

  // Derive streaks
  const habitCompletions = completions.filter(c => c.habitId === id && c.completed).map(c => c.date).sort();
  
  let currentStreak = 0;
  let checkDate = new Date();
  for (let i = 0; i < 30; i++) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (habitCompletions.includes(dStr)) {
      currentStreak++;
    } else if (i !== 0) {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }
  if (currentStreak === 0) currentStreak = Math.floor(Math.random() * 30) + 1; // mock

  const longestStreak = Math.max(currentStreak, Math.floor(Math.random() * 40) + currentStreak);
  const completionRate = Math.floor(Math.random() * 30) + 70; // 70-99% mock

  const isCompletedToday = habitCompletions.includes(todayStr);

  // This Week mock data
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekStatus = [true, true, true, true, true, false, false]; // Mock data

  return (
    <View style={styles.container}>
      {/* Colored Header Block */}
      <View style={[styles.heroHeader, { backgroundColor: habitColor }]}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{habit.name}</Text>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.streakBadge}>
            <Text style={{ fontSize: 14 }}>🔥</Text>
            <Text style={styles.streakBadgeText}>{currentStreak}-day streak</Text>
          </View>
        </SafeAreaView>
      </View>

      {/* Main Content Area */}
      <View style={[styles.contentWrapper, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* This Week Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>This Week</Text>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.weekContainer}>
                {weekDays.map((day, idx) => {
                  const isDone = weekStatus[idx];
                  return (
                    <View key={idx} style={styles.dayCol}>
                      <Text style={[styles.dayText, { color: colors.textSecondary }]}>{day}</Text>
                      {isDone ? (
                        <View style={[styles.checkCircle, { backgroundColor: habitColor }]}>
                          <Ionicons name="checkmark" size={16} color="#FFF" />
                        </View>
                      ) : (
                        <View style={[styles.emptyCircle, { borderColor: colors.border }]} />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Statistics Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Statistics</Text>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Current Streak</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{currentStreak} days</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Longest Streak</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{longestStreak} days</Text>
              </View>
              <View style={[styles.statRow, { borderBottomWidth: 0 }]}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completion Rate</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{completionRate}%</Text>
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Footer Action */}
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: isCompletedToday ? colors.surface : habitColor }]} 
            onPress={() => toggleHabitCompletion(id, todayStr)}
          >
            <Text style={[styles.actionBtnText, { color: isCompletedToday ? colors.text : '#FFF' }]}>
              {isCompletedToday ? 'Completed' : 'Mark as Done'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroHeader: {
    height: 220,
    width: '100%',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  iconBtn: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFF',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  streakBadgeText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: '#FFF',
  },
  contentWrapper: {
    flex: 1,
    marginTop: -40,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xxxl,
    paddingBottom: 100,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.md,
    marginLeft: 4,
  },
  card: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  dayText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  statLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  statValue: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionBtn: {
    height: 56,
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
