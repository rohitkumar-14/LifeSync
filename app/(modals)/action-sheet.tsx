import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';

export default function ActionSheet() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();

    const actions = [
      { id: 'expense', title: 'Add Expense', icon: 'wallet-outline', route: '/(modals)/add-expense' },
      { id: 'task', title: 'Add Task', icon: 'checkmark-circle-outline', route: '/(modals)/add-task' },
      { id: 'habit', title: 'Add Habit', icon: 'leaf-outline', route: '/(modals)/add-habit' },
      { id: 'goal', title: 'Add Goal', icon: 'flag-outline', route: '/(modals)/add-goal' },
      { id: 'recipe', title: 'Add Recipe', icon: 'restaurant-outline', route: '/(modals)/add-recipe' },
    ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.handle, { backgroundColor: colors.border }]} />
      <Text style={[styles.title, { color: colors.text }]}>What would you like to add?</Text>
      
      <View style={styles.list}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionItem, { borderBottomColor: colors.border }]}
            onPress={() => {
              // Close action sheet first, then navigate
              router.back();
              setTimeout(() => {
                router.push(action.route as any);
              }, 100);
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.surfaceHighlight }]}>
              <Ionicons name={action.icon as any} size={24} color={colors.text} />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>{action.title}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.size.xl,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  list: {
    gap: theme.spacing.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  actionText: {
    flex: 1,
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.semiBold,
  }
});
