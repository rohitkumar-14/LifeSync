import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { useRecipeStore } from '../../src/store/useRecipeStore';

export default function AddRecipe() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const { addRecipe } = useRecipeStore();

  const [title, setTitle] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [calories, setCalories] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSave = async () => {
    if (!title.trim() || !ingredients.trim()) return;

    await addRecipe({
      title: title.trim(),
      prepTime: prepTime.trim() || 'N/A',
      calories: calories.trim() || 'N/A',
      ingredients: ingredients.trim(),
      instructions: instructions.trim(),
    });

    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Text style={[styles.headerButtonText, { color: colors.textTertiary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>New Recipe</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.headerButton}
          disabled={!title.trim() || !ingredients.trim()}
        >
          <Text style={[
            styles.headerButtonText, 
            { color: (!title.trim() || !ingredients.trim()) ? colors.textTertiary : colors.primary, fontFamily: theme.typography.fontFamily.bold }
          ]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.formGroup, { backgroundColor: colors.surface }]}>
          <View style={[styles.formRow, { borderBottomColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Recipe Name (e.g. Avocado Toast)"
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View style={[styles.formRow, { borderBottomColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Prep Time (e.g. 15 mins)"
              placeholderTextColor={colors.textTertiary}
              value={prepTime}
              onChangeText={setPrepTime}
            />
          </View>
          <View style={[styles.formRow, { borderBottomWidth: 0 }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Calories (e.g. 350 kcal)"
              placeholderTextColor={colors.textTertiary}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>INGREDIENTS</Text>
        <View style={[styles.formGroup, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.multilineInput, { color: colors.text }]}
            placeholder="1. Avocado&#10;2. Bread&#10;3. Salt & Pepper"
            placeholderTextColor={colors.textTertiary}
            value={ingredients}
            onChangeText={setIngredients}
            multiline
            textAlignVertical="top"
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>INSTRUCTIONS</Text>
        <View style={[styles.formGroup, { backgroundColor: colors.surface, marginBottom: 40 }]}>
          <TextInput
            style={[styles.multilineInput, { color: colors.text }]}
            placeholder="Step 1: Toast the bread.&#10;Step 2: Mash the avocado.&#10;Step 3: Spread avocado on toast."
            placeholderTextColor={colors.textTertiary}
            value={instructions}
            onChangeText={setInstructions}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
    </View>
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
    height: Platform.OS === 'ios' ? 60 : 70,
    borderBottomWidth: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 20,
  },
  headerButton: {
    padding: theme.spacing.sm,
    minWidth: 70,
  },
  headerButtonText: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.medium,
  },
  headerTitle: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.bold,
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: theme.spacing.lg,
  },
  formGroup: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  formRow: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  input: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.regular,
    minHeight: 30,
  },
  multilineInput: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.regular,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    minHeight: 120,
  },
  sectionTitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});
