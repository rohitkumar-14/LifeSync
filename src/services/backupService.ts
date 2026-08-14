import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';
import { useTaskStore } from '../store/useTaskStore';
import { useHabitStore } from '../store/useHabitStore';
import { useFinanceStore } from '../store/useFinanceStore';
import { useGoalStore } from '../store/useGoalStore';

export async function exportData() {
  try {
    const backupData = {
      version: 1,
      timestamp: new Date().toISOString(),
      data: {
        tasks: useTaskStore.getState().tasks,
        habits: useHabitStore.getState().habits,
        habitCompletions: useHabitStore.getState().completions,
        expenses: useFinanceStore.getState().expenses,
        budgets: useFinanceStore.getState().budgets,
        goals: useGoalStore.getState().goals,
        goalContributions: useGoalStore.getState().contributions,
      }
    };

    const jsonString = JSON.stringify(backupData, null, 2);

    if (Platform.OS === 'web') {
      // Web download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lifesync-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } else {
      // Native export
      const fileName = `lifesync-backup-${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export LifeSync Data',
          UTI: 'public.json'
        });
        return true;
      } else {
        console.warn('Sharing is not available on this device');
        return false;
      }
    }
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}

export async function importData() {
  try {
    if (Platform.OS === 'web') {
      // Create a hidden file input for web
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json,.json';
        input.onchange = async (e: any) => {
          const file = e.target.files?.[0];
          if (!file) return resolve(false);
          const reader = new FileReader();
          reader.onload = async (event) => {
            try {
              const content = event.target?.result as string;
              await processImportContent(content);
              resolve(true);
            } catch (err) {
              console.error('Web import error:', err);
              resolve(false);
            }
          };
          reader.readAsText(file);
        };
        input.click();
      });
    } else {
      // Native import using DocumentPicker
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return false;
      }

      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await processImportContent(fileContent);
      return true;
    }
  } catch (error) {
    console.error('Import failed:', error);
    return false;
  }
}

async function processImportContent(jsonString: string) {
  const parsed = JSON.parse(jsonString);
  if (!parsed || parsed.version !== 1 || !parsed.data) {
    throw new Error('Invalid backup file format');
  }

  const { data } = parsed;

  // On Web, Zustand's persistence will handle saving to AsyncStorage.
  // On Native, SQLite is the source of truth, so we should really clear and insert into SQLite.
  // However, since this is a complex app and we don't want to recreate every single table manually here if we can avoid it, 
  // wait - we need to insert them into SQLite!
  // Let's implement the SQLite update dynamically or just overwrite stores and let the stores know.
  // The safest way is to overwrite the store state, then manually sync to SQLite if native.
  
  // Actually, wait, let's update stores first
  useTaskStore.setState({ tasks: data.tasks || [] });
  useHabitStore.setState({ habits: data.habits || [], completions: data.habitCompletions || [] });
  useFinanceStore.setState({ expenses: data.expenses || [], budgets: data.budgets || [] });
  useGoalStore.setState({ goals: data.goals || [], contributions: data.goalContributions || [] });

  if (Platform.OS !== 'web') {
    // Sync to SQLite
    const { db } = require('../db/database');
    await db.execAsync('BEGIN TRANSACTION;');
    
    try {
      // Clear all data
      await db.execAsync('DELETE FROM tasks; DELETE FROM habits; DELETE FROM habit_completions; DELETE FROM expenses; DELETE FROM budgets; DELETE FROM goals; DELETE FROM goal_contributions;');
      
      // Tasks
      for (const t of (data.tasks || [])) {
        await db.runAsync(
          'INSERT INTO tasks (id, title, description, priority, category, dueDate, reminder, recurring, completed, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [t.id, t.title, t.description, t.priority, t.category, t.dueDate, t.reminder ? 1 : 0, t.recurring ? 1 : 0, t.completed ? 1 : 0, t.createdAt]
        );
      }
      
      // Habits
      for (const h of (data.habits || [])) {
        await db.runAsync(
          'INSERT INTO habits (id, name, icon, color, frequency, reminderTime, target, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [h.id, h.name, h.icon, h.color, JSON.stringify(h.frequency), h.reminderTime, h.target, h.createdAt]
        );
      }
      
      // Habit Completions
      for (const c of (data.habitCompletions || [])) {
        await db.runAsync(
          'INSERT INTO habit_completions (id, habitId, date, completed) VALUES (?, ?, ?, ?)',
          [c.id, c.habitId, c.date, c.completed ? 1 : 0]
        );
      }
      
      // Expenses
      for (const e of (data.expenses || [])) {
        await db.runAsync(
          'INSERT INTO expenses (id, amount, category, date, paymentMethod, note, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [e.id, e.amount, e.category, e.date, e.paymentMethod, e.note, e.createdAt]
        );
      }
      
      // Budgets
      for (const b of (data.budgets || [])) {
        await db.runAsync(
          'INSERT INTO budgets (id, category, limitAmount, month, createdAt) VALUES (?, ?, ?, ?, ?)',
          [b.id, b.category, b.limitAmount, b.month, b.createdAt]
        );
      }
      
      // Goals
      for (const g of (data.goals || [])) {
        await db.runAsync(
          'INSERT INTO goals (id, name, target, deadline, icon, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
          [g.id, g.name, g.target, g.deadline, g.icon, g.createdAt]
        );
      }
      
      // Goal Contributions
      for (const c of (data.goalContributions || [])) {
        await db.runAsync(
          'INSERT INTO goal_contributions (id, goalId, amount, date, note) VALUES (?, ?, ?, ?, ?)',
          [c.id, c.goalId, c.amount, c.date, c.note]
        );
      }
      
      await db.execAsync('COMMIT;');
      
      // Reload stores to ensure they're consistent
      useTaskStore.getState().loadTasks();
      useHabitStore.getState().loadHabits();
      useFinanceStore.getState().loadFinance();
      useGoalStore.getState().loadGoals();
    } catch (err) {
      await db.execAsync('ROLLBACK;');
      console.error('SQLite import sync failed:', err);
      throw err;
    }
  }
}
