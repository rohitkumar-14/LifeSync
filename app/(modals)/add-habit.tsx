import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../../src/store/useHabitStore';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = ['#F59E0B', '#3B82F6', '#8B5CF6', '#4F46E5', '#10B981', '#14B8A6'];
const ICONS = ['💧', '🏃‍♂️', '📚', '🧘‍♀️', '🍎', '💤'];

const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
  frequency: z.string().optional(),
  reminderTime: z.string().optional(),
  target: z.string().optional(),
});

type HabitFormData = z.infer<typeof habitSchema>;

export default function AddHabitModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const { habits, addHabit, updateHabit } = useHabitStore();

  const existingHabit = id ? habits.find(h => h.id === id) : null;

  const { control, handleSubmit, formState: { errors } } = useForm<z.input<typeof habitSchema>>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: existingHabit?.name || '',
      icon: existingHabit?.icon || ICONS[0],
      color: existingHabit?.color || COLORS[3],
      frequency: 'Daily',
      reminderTime: '8:00 AM',
      target: '10 minutes',
    },
  });

  const onSubmit = async (data: HabitFormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (id) {
      await updateHabit(id, {
        name: data.name,
        icon: data.icon,
        color: data.color,
      });
    } else {
      await addHabit({
        name: data.name,
        icon: data.icon,
        color: data.color,
        frequency: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        target: parseInt(data.target || '1', 10) || 1,
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Habit</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.formRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Meditation"
                placeholderTextColor={colors.textTertiary}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                textAlign="right"
              />
            )}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Icon</Text>
          <Controller
            control={control}
            name="icon"
            render={({ field: { onChange, value } }) => (
              <View style={styles.scrollSelectContainer}>
                {ICONS.map((icon) => {
                  const isSelected = value === icon;
                  return (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconBox,
                        { borderColor: isSelected ? '#4F46E5' : colors.border },
                        isSelected && { backgroundColor: 'rgba(79, 70, 229, 0.1)' }
                      ]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        onChange(icon);
                      }}
                    >
                      <Text style={{ fontSize: 20 }}>{icon}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Color</Text>
          <Controller
            control={control}
            name="color"
            render={({ field: { onChange, value } }) => (
              <View style={styles.scrollSelectContainer}>
                {COLORS.map((color) => {
                  const isSelected = value === color;
                  return (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorCircle,
                        { backgroundColor: color },
                        isSelected && { borderWidth: 2, borderColor: colors.background, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 }
                      ]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        onChange(color);
                      }}
                    >
                      {isSelected && <View style={[styles.colorRing, { borderColor: color }]} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Frequency</Text>
          <Controller
            control={control}
            name="frequency"
            render={({ field: { value } }) => (
              <Text style={[styles.valueText, { color: colors.text }]}>{value}</Text>
            )}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Reminder Time</Text>
          <Controller
            control={control}
            name="reminderTime"
            render={({ field: { value } }) => (
              <Text style={[styles.valueText, { color: colors.text }]}>{value}</Text>
            )}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Target</Text>
          <Controller
            control={control}
            name="target"
            render={({ field: { value } }) => (
              <Text style={[styles.valueText, { color: colors.text }]}>{value}</Text>
            )}
          />
        </View>

      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.saveButtonText}>Save Habit</Text>
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
    paddingBottom: 100,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  label: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    width: 100,
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.size.md,
  },
  valueText: {
    flex: 1,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.size.md,
  },
  scrollSelectContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  colorRing: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
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
});
