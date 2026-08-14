import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { useRecipeStore } from '../../src/store/useRecipeStore';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const cardWidth = (width - theme.spacing.lg * 3) / 2;

export default function RecipesScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const { recipes, loadRecipes, deleteRecipe } = useRecipeStore();

  useEffect(() => {
    loadRecipes();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Meal Plan & Recipes</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Recipes</Text>
          <Text style={[styles.recipeCount, { color: colors.textTertiary }]}>{recipes.length} saved</Text>
        </View>

        {recipes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyStateTitle, { color: colors.textSecondary }]}>No Recipes Yet</Text>
            <Text style={[styles.emptyStateDesc, { color: colors.textTertiary }]}>
              Tap the + button to add your first recipe or meal plan.
            </Text>
          </View>
        ) : (
          <View style={styles.recipeGrid}>
            {recipes.map((recipe, index) => (
              <Animated.View 
                key={recipe.id}
                entering={FadeInUp.delay(index * 100).springify()}
                layout={Layout.springify()}
                style={[styles.recipeCard, { backgroundColor: colors.surface }]}
              >
                <View style={[styles.imagePlaceholder, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="fast-food-outline" size={32} color={colors.primary} />
                  <TouchableOpacity 
                    style={[styles.deleteButton, { backgroundColor: colors.surface }]}
                    onPress={() => deleteRecipe(recipe.id)}
                  >
                    <Ionicons name="close" size={16} color={colors.danger} />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.recipeTitle, { color: colors.text }]} numberOfLines={2}>
                    {recipe.title}
                  </Text>
                  <View style={styles.recipeMeta}>
                    <View style={styles.metaBadge}>
                      <Ionicons name="time-outline" size={14} color={colors.textSecondary} style={styles.metaIcon} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>{recipe.prepTime}</Text>
                    </View>
                    <View style={styles.metaBadge}>
                      <Ionicons name="flame-outline" size={14} color={colors.textSecondary} style={styles.metaIcon} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>{recipe.calories}</Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        )}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.size.xxxl,
    fontFamily: theme.typography.fontFamily.bold,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.size.xl,
    fontFamily: theme.typography.fontFamily.bold,
  },
  recipeCount: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  recipeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recipeCard: {
    width: cardWidth,
    borderRadius: theme.radius.xl,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imagePlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  recipeTitle: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.sm,
    height: 44, // forces 2 lines roughly
  },
  recipeMeta: {
    flexDirection: 'column',
    gap: 4,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  bottomPadding: {
    height: 120,
  }
});
