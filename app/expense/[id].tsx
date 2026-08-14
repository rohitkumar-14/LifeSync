import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { useFinanceStore } from '../../src/store/useFinanceStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExpenseDetailsScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const { expenses, deleteExpense } = useFinanceStore();
  const expense = expenses.find(e => e.id === id);

  if (!expense) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Expense not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getCategoryUI = (category: string) => {
    switch (category) {
      case 'Food': return { icon: '🍔', color: '#F59E0B' }; // Orange
      case 'Shopping': return { icon: '🛍️', color: '#AF52DE' };
      case 'Transport': return { icon: '🚇', color: '#34C759' };
      case 'Bills': return { icon: '💡', color: '#FF9500' };
      case 'Entertainment': return { icon: '🍿', color: '#8B5CF6' };
      default: return { icon: '💵', color: '#4F46E5' };
    }
  };

  const ui = getCategoryUI(expense.category);
  const dateStr = new Date(expense.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = new Date(expense.date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  const handleDelete = () => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteExpense(id);
          router.back();
        } 
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Colored Header Block */}
      <View style={[styles.heroHeader, { backgroundColor: ui.color }]}>
        <SafeAreaView edges={['top']}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Main Content Area */}
      <View style={[styles.contentWrapper, { backgroundColor: colors.background }]}>
        
        {/* Floating Icon */}
        <View style={styles.iconContainerWrapper}>
          <View style={[styles.iconBox, { backgroundColor: colors.background }]}>
            <Text style={{ fontSize: 40 }}>{ui.icon}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Title & Amount */}
          <Text style={[styles.title, { color: colors.text }]}>{expense.note || expense.category}</Text>
          <Text style={[styles.amount, { color: colors.text }]}>₹{expense.amount.toLocaleString()}</Text>
          
          <View style={styles.categoryBadge}>
            <Text style={{ fontSize: 14 }}>{ui.icon}</Text>
            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>{expense.category}</Text>
          </View>

          {/* Details List */}
          <View style={[styles.detailsCard, { backgroundColor: colors.surface }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{dateStr}, {timeStr}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Payment Method</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{expense.paymentMethod || 'UPI'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Note</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{expense.note || 'None'}</Text>
            </View>
          </View>

        </ScrollView>

        {/* Footer Actions */}
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} onPress={() => router.push(`/(modals)/add-expense?id=${id}`)}>
            <Ionicons name="pencil" size={20} color="#4F46E5" />
            <Text style={[styles.actionBtnText, { color: '#4F46E5' }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDelete}>
            <Ionicons name="trash" size={20} color="#EF4444" />
            <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroHeader: {
    height: 180,
    width: '100%',
  },
  backButton: {
    padding: theme.spacing.md,
  },
  contentWrapper: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  iconContainerWrapper: {
    alignItems: 'center',
    marginTop: -40, // Pull up to overlap
    marginBottom: theme.spacing.lg,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.xs,
  },
  amount: {
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.md,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: theme.spacing.xxxl,
  },
  categoryText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginLeft: 6,
  },
  detailsCard: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  detailValue: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    gap: 8,
  },
  editBtn: {
    borderColor: '#4F46E5',
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
  },
  deleteBtn: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  actionBtnText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
});
