import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { SwipeableRow } from '../../src/components/ui/SwipeableRow';
import { useTaskStore } from '../../src/store/useTaskStore';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';

type Tab = 'Today' | 'Upcoming' | 'Completed';

export default function TasksScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();

  const { tasks, toggleTaskCompletion, deleteTask } = useTaskStore();
  const [activeTab, setActiveTab] = useState<Tab>('Today');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter(task => {
    const taskDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : todayStr;
    if (activeTab === 'Completed') return task.completed;
    if (activeTab === 'Today') return !task.completed && taskDate <= todayStr;
    if (activeTab === 'Upcoming') return !task.completed && taskDate > todayStr;
    return true;
  });

  const getPriorityStyle = (priority?: string) => {
    switch ((priority || '').toLowerCase()) {
      case 'urgent': return { color: '#8B5CF6' };
      case 'high': return { color: '#EF4444' };
      case 'medium': return { color: '#F59E0B' };
      case 'low': return { color: '#10B981' };
      default: return { color: colors.textSecondary };
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Anytime';
    return new Date(isoString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header with Top-Right Add Task Button */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Tasks</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => router.push('/(modals)/add-task')} 
            style={[styles.headerAddBtn, { backgroundColor: colors.primary }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="add" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/agenda')} style={styles.iconBtn}>
            <Ionicons name="calendar-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['Today', 'Upcoming', 'Completed'] as Tab[]).map(tab => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.textSecondary }]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.cardGroup, { backgroundColor: colors.surface }]}>
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon="checkmark-circle-outline"
              title={`No ${activeTab.toLowerCase()} tasks`}
              description="Tap the + button in the top right to create a new task."
            />
          ) : (
            filteredTasks.map((task, index) => {
              const isLast = index === filteredTasks.length - 1;
              const priorityStyle = getPriorityStyle(task.priority);

              return (
                <Animated.View 
                  key={task.id} 
                  entering={FadeInUp.delay(index * 80).springify().damping(14)}
                  layout={Layout.springify()}
                >
                  <SwipeableRow 
                    onDelete={() => deleteTask(task.id)} 
                    onEdit={() => router.push({ pathname: '/(modals)/add-task', params: { id: task.id } })}
                    isDark={isDark}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.taskRow, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                      onPress={() => toggleTaskCompletion(task.id)}
                    >
                      <View style={[styles.dot, { backgroundColor: task.completed ? colors.textTertiary : colors.primary }]} />
                      
                      <View style={styles.taskInfo}>
                        <Text style={[
                          styles.taskName, 
                          { color: colors.text },
                          task.completed && { color: colors.textSecondary, textDecorationLine: 'line-through' }
                        ]}>
                          {task.title}
                        </Text>
                      </View>
                      
                      <View style={styles.taskMeta}>
                        <Text style={[styles.priorityText, priorityStyle]}>
                          {task.priority || 'Normal'}
                        </Text>
                        <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                          {formatTime(task.dueDate)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </SwipeableRow>
                </Animated.View>
              );
            })
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBtn: {
    padding: theme.spacing.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xl,
  },
  tab: {
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
    includeFontPadding: false,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    left: '10%',
    width: '80%',
    height: 3,
    borderRadius: 1.5,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  cardGroup: {
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
    overflow: 'hidden',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.md,
  },
  taskInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: theme.spacing.md,
  },
  taskName: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  priorityText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.bold,
    includeFontPadding: false,
  },
  timeText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    includeFontPadding: false,
  },
});
