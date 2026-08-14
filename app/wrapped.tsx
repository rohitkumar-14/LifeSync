import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from 'react-native-reanimated';

// Import all stores to get stats
import { useTaskStore } from '../src/store/useTaskStore';
import { useHabitStore } from '../src/store/useHabitStore';
import { useFinanceStore } from '../src/store/useFinanceStore';
import { useRecipeStore } from '../src/store/useRecipeStore';
import { useJournalStore } from '../src/store/useJournalStore';

const { width, height } = Dimensions.get('window');

export default function LifeWrappedScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Collect data
  const { tasks } = useTaskStore();
  const { habits } = useHabitStore();
  const { expenses } = useFinanceStore();
  const { recipes } = useRecipeStore();
  const { entries } = useJournalStore();

  const completedTasks = tasks.filter(t => t.completed).length;
  
  // Calculate best habit streak
  const bestStreak = habits.reduce((max, habit) => {
    let currentStreak = 0;
    habit.completedDates.forEach(date => {
      // Very basic streak logic for demo purposes
      currentStreak++;
    });
    return Math.max(max, currentStreak);
  }, 0);

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Most frequent mood
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topMood = Object.keys(moodCounts).length > 0 
    ? Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b) 
    : '😊';

  const slides = [
    {
      id: 'intro',
      color: '#000000',
      content: (
        <View style={styles.slideContent}>
          <Text style={styles.slideTitle}>Your Year in</Text>
          <Text style={styles.slideHugeText}>LifeSync</Text>
          <Text style={styles.slideSubtitle}>Ready to see what you accomplished?</Text>
        </View>
      )
    },
    {
      id: 'tasks',
      color: '#4361EE',
      content: (
        <View style={styles.slideContent}>
          <Ionicons name="checkmark-done" size={100} color="#FFF" style={styles.icon} />
          <Text style={styles.slideTitle}>You crushed it.</Text>
          <Text style={styles.slideSubtitle}>You completed</Text>
          <Text style={styles.slideHugeText}>{completedTasks}</Text>
          <Text style={styles.slideSubtitle}>tasks this year.</Text>
        </View>
      )
    },
    {
      id: 'habits',
      color: '#4CD964',
      content: (
        <View style={styles.slideContent}>
          <Ionicons name="leaf" size={100} color="#FFF" style={styles.icon} />
          <Text style={styles.slideTitle}>Consistency is key.</Text>
          <Text style={styles.slideSubtitle}>Your longest habit streak was</Text>
          <Text style={styles.slideHugeText}>{bestStreak} Days</Text>
        </View>
      )
    },
    {
      id: 'finance',
      color: '#FF9800',
      content: (
        <View style={styles.slideContent}>
          <Ionicons name="wallet" size={100} color="#FFF" style={styles.icon} />
          <Text style={styles.slideTitle}>Money moves.</Text>
          <Text style={styles.slideSubtitle}>You tracked expenses totaling</Text>
          <Text style={styles.slideHugeText}>${totalSpent.toFixed(0)}</Text>
        </View>
      )
    },
    {
      id: 'mood',
      color: '#9C27B0',
      content: (
        <View style={styles.slideContent}>
          <Text style={{ fontSize: 120, marginBottom: 40 }}>{topMood}</Text>
          <Text style={styles.slideTitle}>This was your vibe.</Text>
          <Text style={styles.slideSubtitle}>Your most frequently logged mood.</Text>
        </View>
      )
    },
    {
      id: 'outro',
      color: '#000000',
      content: (
        <View style={styles.slideContent}>
          <Text style={styles.slideHugeText}>Keep it up.</Text>
          <Text style={styles.slideSubtitle}>See you next year.</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Text style={styles.closeButtonText}>Back to Reality</Text>
          </TouchableOpacity>
        </View>
      )
    }
  ];

  const handlePress = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(s => s + 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: slide.color }]} edges={['top', 'bottom']}>
      
      {/* Progress Bars */}
      <View style={styles.progressContainer}>
        {slides.map((s, index) => (
          <View key={s.id} style={[styles.progressBar, { opacity: index <= currentSlide ? 1 : 0.3 }]} />
        ))}
      </View>

      <TouchableOpacity style={styles.touchArea} activeOpacity={1} onPress={handlePress}>
        <Animated.View 
          key={slide.id}
          entering={FadeInRight.duration(400)}
          exiting={FadeOutLeft.duration(400)}
          style={styles.slideWrapper}
        >
          {slide.content}
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.exitButton}>
        <Ionicons name="close" size={32} color="#FFF" />
      </TouchableOpacity>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 4,
    zIndex: 10,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  touchArea: {
    flex: 1,
  },
  slideWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 40,
  },
  slideTitle: {
    color: '#FFF',
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: 'center',
    marginBottom: 10,
  },
  slideSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: 'center',
    marginTop: 10,
  },
  slideHugeText: {
    color: '#FFF',
    fontSize: 60,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: 'center',
    marginVertical: 10,
    lineHeight: 70,
  },
  exitButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 20,
    padding: 10,
  },
  closeButton: {
    marginTop: 60,
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
  }
});
