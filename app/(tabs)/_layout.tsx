import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { theme } from '../../src/theme';
import { useTaskStore } from '../../src/store/useTaskStore';
import { useHabitStore } from '../../src/store/useHabitStore';
import { useFinanceStore } from '../../src/store/useFinanceStore';
import { useGoalStore } from '../../src/store/useGoalStore';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { useRouter } from 'expo-router';

export default function TabsLayout() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const { loadTasks } = useTaskStore();
  const { loadHabits } = useHabitStore();
  const { loadFinances } = useFinanceStore();
  const { loadGoals } = useGoalStore();

  useEffect(() => {
    loadTasks();
    loadHabits();
    loadFinances();
    loadGoals();
  }, []);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.4)' : theme.colors.light.textTertiary,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          height: 80,
          paddingBottom: 20,
          backgroundColor: 'transparent',
        },
        tabBarItemStyle: {
          height: 60,
        },
        tabBarBackground: () => (
          <BlurView 
            tint={isDark ? "dark" : "light"} 
            intensity={80} 
            style={StyleSheet.absoluteFill} 
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-done" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="action"
        options={{
          title: '',
          tabBarButton: () => (
            <View style={styles.fabContainer}>
              <TouchableOpacity 
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/(modals)/action-sheet')}
              >
                <Ionicons name="add" size={32} color="#FFF" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ color, size }) => <Ionicons name="leaf-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      
      {/* Hidden Screens in Tab Navigator (accessible via navigation from Menu/Home) */}
      <Tabs.Screen name="finance" options={{ href: null }} />
      <Tabs.Screen name="goals" options={{ href: null }} />
      <Tabs.Screen name="recipes" options={{ href: null }} />
      <Tabs.Screen name="calendar" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  }
});
