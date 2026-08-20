import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  TextInput,
  Modal
} from 'react-native';
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

const ICONS = ['🎯', '🏠', '✈️', '🚗', '🎓', '💰', '💍', '💻', '🏖️', '📱', '⌚', '🚀'];

const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  target: z.string().min(1, 'Target amount is required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Enter a valid target amount'),
});

type GoalFormData = z.infer<typeof goalSchema>;

export default function AddGoalModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const { goals, addGoal, updateGoal } = useGoalStore();

  const existingGoal = id ? goals.find(g => g.id === id) : null;
  const [selectedIcon, setSelectedIcon] = useState<string>(existingGoal?.icon || ICONS[0]);

  const { control, handleSubmit, formState: { errors } } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: existingGoal?.name || '',
      target: existingGoal?.target ? existingGoal.target.toString() : '',
    },
  });

  const onSubmit = async (data: GoalFormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const targetAmount = parseFloat(data.target);
    if (id) {
      await updateGoal(id, {
        name: data.name.trim(),
        target: targetAmount,
        icon: selectedIcon,
      });
    } else {
      await addGoal({
        name: data.name.trim(),
        target: targetAmount,
        icon: selectedIcon,
      });
    }
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{id ? 'Edit Goal' : 'Create Goal'}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 80, 100) }]} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Goal Name Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Goal Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. Dream Vacation / New Bike"
                  placeholderTextColor={colors.textTertiary}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  textAlign="right"
                />
              )}
            />
          </View>
          {errors.name && (
            <Text style={[styles.errorText, { color: colors.error }]}>{errors.name.message}</Text>
          )}

          <View style={[styles.formRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Target Amount (₹)</Text>
            <Controller
              control={control}
              name="target"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. 50000"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  textAlign="right"
                />
              )}
            />
          </View>
          {errors.target && (
            <Text style={[styles.errorText, { color: colors.error }]}>{errors.target.message}</Text>
          )}
        </View>

        {/* Icon Selector Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CHOOSE GOAL ICON</Text>
        </View>
        <View style={styles.iconGrid}>
          {ICONS.map((icon) => {
            const isSelected = selectedIcon === icon;
            return (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: isSelected ? colors.primary + '20' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                    borderColor: isSelected ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedIcon(icon);
                }}
              >
                <Text style={{ fontSize: 26 }}>{icon}</Text>
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
          <Text style={styles.saveButtonText}>{id ? 'Update Goal' : 'Create Goal'}</Text>
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
  sectionHeader: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconBox: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
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
