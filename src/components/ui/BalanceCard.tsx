import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

interface BalanceCardProps {
  totalSpent: number;
  totalBudget: number;
  progress: number;
  isDark?: boolean;
}

export const BalanceCard = ({ totalSpent, totalBudget, progress, isDark = false }: BalanceCardProps) => {
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  
  // Define gradient colors based on theme and progress
  const gradientColors = isDark 
    ? ['#2C3E50', '#000000'] // Darker, premium gradient for dark mode
    : ['#4361EE', '#3A0CA3']; // Vibrant blue/purple for light mode
    
  if (progress > 0.9) {
    gradientColors[0] = isDark ? '#4A0E2E' : '#FF4B4B'; // Reddish gradient for warning
    gradientColors[1] = isDark ? '#000000' : '#D41414';
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, theme.shadows.lg]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.label}>Total Balance / Spent</Text>
            <Text style={styles.amount}>${totalSpent.toFixed(2)}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet" size={24} color="#FFFFFF" />
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.budgetInfo}>
            <Text style={styles.budgetLabel}>Monthly Budget</Text>
            <Text style={styles.budgetAmount}>
              ${totalBudget.toFixed(2)} <Text style={{ opacity: 0.7 }}>Limit</Text>
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{Math.round(progress * 100)}% Used</Text>
            <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${Math.min(progress * 100, 100)}%`,
                    backgroundColor: progress > 0.9 ? '#FF4B4B' : '#00F5D4' 
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.xxl,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  content: {
    padding: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xl,
  },
  headerText: {
    flex: 1,
  },
  label: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  amount: {
    fontSize: 40,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  budgetInfo: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 2,
  },
  budgetAmount: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: '#FFFFFF',
  },
  progressContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
