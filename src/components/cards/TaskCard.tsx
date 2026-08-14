import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, FadeInUp, FadeOutDown, Layout } from 'react-native-reanimated';
import { Task } from '../../types';
import { theme } from '../../theme';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onPress?: () => void;
  isDark?: boolean;
  index?: number;
}

export const TaskCard = React.memo(({ task, onToggle, onPress, isDark = false, index }: TaskCardProps) => {
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={onPress}
    >
      <Animated.View 
        style={animatedStyle}
        entering={FadeInUp.delay((index || 0) * 100).springify().damping(14)}
        exiting={FadeOutDown.springify()}
        layout={Layout.springify()}
      >
        <Card
          isDark={isDark}
          variant="elevated"
          style={[
            styles.container,
            task.completed && { opacity: 0.6 },
          ]}
        >
          <Checkbox
            checked={task.completed}
            onToggle={() => onToggle(task.id)}
            isDark={isDark}
            color={
              task.priority === 'High'
                ? colors.error
                : task.priority === 'Medium'
                ? colors.warning
                : colors.primary
            }
          />
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                { color: colors.text },
                task.completed && {
                  textDecorationLine: 'line-through',
                  color: colors.textSecondary,
                },
              ]}
            >
              {task.title}
            </Text>
            {task.category && (
              <Text style={[styles.category, { color: colors.textSecondary }]}>
                {task.category}
              </Text>
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
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  content: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  title: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  category: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.regular,
    marginTop: 2,
  },
});
