import { useTaskStore } from '../store/useTaskStore';
import { useFinanceStore } from '../store/useFinanceStore';
import { useGoalStore } from '../store/useGoalStore';
import { useHabitStore } from '../store/useHabitStore';
import { db } from '../db/database';

export const injectDemoData = async () => {
  const { addTask } = useTaskStore.getState();
  const { addExpense, addBudget } = useFinanceStore.getState();
  const { addGoal, addContribution } = useGoalStore.getState();
  const { addHabit } = useHabitStore.getState();

  const today = new Date().toISOString();
  const todayDateStr = today.split('T')[0];

  // Let's add realistic data from mockups
  
  // -- Tasks --
  await addTask({
    title: 'Buy groceries',
    description: 'Milk, Eggs, Bread',
    priority: 'Medium',
    category: 'Errands',
    dueDate: today,
    reminder: true,
    recurring: false,
  });
  await addTask({
    title: 'Complete React Native project',
    description: 'Finish the UI overhaul',
    priority: 'High',
    category: 'Work',
    dueDate: today,
    reminder: true,
    recurring: false,
  });

  // -- Finance --
  await addBudget({
    category: 'Food',
    limit: 5000,
    month: todayDateStr.substring(0, 7), // YYYY-MM
  });
  await addExpense({
    amount: 500,
    category: 'Food',
    date: today,
    paymentMethod: 'Card',
    note: 'Lunch',
  });
  await addExpense({
    amount: 320,
    category: 'Food',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    paymentMethod: 'Cash',
    note: 'Groceries',
  });

  // -- Goals --
  await addGoal({
    name: 'MacBook',
    target: 120000,
    deadline: new Date(Date.now() + 90 * 86400000).toISOString(),
    icon: '💻',
  });
  // Since we don't have the newly created ID returned, we will fetch it from the store
  const { goals } = useGoalStore.getState();
  const macbookGoal = goals.find(g => g.name === 'MacBook');
  if (macbookGoal) {
    await addContribution({
      goalId: macbookGoal.id,
      amount: 46500,
      date: today,
      note: 'Saved from last month',
    });
  }

  // -- Habits --
  await addHabit({
    name: 'Coding',
    frequency: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    reminderTime: '09:00',
    target: 1,
    icon: '💻',
    color: '#4F46E5',
  });

  alert("Demo data loaded successfully!");
};
