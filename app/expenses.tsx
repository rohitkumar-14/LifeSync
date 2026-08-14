import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';
import { useFinanceStore } from '../src/store/useFinanceStore';

export default function ExpensesListScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  
  const { expenses } = useFinanceStore();
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const getExpenseIcon = (category: string) => {
    switch (category) {
      case 'Food': return { icon: '🍔', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'Shopping': return { icon: '🛍️', color: '#AF52DE', bg: 'rgba(175, 82, 222, 0.1)' };
      case 'Transport': return { icon: '🚇', color: '#34C759', bg: 'rgba(52, 199, 89, 0.1)' };
      case 'Bills': return { icon: '💡', color: '#FF9500', bg: 'rgba(255, 149, 0, 0.1)' };
      case 'Movie': return { icon: '🍿', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' };
      default: return { icon: '💵', color: '#4F46E5', bg: 'rgba(79, 70, 229, 0.1)' };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Expenses</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(modals)/add-expense')}>
            <Ionicons name="add" size={26} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.monthSelector}>
          <Text style={[styles.monthText, { color: colors.text }]}>August</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
        <Text style={[styles.totalAmount, { color: colors.text }]}>₹{totalSpent.toLocaleString()}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.listCard, { backgroundColor: colors.surface }]}>
          {expenses.map((expense, idx) => {
            const isLast = idx === expenses.length - 1;
            const ui = getExpenseIcon(expense.category);
            const dateStr = new Date(expense.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
            // For mock demo, if it's today, show "Today"
            const isToday = new Date(expense.date).toDateString() === new Date().toDateString();
            
            return (
              <TouchableOpacity 
                key={expense.id} 
                style={[styles.expenseRow, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                onPress={() => router.push(`/expense/${expense.id}`)}
              >
                <View style={[styles.iconBox, { backgroundColor: ui.bg }]}>
                  <Text style={{ fontSize: 20 }}>{ui.icon}</Text>
                </View>
                <View style={styles.details}>
                  <Text style={[styles.expenseName, { color: colors.text }]}>{expense.note || expense.category}</Text>
                  <Text style={[styles.expenseSubtitle, { color: colors.textSecondary }]}>
                    {isToday ? <Text style={{ color: '#F59E0B' }}>Today</Text> : dateStr} • {expense.paymentMethod || 'UPI'}
                  </Text>
                </View>
                <Text style={[styles.expenseAmount, { color: colors.text }]}>
                  ₹{expense.amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            );
          })}
          
          {expenses.length === 0 && (
            <Text style={{ color: colors.textSecondary, padding: theme.spacing.lg, textAlign: 'center' }}>
              No expenses recorded yet.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconBtn: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
    marginLeft: theme.spacing.xs,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  listCard: {
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
    overflow: 'hidden',
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  details: {
    flex: 1,
  },
  expenseName: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginBottom: 4,
  },
  expenseSubtitle: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  expenseAmount: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
