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
import { useHabitStore } from '../../src/store/useHabitStore';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#3B82F6', '#8B5CF6', '#14B8A6'];
const ICONS = ['💧', '🏃‍♂️', '📚', '🧘‍♀️', '🍎', '💤', '💪', '🧠', '🚴', '🌿'];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TIME_OPTIONS = [
  '7:00 AM (Morning)',
  '8:00 AM (Morning)',
  '12:00 PM (Noon)',
  '2:00 PM (Afternoon)',
  '6:00 PM (Evening)',
  '9:00 PM (Night)',
  'No Reminder',
];

const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required'),
});

type HabitFormData = z.infer<typeof habitSchema>;

export default function AddHabitModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const { habits, addHabit, updateHabit } = useHabitStore();

  const existingHabit = id ? habits.find(h => h.id === id) : null;

  const [selectedIcon, setSelectedIcon] = useState<string>(existingHabit?.icon || ICONS[0]);
  const [selectedColor, setSelectedColor] = useState<string>(existingHabit?.color || COLORS[0]);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    existingHabit?.frequency || ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  );
  const [reminderTime, setReminderTime] = useState<string>(existingHabit?.reminderTime || '8:00 AM');
  const [targetCount, setTargetCount] = useState<number>(existingHabit?.target || 1);

  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: existingHabit?.name || '',
    },
  });

  const toggleDay = (dayIndex: number) => {
    Haptics.selectionAsync();
    const day = DAYS[dayIndex];
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((_, idx) => idx !== dayIndex));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const setFrequencyPreset = (preset: 'daily' | 'weekdays' | 'weekends') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (preset === 'daily') {
      setSelectedDays(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
    } else if (preset === 'weekdays') {
      setSelectedDays(['M', 'T', 'W', 'T', 'F']);
    } else if (preset === 'weekends') {
      setSelectedDays(['S', 'S']);
    }
  };

  const onSubmit = async (data: HabitFormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (id) {
      await updateHabit(id, {
        name: data.name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        frequency: selectedDays,
        reminderTime: reminderTime === 'No Reminder' ? undefined : reminderTime,
        target: targetCount,
      });
    } else {
      await addHabit({
        name: data.name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        frequency: selectedDays,
        reminderTime: reminderTime === 'No Reminder' ? undefined : reminderTime,
        target: targetCount,
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{id ? 'Edit Habit' : 'Create New Habit'}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 80, 100) }]} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Habit Name Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.formRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Habit Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. Drink 2L Water"
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
        </View>

        {/* Icon Selector */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CHOOSE ICON</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {ICONS.map((icon) => {
            const isSelected = selectedIcon === icon;
            return (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconBox,
                  { 
                    backgroundColor: isSelected ? selectedColor + '25' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                    borderColor: isSelected ? selectedColor : colors.border,
                  }
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedIcon(icon);
                }}
              >
                <Text style={{ fontSize: 24 }}>{icon}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Color Selector */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CHOOSE COLOR</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {COLORS.map((color) => {
            const isSelected = selectedColor === color;
            return (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color }
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedColor(color);
                }}
              >
                {isSelected && <Ionicons name="checkmark" size={18} color="#FFF" />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Frequency & Target Options */}
        <View style={[styles.card, { backgroundColor: colors.surface, marginTop: theme.spacing.md }]}>
          
          {/* Days Frequency Selector */}
          <View style={styles.optionSection}>
            <View style={styles.optionHeader}>
              <Text style={[styles.label, { color: colors.text }]}>Repeat Days</Text>
              <View style={styles.presetButtons}>
                <TouchableOpacity onPress={() => setFrequencyPreset('daily')} style={styles.presetBtn}>
                  <Text style={[styles.presetBtnText, { color: colors.primary }]}>Daily</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFrequencyPreset('weekdays')} style={styles.presetBtn}>
                  <Text style={[styles.presetBtnText, { color: colors.primary }]}>Weekdays</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.daysRow}>
              {DAY_LABELS.map((dayLabel, index) => {
                const isSelected = selectedDays.length === 7 ? true : index < selectedDays.length;
                return (
                  <TouchableOpacity
                    key={dayLabel + index}
                    style={[
                      styles.dayButton,
                      {
                        backgroundColor: isSelected ? selectedColor : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                        borderColor: isSelected ? selectedColor : colors.border,
                      }
                    ]}
                    onPress={() => toggleDay(index)}
                  >
                    <Text style={[styles.dayButtonText, { color: isSelected ? '#FFF' : colors.text }]}>
                      {dayLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Daily Target Stepper */}
          <View style={[styles.clickableRow, { borderTopWidth: 1, borderTopColor: 'rgba(128,128,128,0.1)' }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="flag-outline" size={20} color={selectedColor} style={{ marginRight: 10 }} />
              <Text style={[styles.label, { color: colors.text }]}>Daily Target</Text>
            </View>
            <View style={styles.stepperContainer}>
              <TouchableOpacity 
                style={[styles.stepperBtn, { borderColor: colors.border }]} 
                onPress={() => {
                  Haptics.selectionAsync();
                  setTargetCount(Math.max(1, targetCount - 1));
                }}
              >
                <Ionicons name="remove" size={18} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.targetValueText, { color: colors.text }]}>
                {targetCount} {targetCount === 1 ? 'time' : 'times'} / day
              </Text>
              <TouchableOpacity 
                style={[styles.stepperBtn, { borderColor: colors.border }]} 
                onPress={() => {
                  Haptics.selectionAsync();
                  setTargetCount(targetCount + 1);
                }}
              >
                <Ionicons name="add" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reminder Time Row */}
          <TouchableOpacity 
            style={[styles.clickableRow, { borderTopWidth: 1, borderTopColor: 'rgba(128,128,128,0.1)', borderBottomWidth: 0 }]} 
            onPress={() => setTimeModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="time-outline" size={20} color={selectedColor} style={{ marginRight: 10 }} />
              <Text style={[styles.label, { color: colors.text }]}>Reminder Time</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={[styles.valueText, { color: selectedColor }]}>{reminderTime}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 6 }} />
            </View>
          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* Footer Save Button */}
      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: selectedColor }]} 
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.saveButtonText}>{id ? 'Update Habit' : 'Save Habit'}</Text>
        </TouchableOpacity>
      </View>

      {/* Reminder Time Modal */}
      <Modal visible={timeModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setTimeModalVisible(false)}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Reminder Time</Text>
            {TIME_OPTIONS.map(time => (
              <TouchableOpacity
                key={time}
                style={[styles.modalOption, reminderTime === time && { backgroundColor: selectedColor + '15' }]}
                onPress={() => {
                  setReminderTime(time);
                  setTimeModalVisible(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: reminderTime === time ? selectedColor : colors.text }]}>
                  {time}
                </Text>
                {reminderTime === time && <Ionicons name="checkmark" size={20} color={selectedColor} />}
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
  chipsScroll: {
    gap: 10,
    paddingVertical: 6,
    marginBottom: theme.spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionSection: {
    padding: theme.spacing.lg,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  presetButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  presetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(128,128,128,0.1)',
  },
  presetBtnText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.semiBold,
    includeFontPadding: false,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayButton: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.semiBold,
    includeFontPadding: false,
  },
  clickableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.lg,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetValueText: {
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
