import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Haptics from 'expo-haptics';
import { useFinanceStore } from '../../src/store/useFinanceStore';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Other'];

const budgetSchema = z.object({
  limit: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount').transform(Number).refine(val => val > 0, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export default function SetBudgetModal() {
  const router = useRouter();
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const { addBudget, budgets } = useFinanceStore();

  const { control, handleSubmit, formState: { errors } } = useForm<z.input<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      limit: '',
      category: CATEGORIES[0],
    },
  });

  const onSubmit = async (data: BudgetFormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const monthStr = new Date().toISOString().substring(0, 7); // YYYY-MM
    
    // In a real app we'd probably update if it exists for this month/category, 
    // but we'll keep it simple for now and just add it (or rely on the store's logic)
    await addBudget({
      limit: data.limit,
      category: data.category,
      month: monthStr,
    });
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.headerText, { color: colors.textSecondary }]}>
        Set a monthly spending limit to keep your finances in check.
      </Text>

      <Controller
        control={control}
        name="limit"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Monthly Limit ($)"
            placeholder="1000"
            keyboardType="decimal-pad"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.limit?.message}
            isDark={isDark}
          />
        )}
      />

      <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  {
                    backgroundColor: value === cat ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  onChange(cat);
                }}
              >
                <Text
                  style={{
                    color: value === cat ? colors.white : colors.text,
                    fontFamily: theme.typography.fontFamily.medium,
                  }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      {errors.category && <Text style={[styles.errorText, { color: colors.error }]}>{errors.category.message}</Text>}

      <Button
        title="Set Budget"
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
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.regular,
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
  },
  label: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  chip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.full,
    borderWidth: 1,
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
