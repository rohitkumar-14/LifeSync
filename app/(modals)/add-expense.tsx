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
import { useFinanceStore } from '../../src/store/useFinanceStore';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = [
  { label: 'Food', icon: 'fast-food-outline', emoji: '🍔' },
  { label: 'Transport', icon: 'car-outline', emoji: '🚗' },
  { label: 'Shopping', icon: 'bag-handle-outline', emoji: '🛍️' },
  { label: 'Entertainment', icon: 'film-outline', emoji: '🎬' },
  { label: 'Bills', icon: 'receipt-outline', emoji: '💡' },
  { label: 'Health', icon: 'medical-outline', emoji: '🏥' },
  { label: 'Other', icon: 'ellipsis-horizontal-outline', emoji: '📦' },
];

const PAYMENT_METHODS = [
  { label: 'UPI', icon: 'flash-outline' },
  { label: 'Card', icon: 'card-outline' },
  { label: 'Cash', icon: 'cash-outline' },
  { label: 'Net Banking', icon: 'business-outline' },
];

const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const formatDateLabel = (isoDate: string) => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  if (isoDate === today) return 'Today';
  if (isoDate === yesterday) return 'Yesterday';
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const expenseSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Enter a valid amount'),
  note: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export default function AddExpenseModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const { expenses, addExpense, updateExpense } = useFinanceStore();

  const existingExpense = id ? expenses.find(e => e.id === id) : null;

  const [selectedCategory, setSelectedCategory] = useState<string>(existingExpense?.category || 'Food');
  const [selectedPayment, setSelectedPayment] = useState<string>(existingExpense?.paymentMethod || 'UPI');
  const [selectedDate, setSelectedDate] = useState<string>(
    existingExpense?.date ? existingExpense.date.split('T')[0] : getTodayDateString()
  );

  const [dateModalVisible, setDateModalVisible] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: existingExpense?.amount ? existingExpense.amount.toString() : '',
      note: existingExpense?.note || '',
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const amountNum = parseFloat(data.amount);
    const fullDateISO = new Date(`${selectedDate}T12:00:00.000Z`).toISOString();

    if (id) {
      await updateExpense(id, {
        amount: amountNum,
        category: selectedCategory,
        date: fullDateISO,
        paymentMethod: selectedPayment,
        note: data.note?.trim() || '',
      });
    } else {
      await addExpense({
        amount: amountNum,
        category: selectedCategory,
        date: fullDateISO,
        paymentMethod: selectedPayment,
        note: data.note?.trim() || '',
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{id ? 'Edit Expense' : 'Add Expense'}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 80, 100) }]} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Amount Card */}
        <View style={[styles.amountCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>Spent Amount</Text>
          <View style={styles.amountInputRow}>
            <Text style={[styles.currencySymbol, { color: colors.primary }]}>₹</Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.amountInput, { color: colors.text }]}
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoFocus={!id}
                />
              )}
            />
          </View>
          {errors.amount && (
            <Text style={[styles.errorText, { color: colors.error }]}>{errors.amount.message}</Text>
          )}
        </View>

        {/* Category Selector */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SELECT CATEGORY</Text>
        </View>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.label.toLowerCase();
            return (
              <TouchableOpacity
                key={cat.label}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: isSelected ? colors.primary : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                    borderColor: isSelected ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCategory(cat.label);
                }}
              >
                <Text style={{ fontSize: 20, marginBottom: 4 }}>{cat.emoji}</Text>
                <Text style={[styles.categoryCardText, { color: isSelected ? '#FFF' : colors.text }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Payment Method Selector */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PAYMENT METHOD</Text>
        </View>
        <View style={styles.paymentRow}>
          {PAYMENT_METHODS.map((pm) => {
            const isSelected = selectedPayment.toLowerCase() === pm.label.toLowerCase();
            return (
              <TouchableOpacity
                key={pm.label}
                style={[
                  styles.paymentChip,
                  {
                    backgroundColor: isSelected ? colors.primary : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                    borderColor: isSelected ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedPayment(pm.label);
                }}
              >
                <Ionicons 
                  name={pm.icon as any} 
                  size={16} 
                  color={isSelected ? '#FFF' : colors.text} 
                  style={{ marginRight: 6 }} 
                />
                <Text style={[styles.paymentChipText, { color: isSelected ? '#FFF' : colors.text }]}>
                  {pm.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Date & Note Group */}
        <View style={[styles.card, { backgroundColor: colors.surface, marginTop: theme.spacing.md }]}>
          {/* Date Row */}
          <TouchableOpacity 
            style={styles.clickableRow} 
            onPress={() => setDateModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
              <Text style={[styles.label, { color: colors.text }]}>Date</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={[styles.valueText, { color: colors.primary }]}>{formatDateLabel(selectedDate)}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} style={{ marginLeft: 6 }} />
            </View>
          </TouchableOpacity>

          {/* Note Input Row */}
          <View style={[styles.formRow, { borderBottomWidth: 0 }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="document-text-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
              <Text style={[styles.label, { color: colors.text }]}>Note</Text>
            </View>
            <Controller
              control={control}
              name="note"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. Dinner with friends"
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
          <Text style={styles.saveButtonText}>{id ? 'Update Expense' : 'Save Expense'}</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <Modal visible={dateModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDateModalVisible(false)}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Expense Date</Text>
            {[
              { label: 'Today', value: getTodayDateString() },
              { label: 'Yesterday', value: getYesterdayDateString() },
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
  amountCard: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  amountLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 6,
    includeFontPadding: false,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.bold,
    marginRight: 6,
  },
  amountInput: {
    fontSize: 36,
    fontFamily: theme.typography.fontFamily.bold,
    minWidth: 100,
    textAlign: 'center',
    paddingVertical: 0,
    includeFontPadding: false,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  categoryCard: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
  },
  categoryCardText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.semiBold,
    includeFontPadding: false,
  },
  paymentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  paymentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  paymentChipText: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.semiBold,
    includeFontPadding: false,
  },
  card: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
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
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
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
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.size.md,
    includeFontPadding: false,
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.size.md,
    paddingLeft: 12,
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
