import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useFinanceStore } from '../../src/store/useFinanceStore';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Other'];

const budgetSchema = z.object({
  limit: z.string().min(1, 'Amount is required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Enter a valid amount'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export default function SetBudgetModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const { addBudget } = useFinanceStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);

  const { control, handleSubmit, formState: { errors } } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      limit: '',
    },
  });

  const onSubmit = async (data: BudgetFormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const monthStr = new Date().toISOString().substring(0, 7);
    
    await addBudget({
      limit: parseFloat(data.limit),
      category: selectedCategory,
      month: monthStr,
    });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Set Budget</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 80, 100) }]} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.headerSubtext, { color: colors.textSecondary }]}>
          Set a monthly spending limit to keep your finances in check.
        </Text>

        {/* Limit Amount Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Monthly Limit (₹)</Text>
            <Controller
              control={control}
              name="limit"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. 15000"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  textAlign="right"
                  autoFocus
                />
              )}
            />
          </View>
          {errors.limit && (
            <Text style={[styles.errorText, { color: colors.error }]}>{errors.limit.message}</Text>
          )}
        </View>

        {/* Category Chips */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>BUDGET CATEGORY</Text>
        </View>
        <View style={styles.chipContainer}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primary : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                    borderColor: isSelected ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCategory(cat);
                }}
              >
                <Text
                  style={{
                    color: isSelected ? '#FFF' : colors.text,
                    fontFamily: theme.typography.fontFamily.semiBold,
                    fontSize: 13,
                  }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      {/* Footer Save Button */}
      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]} 
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.saveButtonText}>Save Budget</Text>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  iconBtn: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  content: {
    padding: theme.spacing.lg,
  },
  headerSubtext: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.regular,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
    includeFontPadding: false,
  },
  card: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.medium,
    includeFontPadding: false,
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.size.md,
    paddingLeft: 12,
    includeFontPadding: false,
  },
  errorText: {
    fontSize: 12,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 6,
    includeFontPadding: false,
  },
  sectionHeader: {
    marginBottom: theme.spacing.sm,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  saveButton: {
    height: 52,
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
});
