import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';

export default function NotificationsScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Today Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today</Text>
        
        <View style={styles.notificationsList}>
          
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="leaf" size={20} color="#F59E0B" />
            </View>
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={[styles.notiTitle, { color: colors.text }]}>Habit Reminder</Text>
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>2m ago</Text>
              </View>
              <Text style={[styles.notiDesc, { color: colors.textSecondary }]}>
                You haven't completed your coding habit today.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="pie-chart" size={20} color="#10B981" />
            </View>
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={[styles.notiTitle, { color: colors.text }]}>Budget Alert</Text>
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>1h ago</Text>
              </View>
              <Text style={[styles.notiDesc, { color: colors.textSecondary }]}>
                You have used 80% of your food budget.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="checkmark-done" size={20} color="#4F46E5" />
            </View>
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={[styles.notiTitle, { color: colors.text }]}>Task Reminder</Text>
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>2h ago</Text>
              </View>
              <Text style={[styles.notiDesc, { color: colors.textSecondary }]}>
                Complete React Native project is due today.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
              <Ionicons name="flag" size={20} color="#F59E0B" />
            </View>
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={[styles.notiTitle, { color: colors.text }]}>Goal Reminder</Text>
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>1d ago</Text>
              </View>
              <Text style={[styles.notiDesc, { color: colors.textSecondary }]}>
                Add contribution to your MacBook goal.
              </Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* Earlier Section */}
        <View style={styles.earlierRow}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Earlier</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
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
  backBtn: {
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 16,
  },
  notificationsList: {
    gap: 12,
    marginBottom: 32,
  },
  card: {
    flexDirection: 'row',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  notiTitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },
  timeText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  notiDesc: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    lineHeight: 20,
  },
  earlierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#4F46E5',
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.size.sm,
  }
});
