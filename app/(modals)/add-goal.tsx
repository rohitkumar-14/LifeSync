import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Haptics from 'expo-haptics';
import { useGoalStore } from '../../src/store/useGoalStore';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';

const ICONS = ['🎯', '🏠', '✈️', '🚗', '🎓', '💰', '💍', '💻'];

const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  target: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount').transform(Number).refine(val => val > 0, 'Target must be greater than 0'),
  icon: z.string().min(1, 'Icon is required'),
});

type GoalFormData = z.infer<typeof goalSchema>;

export default function AddGoalModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const { goals, addGoal, updateGoal } = useGoalStore();

  const existingGoal = id ? goals.find(g => g.id === id) : null;

  const { control, handleSubmit, formState: { errors } } = useForm<z.input<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: existingGoal?.name || '',
      target: existingGoal?.target?.toString() || '',
      icon: existingGoal?.icon || ICONS[0],
    },
  });

  const onSubmit = async (data: GoalFormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (id) {
      await updateGoal(id, {
        name: data.name,
        target: data.target,
        icon: data.icon,
      });
    } else {
      await addGoal({
        name: data.name,
        target: data.target,
        icon: data.icon,
      });
    }
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Goal Name"
            placeholder="e.g. New Car"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.name?.message}
            isDark={isDark}
          />
        )}
      />

      <Controller
        control={control}
        name="target"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Target Amount ($)"
            placeholder="10000"
            keyboardType="decimal-pad"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.target?.message}
            isDark={isDark}
          />
        )}
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Icon</Text>
      <Controller
        control={control}
        name="icon"
        render={({ field: { onChange, value } }) => (
          <View style={styles.gridContainer}>
            {ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.gridItem,
                  {
                    backgroundColor: value === icon ? colors.surfaceHighlight : colors.surface,
                    borderColor: value === icon ? colors.primary : colors.border,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  onChange(icon);
                }}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      {errors.icon && <Text style={[styles.errorText, { color: colors.error }]}>{errors.icon.message}</Text>}

      <Button
        title={id ? "Update Goal" : "Create Goal"}
        onPress={handleSubmit(onSubmit)}
        style={styles.saveButton}
        isDark={isDark}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  gridItem: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  saveButton: {
    marginTop: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.typography.size.xs,
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  }
});
