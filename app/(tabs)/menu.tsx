import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const itemWidth = (width - theme.spacing.lg * 3) / 2;

export default function MenuScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();

  const menuItems = [
    { id: 'finance', title: 'Finance', icon: 'wallet', color: '#4CAF50', route: '/(tabs)/finance' },
    { id: 'goals', title: 'Goals', icon: 'flag', color: '#FF9800', route: '/(tabs)/goals' },
    { id: 'recipes', title: 'Recipes', icon: 'restaurant', color: '#E91E63', route: '/(tabs)/recipes' },
    { id: 'journal', title: 'Journal', icon: 'book', color: '#9C27B0', route: '/journal' },
    { id: 'fitness', title: 'Fitness', icon: 'fitness', color: '#00BCD4', route: '/fitness' },
    { id: 'groceries', title: 'Groceries', icon: 'cart', color: '#8BC34A', route: '/groceries' },
  ];

  const toolsItems = [
    { id: 'focus', title: 'Focus Timer', icon: 'timer', color: '#F44336', route: '/focus' },
    { id: 'wrapped', title: 'Life Wrapped', icon: 'sparkles', color: '#FFD700', route: '/wrapped' },
  ];

  const renderMenuItem = (item: any) => (
    <TouchableOpacity 
      key={item.id} 
      style={[styles.menuCard, { backgroundColor: colors.surface }]}
      onPress={() => router.push(item.route)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={28} color={item.color} />
      </View>
      <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Menu</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Dashboards</Text>
        <View style={styles.grid}>
          {menuItems.map(renderMenuItem)}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: theme.spacing.xl }]}>Tools & Reports</Text>
        <View style={styles.grid}>
          {toolsItems.map(renderMenuItem)}
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
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
  },
  sectionTitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: itemWidth,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    marginBottom: theme.spacing.lg,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  menuTitle: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.fontFamily.bold,
  },
  bottomPadding: {
    height: 120,
  }
});
