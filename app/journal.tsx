import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';
import { useJournalStore } from '../src/store/useJournalStore';
import { useRouter } from 'expo-router';
import Animated, { FadeInLeft } from 'react-native-reanimated';

export default function JournalScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const { entries, loadEntries, deleteEntry } = useJournalStore();

  useEffect(() => {
    loadEntries();
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Journal</Text>
        <TouchableOpacity onPress={() => router.push('/(modals)/add-journal')} style={styles.addButton}>
          <Ionicons name="add" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyStateTitle, { color: colors.textSecondary }]}>No Entries Yet</Text>
            <Text style={[styles.emptyStateDesc, { color: colors.textTertiary }]}>
              Tap the + button to log your first thought or mood.
            </Text>
          </View>
        ) : (
          <View style={styles.timeline}>
            {entries.map((entry, index) => (
              <Animated.View 
                key={entry.id}
                entering={FadeInLeft.delay(index * 100).springify()}
                style={styles.entryContainer}
              >
                <View style={styles.dateColumn}>
                  <Text style={[styles.dateText, { color: colors.textSecondary }]}>{formatDate(entry.createdAt)}</Text>
                  <Text style={[styles.timeText, { color: colors.textTertiary }]}>{formatTime(entry.createdAt)}</Text>
                </View>
                
                <View style={styles.timelineLine}>
                  <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                  <View style={[styles.timelineTrack, { backgroundColor: colors.border }]} />
                </View>

                <View style={[styles.entryCard, { backgroundColor: colors.surface }]}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.moodEmoji}>{entry.mood}</Text>
                    <TouchableOpacity onPress={() => deleteEntry(entry.id)}>
                      <Ionicons name="trash-outline" size={18} color={colors.textTertiary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.entryContent, { color: colors.text }]}>{entry.content}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  addButton: {
    padding: theme.spacing.xs,
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
    paddingTop: theme.spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
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
  timeline: {
    paddingLeft: theme.spacing.xs,
  },
  entryContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
  },
  dateColumn: {
    width: 60,
    alignItems: 'flex-end',
    paddingRight: theme.spacing.md,
    paddingTop: 4,
  },
  dateText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: 'right',
  },
  timeText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.regular,
    marginTop: 2,
    textAlign: 'right',
  },
  timelineLine: {
    width: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
    zIndex: 2,
  },
  timelineTrack: {
    position: 'absolute',
    top: 18,
    bottom: -theme.spacing.xl,
    width: 2,
    zIndex: 1,
  },
  entryCard: {
    flex: 1,
    marginLeft: theme.spacing.md,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  moodEmoji: {
    fontSize: 28,
  },
  entryContent: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.regular,
    lineHeight: 24,
  },
  bottomPadding: {
    height: 120,
  }
});
