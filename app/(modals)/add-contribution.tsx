import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
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

const contributionSchema = z.object({
  amount: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount')
    .transform(Number)
    .refine(val => val > 0, 'Amount must be greater than 0'),
  note: z.string().optional(),
});

type ContributionFormData = z.infer<typeof contributionSchema>;

export default function AddContributionModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const goalId = params.goalId as string;
  const goalName = params.goalName as string;

  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const addContribution = useGoalStore((state) => state.addContribution);

  const { control, handleSubmit, formState: { errors } } = useForm<z.input<typeof contributionSchema>>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: '',
      note: '',
    },
  });

  const onSubmit = async (data: ContributionFormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addContribution({
      goalId,
      amount: data.amount,
      date: new Date().toISOString().split('T')[0],
      note: data.note,
    });
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.headerText, { color: colors.textSecondary }]}>
        Adding funds to: <Text style={{ color: colors.text, fontFamily: theme.typography.fontFamily.semiBold }}>{goalName}</Text>
      </Text>

      <Controller
        control={control}
        name="amount"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Amount ($)"
            placeholder="50"
            keyboardType="decimal-pad"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.amount?.message}
            isDark={isDark}
          />
        )}
      />

      <Controller
        control={control}
        name="note"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Note (Optional)"
            placeholder="e.g. Weekly transfer"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.note?.message}
            isDark={isDark}
          />
        )}
      />

      <Button
        title="Add Funds"
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
  headerText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.xl,
  },
  saveButton: {
    marginTop: theme.spacing.xl,
  },
});
