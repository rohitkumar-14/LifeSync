import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useGoalStore } from '../../src/store/useGoalStore';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const contributionSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Enter a valid amount'),
  note: z.string().optional(),
});

type ContributionFormData = z.infer<typeof contributionSchema>;

export default function AddContributionModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const goalId = params.goalId as string;
  const goalName = params.goalName as string;

  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const addContribution = useGoalStore((state) => state.addContribution);

  const { control, handleSubmit, formState: { errors } } = useForm<ContributionFormData>({
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
      amount: parseFloat(data.amount),
      date: new Date().toISOString().split('T')[0],
      note: data.note?.trim() || '',
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Funds</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 80, 100) }]} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.subGoalTitle, { color: colors.textSecondary }]}>
          Adding funds toward: <Text style={{ color: colors.primary, fontFamily: theme.typography.fontFamily.bold }}>{goalName || 'Goal'}</Text>
        </Text>

        {/* Amount & Note Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Amount (₹)</Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. 1000"
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
          {errors.amount && (
            <Text style={[styles.errorText, { color: colors.error }]}>{errors.amount.message}</Text>
          )}

          <View style={[styles.formRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Note</Text>
            <Controller
              control={control}
              name="note"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. Monthly savings contribution"
                  placeholderTextColor={colors.textTertiary}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  textAlign="right"
                />
              )}
            />
          </View>
        </View>

      </ScrollView>

      {/* Footer Save Button */}
      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]} 
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.saveButtonText}>Add Funds</Text>
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
  subGoalTitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.md,
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
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
