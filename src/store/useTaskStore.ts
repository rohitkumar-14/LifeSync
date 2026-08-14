import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Task } from '../types';
import { db } from '../db/database';

const isWeb = Platform.OS === 'web';

interface TaskState {
  tasks: Task[];
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      loadTasks: async () => {
        if (isWeb) return; // Rely on Zustand persist on Web
        try {
      const result = await db.getAllAsync<Task>('SELECT * FROM tasks ORDER BY createdAt DESC');
      // Convert SQLite integer booleans (1/0) to JS booleans if needed
      const tasks = result.map((t) => ({
        ...t,
        completed: Boolean(t.completed),
        reminder: Boolean(t.reminder),
        recurring: Boolean(t.recurring),
      }));
      set({ tasks });
    } catch (e) {
      console.error('Failed to load tasks', e);
    }
  },
  addTask: async (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    
    // Optimistic UI update
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    
    if (isWeb) return;
    try {
      await db.runAsync(
        'INSERT INTO tasks (id, title, description, priority, category, dueDate, reminder, recurring, completed, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          newTask.id,
          newTask.title,
          newTask.description || null,
          newTask.priority,
          newTask.category,
          newTask.dueDate || null,
          newTask.reminder ? 1 : 0,
          newTask.recurring ? 1 : 0,
          0,
          newTask.createdAt,
        ]
      );
    } catch (e) {
      console.error('Failed to add task', e);
      // Revert if needed
      get().loadTasks();
    }
  },
  updateTask: async (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    }));
    
    // Simplistic approach for updating: re-sync entirely or update specific fields
    // Here we just re-save the whole object for simplicity, though an UPDATE statement is better
    if (isWeb) return;
    try {
      const task = get().tasks.find((t) => t.id === id);
      if (task) {
        await db.runAsync(
          'UPDATE tasks SET title = ?, description = ?, priority = ?, category = ?, dueDate = ?, reminder = ?, recurring = ?, completed = ? WHERE id = ?',
          [
            task.title,
            task.description || null,
            task.priority,
            task.category,
            task.dueDate || null,
            task.reminder ? 1 : 0,
            task.recurring ? 1 : 0,
            task.completed ? 1 : 0,
            task.id,
          ]
        );
      }
    } catch (e) {
      console.error('Failed to update task', e);
      get().loadTasks();
    }
  },
  deleteTask: async (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
    if (isWeb) return;
    try {
      await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
    } catch (e) {
      console.error('Failed to delete task', e);
      get().loadTasks();
    }
  },
  toggleTaskCompletion: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    
    const newCompletedState = !task.completed;
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: newCompletedState } : t
      ),
    }));
    
    if (isWeb) return;
    try {
      await db.runAsync('UPDATE tasks SET completed = ? WHERE id = ?', [
        newCompletedState ? 1 : 0,
        id,
      ]);
    } catch (e) {
      console.error('Failed to toggle task', e);
      get().loadTasks();
    }
  },
}),
    {
      name: 'tasks-storage',
      storage: createJSONStorage(() => AsyncStorage),
      skipHydration: !isWeb,
    }
  )
);
