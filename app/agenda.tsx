import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AgendaScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();

  // Mock Date Info
  const today = new Date();
  const monthName = today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const fullDate = today.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });

  // Generate week centered on today for mockup
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekDates = [10, 11, 12, 13, 14, 15, 16]; // Hardcoded to match mockup
  const selectedDate = 11;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{monthName}</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Week Strip */}
        <View style={styles.weekStrip}>
          {weekDays.map((day, idx) => {
            const date = weekDates[idx];
            const isSelected = date === selectedDate;
            return (
              <View key={idx} style={styles.dayCol}>
                <Text style={[styles.dayText, { color: isSelected ? '#4F46E5' : colors.textSecondary }]}>{day}</Text>
                <TouchableOpacity 
                  style={[
                    styles.dateCircle, 
                    isSelected && { backgroundColor: '#4F46E5' }
                  ]}
                >
                  <Text style={[styles.dateText, { color: isSelected ? '#FFF' : colors.text }]}>
                    {date}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <Text style={[styles.fullDateTitle, { color: colors.text }]}>{fullDate}</Text>

        {/* 2-Column Overview */}
        <View style={styles.overviewGrid}>
          {/* Tasks Column */}
          <View style={[styles.overviewBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.boxTitle, { color: colors.textSecondary }]}>Tasks</Text>
            <View style={styles.overviewItem}>
              <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.overviewItemText, { color: colors.text }]} numberOfLines={1}>Workout</Text>
            </View>
          </View>
          
          {/* Habits Column */}
          <View style={[styles.overviewBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.boxTitle, { color: colors.textSecondary }]}>Habits</Text>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewItemText, { color: colors.text }]} numberOfLines={1}>Coding</Text>
            </View>
            <View style={styles.habitUnderline} />
          </View>
        </View>

        {/* Expenses List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Expenses</Text>
          
          <View style={[styles.expensesCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.expenseRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <View style={styles.expenseLeft}>
                <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                <Text style={[styles.expenseName, { color: colors.text }]}>Lunch</Text>
              </View>
              <Text style={[styles.expenseAmount, { color: colors.text }]}>₹500</Text>
            </View>

            <View style={styles.expenseRow}>
              <View style={styles.expenseLeft}>
                <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                <Text style={[styles.expenseName, { color: colors.text }]}>Groceries</Text>
              </View>
              <Text style={[styles.expenseAmount, { color: colors.text }]}>₹320</Text>
            </View>
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
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  dayCol: {
    alignItems: 'center',
    gap: 12,
  },
  dayText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
  fullDateTitle: {
    fontSize: 22,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.lg,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  overviewBox: {
    flex: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
  },
  boxTitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginBottom: theme.spacing.md,
  },
  overviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  overviewItemText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
  habitUnderline: {
    marginTop: 4,
    height: 3,
    width: 40,
    backgroundColor: '#10B981', // Green line from mockup
    borderRadius: 1.5,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginBottom: theme.spacing.md,
  },
  expensesCard: {
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseName: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
  expenseAmount: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
