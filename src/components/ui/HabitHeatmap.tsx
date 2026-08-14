import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';
import { theme } from '../../theme';
import { useAppColorScheme, useThemeColors } from '../../hooks/useAppColorScheme';

interface HabitHeatmapProps {
  completions: { date: string; completed: boolean }[];
  days: number; // e.g. 60 days
}

export function HabitHeatmap({ completions, days = 60 }: HabitHeatmapProps) {
  const isDark = useAppColorScheme();
  const colors = useThemeColors();

  // Generate last N days
  const data = useMemo(() => {
    const arr = [];
    const today = new Date();
    
    // We want to draw columns of 7 days, so we need to pad the start to align with weeks if we want a true github style.
    // But for a simple horizontal list of squares, we can just do a grid.
    // Let's do a simple 7-row grid (weeks on X axis, days on Y axis)
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const isCompleted = completions.some(c => c.date === dateStr && c.completed);
      arr.push({ date: dateStr, completed: isCompleted, dayOfWeek: d.getDay() });
    }
    return arr;
  }, [completions, days]);

  const CELL_SIZE = 12;
  const CELL_MARGIN = 4;
  const WEEKS = Math.ceil(days / 7) + 1; // Approx
  
  const width = WEEKS * (CELL_SIZE + CELL_MARGIN);
  const height = 7 * (CELL_SIZE + CELL_MARGIN);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>Last {days} Days</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
        <Svg width={width} height={height}>
          {data.map((day, index) => {
            // Simplified grid calculation
            const col = Math.floor(index / 7);
            const row = index % 7;
            
            const x = col * (CELL_SIZE + CELL_MARGIN);
            const y = row * (CELL_SIZE + CELL_MARGIN);
            
            return (
              <Rect
                key={day.date}
                x={x}
                y={y}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={3}
                fill={day.completed ? colors.primary : (isDark ? '#333333' : '#E0E0E0')}
              />
            );
          })}
        </Svg>
      </ScrollView>
    </View>
  );
}

// Needed to import ScrollView for horizontal scrolling
import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  }
});
