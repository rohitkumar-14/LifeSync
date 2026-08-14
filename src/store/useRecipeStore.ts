import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Recipe {
  id: string;
  title: string;
  prepTime: string;
  calories: string;
  ingredients: string;
  instructions: string;
  createdAt: string;
}

interface RecipeState {
  recipes: Recipe[];
  isLoading: boolean;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  loadRecipes: () => Promise<void>;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  isLoading: false,

  loadRecipes: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem('@lifesyncc_recipes');
      if (stored) {
        set({ recipes: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load recipes:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addRecipe: async (recipeData) => {
    try {
      const newRecipe: Recipe = {
        ...recipeData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      const currentRecipes = get().recipes;
      const updatedRecipes = [newRecipe, ...currentRecipes];
      
      await AsyncStorage.setItem('@lifesyncc_recipes', JSON.stringify(updatedRecipes));
      set({ recipes: updatedRecipes });
    } catch (error) {
      console.error('Failed to add recipe:', error);
    }
  },

  deleteRecipe: async (id) => {
    try {
      const updatedRecipes = get().recipes.filter(r => r.id !== id);
      await AsyncStorage.setItem('@lifesyncc_recipes', JSON.stringify(updatedRecipes));
      set({ recipes: updatedRecipes });
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  },
}));
