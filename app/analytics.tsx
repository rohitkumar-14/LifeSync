import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';
import { useFinanceStore } from '../src/store/useFinanceStore';
import Svg, { Circle } from 'react-native-svg';

export default function AnalyticsScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();

  const { expenses } = useFinanceStore();
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

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

  const chartRadius = 60;
  const strokeWidth = 30;
  const circumference = 2 * Math.PI * chartRadius;
  let currentOffset = 0;

  // Mock data for weekly spending
  const weeklyData = [
    { day: 'Mon', value: 40 },
    { day: 'Tue', value: 30 },
    { day: 'Wed', value: 60 },
    { day: 'Thu', value: 45 },
    { day: 'Fri', value: 80 },
    { day: 'Sat', value: 20 },
    { day: 'Sun', value: 50 },
  ];
  const maxWeeklyValue = Math.max(...weeklyData.map(d => d.value));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Analytics</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.monthSelector}>
          <Text style={[styles.monthText, { color: colors.text }]}>This Month</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Category Distribution */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Category Distribution</Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center' }]}>
            
            <View style={styles.donutContainer}>
              <Svg width="160" height="160" viewBox="0 0 160 160">
                {/* Background Track */}
                <Circle cx="80" cy="80" r={chartRadius} stroke={colors.border} strokeWidth={strokeWidth} fill="none" />
                
                {sortedCategories.map((data, index) => {
                  const percentage = totalSpent > 0 ? (data.value / totalSpent) * 100 : 0;
                  const strokeLength = (percentage / 100) * circumference;
                  const rotateAngle = (currentOffset / 100) * 360 - 90;
                  currentOffset += percentage;
                  
                  return (
                    <Circle
                      key={data.label}
                      cx="80"
                      cy="80"
                      r={chartRadius}
                      stroke={getCategoryColor(data.label, index)}
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeDasharray={`${strokeLength} ${circumference}`}
                      transform={`rotate(${rotateAngle} 80 80)`}
                      strokeLinecap="butt"
                    />
                  );
                })}
              </Svg>
              <View style={styles.donutCenter}>
                <Text style={[styles.donutTotal, { color: colors.text }]}>₹{totalSpent.toLocaleString()}</Text>
                <Text style={[styles.donutLabel, { color: colors.textSecondary }]}>Total</Text>
              </View>
            </View>

            <View style={styles.legendContainer}>
              {sortedCategories.map((data, index) => {
                const percentage = totalSpent > 0 ? Math.round((data.value / totalSpent) * 100) : 0;
                return (
                  <View key={data.label} style={styles.legendRow}>
                    <View style={styles.legendLeft}>
                      <View style={[styles.legendDot, { backgroundColor: getCategoryColor(data.label, index) }]} />
                      <Text style={[styles.legendText, { color: colors.textSecondary }]}>{data.label}</Text>
                    </View>
                    <Text style={[styles.legendPercent, { color: colors.text }]}>{percentage}%</Text>
                  </View>
                );
              })}
              {sortedCategories.length === 0 && (
                <Text style={{ color: colors.textSecondary }}>No data</Text>
              )}
            </View>
          </View>
        </View>

        {/* Weekly Spending */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Spending</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.barChartContainer}>
              {weeklyData.map((data, idx) => {
                const barHeight = (data.value / maxWeeklyValue) * 120; // 120px max height
                return (
                  <View key={idx} style={styles.barWrapper}>
                    <View style={[styles.bar, { height: barHeight, backgroundColor: '#4F46E5' }]} />
                    <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{data.day}</Text>
                  </View>
                );
              })}
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
    width: 44,
  },
  iconBtn: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
  },
  subHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.xs,
  },
  card: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
  },
  donutContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  donutCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutTotal: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
  },
  donutLabel: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  legendContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  legendPercent: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: theme.spacing.md,
  },
  barWrapper: {
    alignItems: 'center',
    width: 32,
  },
  bar: {
    width: 16,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.medium,
    marginTop: 8,
  },
});
