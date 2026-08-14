import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useFinanceStore } from '../../src/store/useFinanceStore';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Other'];
const PAYMENT_METHODS = ['UPI', 'Card', 'Cash', 'Net Banking'];

const expenseSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount').transform(Number).refine(val => val > 0, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  note: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export default function AddExpenseModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const { expenses, addExpense, updateExpense } = useFinanceStore();

  const existingExpense = id ? expenses.find(e => e.id === id) : null;

  const { control, handleSubmit, formState: { errors } } = useForm<z.input<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: existingExpense?.amount?.toString() || '',
      category: existingExpense?.category || CATEGORIES[0],
      date: existingExpense?.date ? new Date(existingExpense.date).toLocaleDateString() : new Date().toLocaleDateString(),
      paymentMethod: existingExpense?.paymentMethod || PAYMENT_METHODS[0],
      note: existingExpense?.note || '',
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (id) {
      await updateExpense(id, {
        amount: data.amount,
        category: data.category,
        paymentMethod: data.paymentMethod,
        note: data.note || '',
        // Ignoring date update in mock for simplicity
      });
    } else {
      await addExpense({
        amount: data.amount,
        category: data.category,
        date: new Date().toISOString(),
        paymentMethod: data.paymentMethod,
        note: data.note || '',
      });
    }
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Expense</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Amount</Text>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
                <Text style={{ fontSize: 18, color: colors.text, marginRight: 8 }}>₹</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="decimal-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
          {errors.amount && <Text style={[styles.errorText, { color: colors.error }]}>{errors.amount.message}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity style={[styles.selectContainer, { backgroundColor: colors.surface }]}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>{value === 'Food' ? '🍔' : '💵'}</Text>
                <Text style={[styles.selectText, { color: colors.text }]}>{value}</Text>
                <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
          <Controller
            control={control}
            name="date"
            render={({ field: { value } }) => (
              <TouchableOpacity style={[styles.selectContainer, { backgroundColor: colors.surface }]}>
                <Text style={[styles.selectText, { color: colors.text }]}>{value}</Text>
                <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Payment Method</Text>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field: { value } }) => (
              <TouchableOpacity style={[styles.selectContainer, { backgroundColor: colors.surface }]}>
                <Text style={[styles.selectText, { color: colors.text }]}>{value}</Text>
                <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Note</Text>
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="What was this for?"
                  placeholderTextColor={colors.textTertiary}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              </View>
            )}
          />
        </View>

      </ScrollView>
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.saveButtonText}>Save Expense</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  iconBtn: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 100, // Make room for fixed button
  },
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.sm,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    height: 56,
    borderRadius: theme.radius.xl,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    height: 56,
    borderRadius: theme.radius.xl,
  },
  selectText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
  },
  saveButton: {
    backgroundColor: '#4F46E5', // Distinct blue from mockup
    height: 56,
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
  errorText: {
    fontSize: theme.typography.size.xs,
    marginTop: 4,
    marginLeft: 4,
  }
});
