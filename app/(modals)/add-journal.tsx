import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { useJournalStore } from '../../src/store/useJournalStore';

const MOODS = ['😁', '😊', '😐', '😔', '😫'];

export default function AddJournalEntry() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const { addEntry } = useJournalStore();

  const [mood, setMood] = useState('😊');
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (!content.trim()) return;

    await addEntry({
      mood,
      content: content.trim(),
    });

    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Text style={[styles.headerButtonText, { color: colors.textTertiary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>New Entry</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.headerButton}
          disabled={!content.trim()}
        >
          <Text style={[
            styles.headerButtonText, 
            { color: !content.trim() ? colors.textTertiary : colors.primary, fontFamily: theme.typography.fontFamily.bold }
          ]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>HOW ARE YOU FEELING?</Text>
        <View style={[styles.moodContainer, { backgroundColor: colors.surface }]}>
          {MOODS.map(m => (
            <TouchableOpacity 
              key={m} 
              onPress={() => setMood(m)}
              style={[
                styles.moodButton, 
                mood === m && { backgroundColor: colors.primary + '30', borderColor: colors.primary, borderWidth: 1 }
              ]}
            >
              <Text style={styles.moodEmoji}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: theme.spacing.xl }]}>YOUR THOUGHTS</Text>
        <View style={[styles.formGroup, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.multilineInput, { color: colors.text }]}
            placeholder="What's on your mind today?"
            placeholderTextColor={colors.textTertiary}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            autoFocus
          />
        </View>

      </ScrollView>
    </View>
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
    height: Platform.OS === 'ios' ? 60 : 70,
    borderBottomWidth: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 20,
  },
  headerButton: {
    padding: theme.spacing.sm,
    minWidth: 70,
  },
  headerButtonText: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.medium,
  },
  headerTitle: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.bold,
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
  },
  moodButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moodEmoji: {
    fontSize: 28,
  },
  formGroup: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
  },
  multilineInput: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.regular,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    minHeight: 250,
  }
});
