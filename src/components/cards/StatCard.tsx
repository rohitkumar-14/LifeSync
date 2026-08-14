import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  progress?: number;
  color?: string;
  onPress?: () => void;
  isDark?: boolean;
}

export const StatCard = React.memo(({
  title,
  value,
  subtitle,
  progress,
  color = theme.colors.light.primary,
  onPress,
  isDark = false,
}: StatCardProps) => {
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container}>
      <Card isDark={isDark} variant="elevated" style={styles.card}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
            {subtitle}
          </Text>
        )}
        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} color={color} isDark={isDark} showLabel />
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  card: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.xs,
  },
  value: {
    fontSize: theme.typography.size.xl,
    fontFamily: theme.typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.regular,
    marginTop: theme.spacing.xs,
  },
  progressContainer: {
    marginTop: theme.spacing.md,
  },
});
