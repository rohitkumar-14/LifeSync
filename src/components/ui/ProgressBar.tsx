import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { theme } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  showLabel?: boolean;
  isDark?: boolean;
}

export const ProgressBar = ({
  progress,
  color = theme.colors.light.primary,
  height = 8,
  showLabel = false,
  isDark = false,
}: ProgressBarProps) => {
  const animatedProgress = useSharedValue(0);
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  useEffect(() => {
    animatedProgress.value = withTiming(Math.max(0, Math.min(1, progress)), {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value * 100}%`,
    };
  });

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.track,
          { height, backgroundColor: colors.surfaceHighlight },
        ]}
      >
        <Animated.View
          style={[styles.fill, { height, backgroundColor: color }, animatedStyle]}
        />
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {Math.round(progress * 100)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    width: '100%',
    borderRadius: theme.radius.round,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: theme.radius.round,
  },
  label: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
    marginTop: theme.spacing.xs,
    textAlign: 'right',
  },
});
