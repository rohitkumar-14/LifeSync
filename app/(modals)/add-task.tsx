import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTaskStore } from '../../src/store/useTaskStore';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
  time: z.string().optional(),
  reminder: z.boolean().optional(),
  recurring: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function AddTaskModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const { tasks, addTask, updateTask } = useTaskStore();

  const existingTask = id ? tasks.find(t => t.id === id) : null;

  const { control, handleSubmit } = useForm<z.input<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: existingTask?.title || '',
      description: existingTask?.description || '',
      priority: existingTask?.priority || 'Medium',
      dueDate: existingTask?.dueDate ? new Date(existingTask.dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '11 Aug 2024',
      time: existingTask?.dueDate ? new Date(existingTask.dueDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '5:00 PM',
      reminder: true, // Mock default
      recurring: 'Never',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (id) {
      await updateTask(id, {
        title: data.title,
        description: data.description || '',
        priority: data.priority as any,
      });
    } else {
      await addTask({
        title: data.title,
        description: data.description || '',
        priority: data.priority as any || 'Medium',
        dueDate: new Date().toISOString(), // Mocking date integration
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Task</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.formGroup, { backgroundColor: colors.surface }]}>
          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Title</Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Buy groceries"
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
            <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Milk, Eggs, Bread, Fruits"
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

        <View style={[styles.formGroup, { backgroundColor: colors.surface }]}>
          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Priority</Text>
            <Controller
              control={control}
              name="priority"
              render={({ field: { value } }) => (
                <TouchableOpacity style={styles.valueRow}>
                  <Text style={[styles.valueText, { color: colors.text }]}>{value}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Due Date</Text>
            <View style={styles.datePickerContainer}>
              <Controller
                control={control}
                name="dueDate"
                render={({ field: { value } }) => (
                  <TouchableOpacity style={styles.dateBox}>
                    <Text style={[styles.dateText, { color: colors.text }]}>{value}</Text>
                  </TouchableOpacity>
                )}
              />
              <Controller
                control={control}
                name="time"
                render={({ field: { value } }) => (
                  <TouchableOpacity style={styles.timeBox}>
                    <Text style={[styles.dateText, { color: colors.text }]}>{value}</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Reminder</Text>
            <Controller
              control={control}
              name="reminder"
              render={({ field: { value, onChange } }) => (
                <Switch 
                  value={value} 
                  onValueChange={onChange} 
                  trackColor={{ false: colors.border, true: 'rgba(79, 70, 229, 0.5)' }}
                  thumbColor={value ? '#4F46E5' : '#f4f3f4'}
                />
              )}
            />
          </View>

          <View style={[styles.formRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Recurring</Text>
            <Controller
              control={control}
              name="recurring"
              render={({ field: { value } }) => (
                <TouchableOpacity style={styles.valueRow}>
                  <Text style={[styles.valueText, { color: colors.text }]}>{value}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>

      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.saveButtonText}>Save Task</Text>
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
  formGroup: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
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
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.size.md,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  dateText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.size.sm,
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
