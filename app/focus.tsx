import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.75;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const WORK_TIME = 25 * 60; // 25 minutes

export default function FocusScreen() {
  const router = useRouter();
  
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);

  const progress = useSharedValue(1); // 1 to 0

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
        progress.value = withTiming((timeLeft - 1) / WORK_TIME, { duration: 1000, easing: Easing.linear });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a sound or notify here in the future
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
    };
  });

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(WORK_TIME);
    progress.value = withTiming(1, { duration: 500 });
  };

  // Force dark mode aesthetic for focus screen
  const darkColors = theme.colors.dark;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkColors.background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="close" size={28} color={darkColors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={resetTimer} style={styles.headerButton}>
          <Ionicons name="refresh" size={24} color={darkColors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        
        <View style={styles.timerContainer}>
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
            {/* Background Circle */}
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={RADIUS}
              stroke={darkColors.surface}
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <AnimatedCircle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={RADIUS}
              stroke={darkColors.primary}
              strokeWidth={STROKE_WIDTH}
              fill="transparent"
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={animatedProps}
              strokeLinecap="round"
              transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
            />
          </Svg>
          
          <View style={styles.timeTextContainer}>
            <Text style={[styles.timeText, { color: darkColors.text }]}>{formatTime(timeLeft)}</Text>
            <Text style={[styles.statusText, { color: darkColors.textSecondary }]}>
              {isActive ? 'FOCUSING' : 'PAUSED'}
            </Text>
          </View>
        </View>

        <Text style={[styles.messageText, { color: darkColors.textTertiary }]}>
          Put your phone away and focus on the task at hand.
        </Text>

        <TouchableOpacity 
          style={[
            styles.playButton, 
            { backgroundColor: isActive ? darkColors.surfaceHighlight : darkColors.primary }
          ]} 
          onPress={toggleTimer}
        >
          <Ionicons 
            name={isActive ? "pause" : "play"} 
            size={32} 
            color={isActive ? darkColors.text : '#FFF'} 
            style={{ marginLeft: isActive ? 0 : 4 }} 
          />
        </TouchableOpacity>

      </View>
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
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  timerContainer: {
    position: 'relative',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  timeTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 64,
    fontFamily: theme.typography.fontFamily.bold,
    fontVariant: ['tabular-nums'],
  },
  statusText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    letterSpacing: 2,
    marginTop: 8,
  },
  messageText: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: 'center',
    marginBottom: 60,
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  }
});
