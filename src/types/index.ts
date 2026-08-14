export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: string;
  dueDate?: string; // ISO date string
  reminder?: boolean;
  recurring?: boolean;
  completed: boolean;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: string[]; // e.g., ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  reminderTime?: string;
  target: number; // e.g., 1 time per day
  createdAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO string
  paymentMethod: string;
  note?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  month: string; // YYYY-MM
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  deadline?: string;
  icon?: string;
  createdAt: string;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string; // ISO string
  note?: string;
}

