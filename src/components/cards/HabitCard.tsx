import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, FadeInUp, FadeOutDown, Layout } from 'react-native-reanimated';
import { Habit } from '../../types';
import { theme } from '../../theme';
import { Card } from '../ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { ProgressRing } from '../ui/ProgressRing';
import * as Haptics from 'expo-haptics';

interface HabitCardProps {
  habit: Habit;
  completedToday: boolean;
  streak: number;
  onPress?: () => void;
  isDark?: boolean;
  index?: number;
}

export const HabitCard = React.memo(({
  habit,
  completedToday,
  streak,
  onPress,
  isDark = false,
}: HabitCardProps) => {
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress) onPress();
      }}
    >
      <Animated.View
        style={animatedStyle}
        entering={FadeInUp.delay((index || 0) * 100).springify().damping(14)}
        exiting={FadeOutDown.springify()}
        layout={Layout.springify()}
      >
        <Card isDark={isDark} variant="elevated" style={styles.container}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: habit.color + '20' }, // 20% opacity hex
            ]}
          >
            <Ionicons name={habit.icon as any} size={24} color={habit.color} />
          </View>
          <View style={styles.content}>
            <Text style={[styles.name, { color: colors.text }]}>{habit.name}</Text>
            <Text style={[styles.streak, { color: colors.textSecondary }]}>
              🔥 {streak} day streak
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <ProgressRing
              progress={completedToday ? 1 : 0}
              size={40}
              strokeWidth={4}
              color={habit.color}
              isDark={isDark}
            />
            {completedToday && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark" size={20} color={habit.color} />
              </View>
            )}
          </View>
        </Card>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  name: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  streak: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.regular,
    marginTop: 2,
  },
  progressContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    position: 'absolute',
  },
});
