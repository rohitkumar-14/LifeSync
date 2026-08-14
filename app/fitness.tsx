import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';
import { useFitnessStore } from '../src/store/useFitnessStore';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const SIZE = width * 0.6;
const STROKE_WIDTH = 16;
const GAP = 4;

const GOALS = {
  steps: 10000,
  calories: 500,
  waterGlasses: 8,
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Ring = ({ radius, color, percentage, delay }: { radius: number, color: string, percentage: number, delay: number }) => {
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    // animate to target percentage
    const target = Math.min(percentage, 1);
    setTimeout(() => {
      progress.value = withTiming(target, { duration: 1500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
    }, delay);
  }, [percentage]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value)
  }));

  return (
    <>
      <Circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={radius}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeOpacity={0.2}
        fill="transparent"
      />
      <AnimatedCircle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={radius}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        fill="transparent"
        strokeDasharray={circumference}
        animatedProps={animatedProps}
        strokeLinecap="round"
        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
      />
    </>
  );
};

export default function FitnessScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const { data, loadData, updateData } = useFitnessStore();

  useEffect(() => {
    loadData();
  }, []);

  const addSteps = () => updateData({ steps: data.steps + 500 });
  const addCalories = () => updateData({ calories: data.calories + 50 });
  const addWater = () => updateData({ waterGlasses: data.waterGlasses + 1 });

  const r1 = (SIZE / 2) - (STROKE_WIDTH / 2);
  const r2 = r1 - STROKE_WIDTH - GAP;
  const r3 = r2 - STROKE_WIDTH - GAP;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Activity</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.ringsContainer}>
          <Svg width={SIZE} height={SIZE}>
            <Ring radius={r1} color="#FF3B30" percentage={data.calories / GOALS.calories} delay={100} />
            <Ring radius={r2} color="#4CD964" percentage={data.steps / GOALS.steps} delay={300} />
            <Ring radius={r3} color="#007AFF" percentage={data.waterGlasses / GOALS.waterGlasses} delay={500} />
          </Svg>
        </View>

        <View style={styles.statsContainer}>
          
          <TouchableOpacity style={[styles.statCard, { backgroundColor: colors.surface }]} onPress={addCalories}>
            <View style={[styles.iconBox, { backgroundColor: '#FF3B3020' }]}>
              <Ionicons name="flame" size={24} color="#FF3B30" />
            </View>
            <View style={styles.statInfo}>
              <Text style={[styles.statValue, { color: colors.text }]}>{data.calories} <Text style={styles.statUnit}>/ {GOALS.calories} kcal</Text></Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Move</Text>
            </View>
            <Ionicons name="add-circle" size={28} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statCard, { backgroundColor: colors.surface }]} onPress={addSteps}>
            <View style={[styles.iconBox, { backgroundColor: '#4CD96420' }]}>
              <Ionicons name="walk" size={24} color="#4CD964" />
            </View>
            <View style={styles.statInfo}>
              <Text style={[styles.statValue, { color: colors.text }]}>{data.steps} <Text style={styles.statUnit}>/ {GOALS.steps}</Text></Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Steps</Text>
            </View>
            <Ionicons name="add-circle" size={28} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statCard, { backgroundColor: colors.surface }]} onPress={addWater}>
            <View style={[styles.iconBox, { backgroundColor: '#007AFF20' }]}>
              <Ionicons name="water" size={24} color="#007AFF" />
            </View>
            <View style={styles.statInfo}>
              <Text style={[styles.statValue, { color: colors.text }]}>{data.waterGlasses} <Text style={styles.statUnit}>/ {GOALS.waterGlasses} glasses</Text></Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Hydration</Text>
            </View>
            <Ionicons name="add-circle" size={28} color={colors.textTertiary} />
          </TouchableOpacity>

        </View>
        
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
    width: 40,
  },
  title: {
    fontSize: theme.typography.size.xxl,
    fontFamily: theme.typography.fontFamily.bold,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  ringsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  statsContainer: {
    gap: theme.spacing.md,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: theme.typography.size.xl,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 4,
  },
  statUnit: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.light.textTertiary,
  },
  statLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bottomPadding: {
    height: 60,
  }
});
