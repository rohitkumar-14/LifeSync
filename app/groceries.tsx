import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';
import { useGroceryStore } from '../src/store/useGroceryStore';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

export default function GroceriesScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const { items, loadItems, addItem, toggleItem, deleteItem, clearCompleted } = useGroceryStore();
  
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;
    await addItem(newItemName);
    setNewItemName('');
  };

  const completedCount = items.filter(i => i.isCompleted).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Grocery List</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.progressContainer}>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {completedCount} of {items.length} items collected
            </Text>
            {completedCount > 0 && (
              <TouchableOpacity onPress={clearCompleted}>
                <Text style={[styles.clearText, { color: colors.primary }]}>Clear Completed</Text>
              </TouchableOpacity>
            )}
          </View>

          {items.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cart-outline" size={64} color={colors.textTertiary} />
              <Text style={[styles.emptyStateTitle, { color: colors.textSecondary }]}>Your cart is empty</Text>
              <Text style={[styles.emptyStateDesc, { color: colors.textTertiary }]}>
                Add items below or sync ingredients from your Recipes.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {items.map((item, index) => (
                <Animated.View 
                  key={item.id}
                  entering={FadeInDown.delay(index * 50).springify()}
                  layout={Layout.springify()}
                  style={[styles.itemCard, { backgroundColor: colors.surface }]}
                >
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => toggleItem(item.id)}
                  >
                    <Ionicons 
                      name={item.isCompleted ? "checkmark-circle" : "ellipse-outline"} 
                      size={28} 
                      color={item.isCompleted ? colors.primary : colors.textTertiary} 
                    />
                  </TouchableOpacity>
                  
                  <Text style={[
                    styles.itemName, 
                    { color: item.isCompleted ? colors.textTertiary : colors.text },
                    item.isCompleted && { textDecorationLine: 'line-through' }
                  ]}>
                    {item.name}
                  </Text>
                  
                  <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
                    <Ionicons name="close" size={20} color={colors.textTertiary} />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          )}
          <View style={styles.bottomPadding} />
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Add an item... (e.g. Milk)"
            placeholderTextColor={colors.textTertiary}
            value={newItemName}
            onChangeText={setNewItemName}
            onSubmitEditing={handleAddItem}
            returnKeyType="done"
          />
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: newItemName.trim() ? colors.primary : colors.surfaceHighlight }]}
            onPress={handleAddItem}
            disabled={!newItemName.trim()}
          >
            <Ionicons name="add" size={24} color={newItemName.trim() ? '#FFF' : colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.xs,
    width: 40,
  },
  title: {
    fontSize: theme.typography.size.xxl,
    fontFamily: theme.typography.fontFamily.bold,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xs,
  },
  progressText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  clearText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyStateTitle: {
    fontSize: theme.typography.size.xl,
    fontFamily: theme.typography.fontFamily.bold,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyStateDesc: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  list: {
    gap: theme.spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: theme.spacing.md,
  },
  itemName: {
    flex: 1,
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.medium,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  bottomPadding: {
    height: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.lg,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.regular,
    padding: theme.spacing.md,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  }
});
