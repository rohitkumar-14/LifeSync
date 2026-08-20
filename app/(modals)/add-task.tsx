import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Switch, 
  Modal 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTaskStore } from '../../src/store/useTaskStore';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIORITIES = [
  { label: 'Low', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
  { label: 'Medium', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' },
  { label: 'High', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' },
  { label: 'Urgent', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)' },
];

const CATEGORIES = ['General', 'Work', 'Personal', 'Health', 'Shopping', 'Finance', 'Study'];

const RECURRING_OPTIONS = ['Never', 'Daily', 'Weekdays', 'Weekly', 'Monthly'];

const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getTomorrowDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const getNextWeekDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
};

const formatDateLabel = (isoDate: string) => {
  const today = getTodayDateString();
  const tomorrow = getTomorrowDateString();
  if (isoDate === today) return 'Today';
  if (isoDate === tomorrow) return 'Tomorrow';
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function AddTaskModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const { tasks, addTask, updateTask } = useTaskStore();

  const existingTask = id ? tasks.find(t => t.id === id) : null;

  const [selectedPriority, setSelectedPriority] = useState<string>(existingTask?.priority || 'Medium');
  const [selectedCategory, setSelectedCategory] = useState<string>(existingTask?.category || 'General');
  const [selectedDate, setSelectedDate] = useState<string>(
    existingTask?.dueDate ? existingTask.dueDate.split('T')[0] : getTodayDateString()
  );
  const [selectedTime, setSelectedTime] = useState<string>('5:00 PM');
  const [isReminder, setIsReminder] = useState<boolean>(Boolean(existingTask?.reminder ?? true));
  const [selectedRecurring, setSelectedRecurring] = useState<string>(existingTask?.recurring ? 'Daily' : 'Never');

  // Modals for selection
  const [priorityModalVisible, setPriorityModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [recurringModalVisible, setRecurringModalVisible] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: existingTask?.title || '',
      description: existingTask?.description || '',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Construct ISO Date with time if possible
    const dueDateISO = new Date(`${selectedDate}T12:00:00.000Z`).toISOString();

    if (id) {
      await updateTask(id, {
        title: data.title.trim(),
        description: data.description?.trim() || '',
        priority: selectedPriority as any,
        category: selectedCategory,
        dueDate: dueDateISO,
        reminder: isReminder,
        recurring: selectedRecurring !== 'Never',
      });
    } else {
      await addTask({
        title: data.title.trim(),
        description: data.description?.trim() || '',
        priority: selectedPriority as any,
        category: selectedCategory,
        dueDate: dueDateISO,
        reminder: isReminder,
        recurring: selectedRecurring !== 'Never',
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{id ? 'Edit Task' : 'Add New Task'}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 80, 100) }]} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title & Description Group */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Title</Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. Finish client presentation"
                  placeholderTextColor={colors.textTertiary}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  textAlign="right"
                />
              )}
            />
          </View>
          {errors.title && (
            <Text style={[styles.errorText, { color: colors.error }]}>{errors.title.message}</Text>
          )}

          <View style={[styles.formRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Notes</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Add details, links, or notes"
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

        {/* Priority Quick Chips */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PRIORITY</Text>
        </View>
        <View style={styles.chipsRow}>
          {PRIORITIES.map((p) => {
            const isSelected = selectedPriority.toLowerCase() === p.label.toLowerCase();
            return (
              <TouchableOpacity
                key={p.label}
                style={[
                  styles.priorityChip,
                  { 
                    backgroundColor: isSelected ? p.color : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                    borderColor: isSelected ? p.color : colors.border,
                  }
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedPriority(p.label);
                }}
              >
                <View style={[styles.dot, { backgroundColor: isSelected ? '#FFF' : p.color }]} />
                <Text style={[styles.chipText, { color: isSelected ? '#FFF' : colors.text }]}>{p.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Category Quick Chips */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CATEGORY</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? colors.primary : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                    borderColor: isSelected ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCategory(cat);
                }}
              >
                <Text style={[styles.chipText, { color: isSelected ? '#FFF' : colors.text }]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Date, Time & Options Group */}
        <View style={[styles.card, { backgroundColor: colors.surface, marginTop: theme.spacing.md }]}>
          {/* Due Date Row */}
          <TouchableOpacity 
            style={styles.clickableRow} 
            onPress={() => setDateModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
              <Text style={[styles.label, { color: colors.text }]}>Due Date</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={[styles.valueText, { color: colors.primary }]}>{formatDateLabel(selectedDate)}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 6 }} />
            </View>
          </TouchableOpacity>

          {/* Time Row */}
          <TouchableOpacity 
            style={styles.clickableRow} 
            onPress={() => setTimeModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="time-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
              <Text style={[styles.label, { color: colors.text }]}>Time</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={[styles.valueText, { color: colors.primary }]}>{selectedTime}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 6 }} />
            </View>
          </TouchableOpacity>

          {/* Reminder Toggle */}
          <View style={styles.clickableRow}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
              <Text style={[styles.label, { color: colors.text }]}>Reminder</Text>
            </View>
            <Switch 
              value={isReminder} 
              onValueChange={setIsReminder} 
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={isReminder ? colors.primary : '#f4f3f4'}
            />
          </View>

          {/* Recurring Row */}
          <TouchableOpacity 
            style={[styles.clickableRow, { borderBottomWidth: 0 }]} 
            onPress={() => setRecurringModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="repeat-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
              <Text style={[styles.label, { color: colors.text }]}>Repeat</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={[styles.valueText, { color: colors.primary }]}>{selectedRecurring}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 6 }} />
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Footer Save Button */}
      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.saveButtonText}>{id ? 'Update Task' : 'Save Task'}</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <Modal visible={dateModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDateModalVisible(false)}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Due Date</Text>
            {[
              { label: 'Today', value: getTodayDateString() },
              { label: 'Tomorrow', value: getTomorrowDateString() },
              { label: 'Next Week', value: getNextWeekDateString() },
            ].map(item => (
              <TouchableOpacity
                key={item.label}
                style={[styles.modalOption, selectedDate === item.value && { backgroundColor: colors.primary + '15' }]}
                onPress={() => {
                  setSelectedDate(item.value);
                  setDateModalVisible(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: selectedDate === item.value ? colors.primary : colors.text }]}>
                  {item.label} ({new Date(item.value).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })})
                </Text>
                {selectedDate === item.value && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={timeModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setTimeModalVisible(false)}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Time</Text>
            {[
              '9:00 AM (Morning)',
              '12:00 PM (Noon)',
              '2:00 PM (Afternoon)',
              '5:00 PM (Evening)',
              '8:00 PM (Night)',
              'Anytime',
            ].map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.modalOption, selectedTime === item && { backgroundColor: colors.primary + '15' }]}
                onPress={() => {
                  setSelectedTime(item);
                  setTimeModalVisible(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: selectedTime === item ? colors.primary : colors.text }]}>
                  {item}
                </Text>
                {selectedTime === item && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Recurring Modal */}
      <Modal visible={recurringModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setRecurringModalVisible(false)}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Repeat Schedule</Text>
            {RECURRING_OPTIONS.map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.modalOption, selectedRecurring === item && { backgroundColor: colors.primary + '15' }]}
                onPress={() => {
                  setSelectedRecurring(item);
                  setRecurringModalVisible(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: selectedRecurring === item ? colors.primary : colors.text }]}>
                  {item}
                </Text>
                {selectedRecurring === item && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: theme.spacing.md,
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
  clickableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128,128,128,0.1)',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.size.md,
    includeFontPadding: false,
  },
  sectionHeader: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 4,
    marginBottom: theme.spacing.sm,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalBox: {
    width: '100%',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    gap: 6,
  },
  modalTitle: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.sm,
    includeFontPadding: false,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
  },
  modalOptionText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.medium,
    includeFontPadding: false,
  },
});
