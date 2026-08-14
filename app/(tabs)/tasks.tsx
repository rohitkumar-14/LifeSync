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
    if (activeTab === 'Today') return !task.completed && taskDate === todayStr;
    if (activeTab === 'Upcoming') return !task.completed && taskDate > todayStr;
    return true;
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority.toLowerCase()) {
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
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Tasks</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/agenda')} style={styles.iconBtn}>
            <Ionicons name="calendar-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileBtn}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/100?img=11' }} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['Today', 'Upcoming', 'Completed'] as Tab[]).map(tab => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, { color: activeTab === tab ? '#4F46E5' : colors.textSecondary }]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={[styles.activeIndicator, { backgroundColor: '#4F46E5' }]} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.cardGroup, { backgroundColor: colors.surface }]}>
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon="checkmark-circle-outline"
              title={`No ${activeTab.toLowerCase()} tasks`}
              description="You're all caught up! Enjoy your day."
            />
          ) : (
            filteredTasks.map((task, index) => {
              const isLast = index === filteredTasks.length - 1;
              const priorityStyle = getPriorityStyle(task.priority);

              return (
                <Animated.View 
                  key={task.id} 
                  entering={FadeInUp.delay(index * 100).springify().damping(14)}
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
                      <View style={[styles.dot, { backgroundColor: '#4F46E5' }]} />
                      
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

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: '#4F46E5' }]} 
        onPress={() => router.push('/(modals)/add-task')}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
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
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconBtn: {
    padding: theme.spacing.xs,
  },
  profileBtn: {
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 20,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    paddingBottom: 120, // leave space for bottom tab bar
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
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  priorityText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },
  timeText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
