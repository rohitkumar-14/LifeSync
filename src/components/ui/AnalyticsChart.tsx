import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { theme } from '../../theme';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface AnalyticsChartProps {
  data: ChartData[];
  total: number;
  isDark?: boolean;
}

const VerticalBar = ({ item, total, index, isDark, maxAmount }: { item: ChartData; total: number; index: number; isDark: boolean; maxAmount: number }) => {
  const height = useSharedValue(0);
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  useEffect(() => {
    height.value = withDelay(
      index * 100,
      withTiming(maxAmount > 0 ? item.value / maxAmount : 0, { duration: 800 })
    );
  }, [maxAmount, item.value]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${height.value * 100}%`,
  }));

  // Get first letter of label for compact x-axis
  const shortLabel = item.label.substring(0, 3);

  return (
    <View style={styles.barWrapper}>
      <Text style={[styles.barValueTop, { color: colors.textSecondary }]}>
        ${item.value >= 1000 ? (item.value / 1000).toFixed(1) + 'k' : item.value.toFixed(0)}
      </Text>
      <View style={[styles.barBackground, { backgroundColor: colors.surfaceHighlight }]}>
        <Animated.View style={[styles.barFill, { backgroundColor: item.color }, animatedStyle]} />
      </View>
      <Text style={[styles.barLabelBottom, { color: colors.text }]}>{shortLabel}</Text>
    </View>
  );
};

export const AnalyticsChart = ({ data, total, isDark = false }: AnalyticsChartProps) => {
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  // Take top 5 categories
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 5);
  const maxAmount = Math.max(...sortedData.map(d => d.value), 1); // Avoid division by 0

  if (sortedData.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Top Categories</Text>
      </View>
      
      <View style={styles.chartArea}>
        {sortedData.map((item, index) => (
          <VerticalBar 
            key={item.label} 
            item={item} 
            total={total} 
            index={index} 
            isDark={isDark} 
            maxAmount={maxAmount} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xxl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.md,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginTop: 2,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180, // Fixed height for the chart area
    paddingTop: 20,
    paddingHorizontal: theme.spacing.xs,
  },
  barWrapper: {
    alignItems: 'center',
    width: 44,
    height: '100%',
  },
  barValueTop: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginBottom: 8,
  },
  barBackground: {
    width: 14,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barLabelBottom: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.medium,
    marginTop: 8,
    textTransform: 'uppercase',
  },
});
