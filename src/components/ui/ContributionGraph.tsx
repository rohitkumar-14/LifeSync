import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { theme } from '../../theme';

interface ContributionGraphProps {
  data: { date: string; count: number }[];
  isDark?: boolean;
}

export const ContributionGraph = ({ data, isDark = false }: ContributionGraphProps) => {
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  // Generate last 70 days (10 weeks * 7 days)
  const days = useMemo(() => {
    const today = new Date();
    const result = [];
    
    // We want the last column to end with today
    // Let's create an array of 70 days ending today
    for (let i = 69; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const entry = data.find(item => item.date.startsWith(dateStr));
      result.push({
        date: dateStr,
        count: entry ? entry.count : 0,
      });
    }
    return result;
  }, [data]);

  // Group into columns of 7 days
  const columns = useMemo(() => {
    const cols = [];
    for (let i = 0; i < days.length; i += 7) {
      cols.push(days.slice(i, i + 7));
    }
    return cols;
  }, [days]);

  const getColor = (count: number) => {
    if (count === 0) return isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    if (count === 1) return isDark ? '#1C3B22' : '#C6E48B'; // Lightest green
    if (count === 2) return isDark ? '#2E6E32' : '#7BC96F';
    if (count === 3) return isDark ? '#3FA142' : '#239A3B';
    return isDark ? '#4CAF50' : '#196127'; // Darkest green
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {columns.map((col, colIdx) => (
          <View key={`col-${colIdx}`} style={styles.column}>
            {col.map((day, rowIdx) => (
              <View
                key={`day-${day.date}`}
                style={[
                  styles.cell,
                  { backgroundColor: getColor(day.count) }
                ]}
              />
            ))}
          </View>
        ))}
      </ScrollView>
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>Less</Text>
        <View style={[styles.legendCell, { backgroundColor: getColor(0) }]} />
        <View style={[styles.legendCell, { backgroundColor: getColor(1) }]} />
        <View style={[styles.legendCell, { backgroundColor: getColor(2) }]} />
        <View style={[styles.legendCell, { backgroundColor: getColor(3) }]} />
        <View style={[styles.legendCell, { backgroundColor: getColor(4) }]} />
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>More</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: theme.spacing.md,
  },
  column: {
    gap: 4,
  },
  cell: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    gap: 4,
  },
  legendText: {
    fontSize: 10,
    marginHorizontal: 4,
  },
  legendCell: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
