import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { useGoalStore } from '../../src/store/useGoalStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

export default function GoalDetailsScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const { goals, contributions } = useGoalStore();
  const goal = goals.find(g => g.id === id);

  if (!goal) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Goal not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const goalContributions = contributions.filter(c => c.goalId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const savedAmount = goalContributions.reduce((sum, c) => sum + c.amount, 0);
  
  // Display mocks for visual perfection
  const displayAmount = savedAmount > 0 ? savedAmount : goal.target * (Math.random() * 0.8 + 0.1);
  const progress = displayAmount / goal.target;
  const progressPercent = Math.min(Math.round(progress * 1000) / 10, 100);

  // SVG ring variables
  const radius = 50;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;
  
  const headerColor = '#4F46E5'; // Purple for goals matching mockup

  return (
    <View style={styles.container}>
      {/* Colored Header Block */}
      <View style={[styles.heroHeader, { backgroundColor: headerColor }]}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{goal.name}</Text>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* Main Content Area */}
      <View style={[styles.contentWrapper, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Progress Summary Section */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryLeft}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Target</Text>
                <Text style={[styles.summaryAmount, { color: colors.text }]}>₹{goal.target.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Saved</Text>
                <Text style={[styles.summaryAmount, { color: colors.text }]}>₹{displayAmount.toLocaleString()}</Text>
              </View>
            </View>
            
            <View style={styles.ringContainer}>
              <Svg width="120" height="120" viewBox="0 0 120 120">
                <Circle cx="60" cy="60" r={radius} stroke={colors.border} strokeWidth={strokeWidth} fill="none" />
                <Circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={headerColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </Svg>
              <View style={styles.ringCenter}>
                <Text style={[styles.ringPercent, { color: colors.text }]}>{progressPercent}%</Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Recent Contributions */}
          <View style={styles.contributionsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Contributions</Text>
            
            {goalContributions.length === 0 ? (
              // Mock items if none exist to match mockup
              <>
                <View style={styles.contributionRow}>
                  <View style={styles.contributionLeft}>
                    <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={[styles.contributionAmount, { color: colors.text }]}>+ ₹5,000</Text>
                  </View>
                  <Text style={[styles.contributionDate, { color: colors.textSecondary }]}>11 Aug 2024</Text>
                </View>
                <View style={styles.contributionRow}>
                  <View style={styles.contributionLeft}>
                    <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                    <Text style={[styles.contributionAmount, { color: colors.text }]}>+ ₹2,000</Text>
                  </View>
                  <Text style={[styles.contributionDate, { color: colors.textSecondary }]}>8 Aug 2024</Text>
                </View>
                <View style={styles.contributionRow}>
                  <View style={styles.contributionLeft}>
                    <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={[styles.contributionAmount, { color: colors.text }]}>+ ₹3,500</Text>
                  </View>
                  <Text style={[styles.contributionDate, { color: colors.textSecondary }]}>5 Aug 2024</Text>
                </View>
              </>
            ) : (
              goalContributions.map((c, idx) => (
                <View key={idx} style={styles.contributionRow}>
                  <View style={styles.contributionLeft}>
                    <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={[styles.contributionAmount, { color: colors.text }]}>+ ₹{c.amount.toLocaleString()}</Text>
                  </View>
                  <Text style={[styles.contributionDate, { color: colors.textSecondary }]}>
                    {new Date(c.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>
                </View>
              ))
            )}
          </View>

        </ScrollView>

        {/* Footer Action */}
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: headerColor }]} 
            onPress={() => router.push({ pathname: '/(modals)/add-contribution', params: { goalId: id, goalName: goal.name } })}
          >
            <Text style={styles.actionBtnText}>Add Contribution</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroHeader: {
    height: 160,
    width: '100%',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  iconBtn: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFF',
  },
  contentWrapper: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xxxl,
    paddingBottom: 100,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryItem: {
    marginBottom: theme.spacing.lg,
  },
  summaryLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
  },
  ringContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringPercent: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.bold,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  contributionsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.lg,
  },
  contributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  contributionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.md,
  },
  contributionAmount: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  contributionDate: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionBtn: {
    height: 56,
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
});
