import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';
import { useFinanceStore } from '../src/store/useFinanceStore';

export default function BudgetsScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  
  const { budgets, expenses } = useFinanceStore();

  const getBudgetStatus = (percentage: number) => {
    if (percentage > 90) return { color: '#EF4444', text: 'Exceeded' };
    if (percentage >= 70) return { color: '#F59E0B', text: 'Warning' };
    return { color: '#10B981', text: 'Normal' };
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Budgets</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="add" size={26} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.monthSelector}>
          <Text style={[styles.monthText, { color: colors.text }]}>August</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.listCard, { backgroundColor: colors.surface }]}>
          {budgets.map((budget, idx) => {
            const spent = expenses
              .filter(e => e.category === budget.category)
              .reduce((sum, e) => sum + e.amount, 0);
            
            const percentage = budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;
            const cappedPercent = Math.min(percentage, 100);
            const status = getBudgetStatus(percentage);
            
            const isLast = idx === budgets.length - 1;

            return (
              <View key={budget.id} style={[styles.budgetRow, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <View style={styles.budgetHeader}>
                  <Text style={[styles.budgetCategory, { color: colors.text }]}>{budget.category}</Text>
                  <Text style={[styles.percentageText, { color: colors.text }]}>{percentage}%</Text>
                </View>
                
                <Text style={[styles.budgetAmounts, { color: colors.textSecondary }]}>
                  <Text style={{ color: colors.text }}>₹{spent.toLocaleString()}</Text> / ₹{budget.limit.toLocaleString()}
                </Text>
                
                <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                  <View style={[styles.progressBarFill, { backgroundColor: status.color, width: `${cappedPercent}%` }]} />
                </View>
              </View>
            );
          })}

          {budgets.length === 0 && (
            <Text style={{ color: colors.textSecondary, padding: theme.spacing.lg, textAlign: 'center' }}>
              No budgets set.
            </Text>
          )}

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Normal (&lt;70%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Warning (70-90%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Exceeded (&gt;90%)</Text>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconBtn: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
    marginLeft: theme.spacing.xs,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  listCard: {
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
    overflow: 'hidden',
    paddingBottom: theme.spacing.lg,
  },
  budgetRow: {
    paddingVertical: theme.spacing.lg,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  budgetCategory: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
  budgetAmounts: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.md,
  },
  percentageText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  legendContainer: {
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    gap: theme.spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  legendText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  }
});
