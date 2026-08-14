import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { useFinanceStore } from '../../src/store/useFinanceStore';
import Svg, { Circle } from 'react-native-svg';

export default function FinanceScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();

  const { expenses, budgets } = useFinanceStore();

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const budgetProgress = totalBudget > 0 ? totalSpent / totalBudget : 0;
  const progressPercent = Math.min(Math.round(budgetProgress * 100), 100);

  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.keys(categoryTotals)
    .map(key => ({ label: key, value: categoryTotals[key] }))
    .sort((a, b) => b.value - a.value);

  const CATEGORY_COLORS: Record<string, string> = {
    Food: '#4F46E5', // Indigo
    Shopping: '#F59E0B', // Orange
    Transport: '#10B981', // Green
    Bills: '#8B5CF6', // Purple
    Other: '#3B82F6', // Blue
  };

  const getCategoryColor = (category: string, index: number) => {
    if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
    const fallbackColors = ['#4F46E5', '#F59E0B', '#10B981', '#8B5CF6', '#3B82F6'];
    return fallbackColors[index % fallbackColors.length];
  };

  const radius = 40;
  const strokeWidth = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Finance</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(modals)/add-expense')}>
          <Ionicons name="add" size={28} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Overview Section */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.overviewSubtitle, { color: colors.textSecondary }]}>August Overview</Text>
          
          <View style={styles.overviewMain}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.overviewAmount, { color: colors.text }]}>
                ₹{totalSpent.toLocaleString()}
              </Text>
              <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>Total Spending</Text>
              <Text style={[styles.overviewPercentage, { color: colors.textTertiary }]}>{progressPercent}% of monthly budget</Text>
            </View>
            
            {/* Simple Pie Chart Representation */}
            <View style={styles.pieContainer}>
              <Svg width="80" height="80" viewBox="0 0 160 160">
                <Circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                <Circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#4F46E5"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  transform="rotate(-90 80 80)"
                />
              </Svg>
            </View>
          </View>
        </View>

        {/* Top Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Categories</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, paddingVertical: theme.spacing.lg }]}>
            {sortedCategories.map((data, index) => {
              const color = getCategoryColor(data.label, index);
              const percentage = totalSpent > 0 ? Math.round((data.value / totalSpent) * 100) : 0;
              return (
                <View key={index} style={styles.categoryRow}>
                  <View style={{ width: 80 }}>
                    <Text style={[styles.categoryName, { color: colors.text }]}>{data.label}</Text>
                    <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                      <View style={[styles.progressBarFill, { backgroundColor: color, width: `${percentage}%` }]} />
                    </View>
                  </View>
                  <Text style={[styles.categoryPercent, { color: colors.textSecondary, flex: 1, textAlign: 'center' }]}>
                    {percentage}%
                  </Text>
                  <Text style={[styles.categoryAmount, { color: colors.text }]}>
                    ₹{data.value.toLocaleString()}
                  </Text>
                </View>
              );
            })}
            
            {sortedCategories.length === 0 && (
              <Text style={{ color: colors.textSecondary, padding: theme.spacing.md }}>No spending data yet.</Text>
            )}

            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => router.push('/analytics')}>
                <Text style={[styles.linkText, { color: colors.primary }]}>View Analytics</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/expenses')}>
                <Text style={[styles.linkText, { color: colors.primary }]}>View all</Text>
              </TouchableOpacity>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
  },
  addButton: { padding: theme.spacing.xs },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  card: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  overviewSubtitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.md,
  },
  overviewMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overviewAmount: {
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 4,
  },
  overviewPercentage: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.regular,
  },
  pieContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.xs,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  categoryName: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginBottom: 6,
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  categoryPercent: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  categoryAmount: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: theme.spacing.sm,
  },
  linkText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
  }
});
