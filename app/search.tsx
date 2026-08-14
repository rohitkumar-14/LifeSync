import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';
import { useAppColorScheme } from '../src/hooks/useAppColorScheme';

export default function SearchScreen() {
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const router = useRouter();
  const [query, setQuery] = useState('food');
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Expenses', 'Tasks', 'Habits', 'Goals'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      
      {/* Search Header */}
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colors.surfaceHighlight }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={query}
            onChangeText={setQuery}
            placeholder="Search..."
            placeholderTextColor={colors.textTertiary}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
              <Text style={[
                styles.tabText, 
                { color: activeTab === tab ? '#4F46E5' : colors.textSecondary }
              ]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={[styles.activeIndicator, { backgroundColor: '#4F46E5' }]} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Expenses Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Expenses</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            
            <View style={styles.resultItem}>
              <View style={[styles.resultIcon, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="fast-food" size={20} color="#F97316" />
              </View>
              <View style={styles.resultInfo}>
                <Text style={[styles.resultName, { color: colors.text }]}>Lunch</Text>
                <Text style={[styles.resultMeta, { color: colors.textSecondary }]}>
                  <Text style={{ color: '#F97316' }}>Food</Text> • Today
                </Text>
              </View>
              <Text style={[styles.resultAmount, { color: colors.text }]}>₹500</Text>
            </View>

            <View style={[styles.resultItem, { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', marginTop: 12, paddingTop: 12 }]}>
              <View style={[styles.resultIcon, { backgroundColor: '#F3F4F6' }]}>
                <Ionicons name="basket" size={20} color="#EF4444" />
              </View>
              <View style={styles.resultInfo}>
                <Text style={[styles.resultName, { color: colors.text }]}>Groceries</Text>
                <Text style={[styles.resultMeta, { color: colors.textSecondary }]}>
                  <Text style={{ color: '#4F46E5' }}>Food</Text> • 10 Aug
                </Text>
              </View>
              <Text style={[styles.resultAmount, { color: colors.text }]}>₹320</Text>
            </View>

          </View>
        </View>

        {/* Budgets Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Budgets</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.resultItem}>
              <View style={styles.resultInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 6 }}>
                  <Ionicons name="pie-chart" size={16} color="#10B981" />
                  <Text style={[styles.resultName, { color: colors.text }]}>Food Budget</Text>
                </View>
                <Text style={[styles.resultMeta, { color: colors.textSecondary }]}>
                  <Text style={{ color: '#F97316' }}>₹4,000</Text> / ₹5,000
                </Text>
                <View style={[styles.progressBarBg, { backgroundColor: colors.border, marginTop: 8 }]}>
                  <View style={[styles.progressBarFill, { width: '80%', backgroundColor: '#F97316' }]} />
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tasks</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.resultItem}>
              <Ionicons name="radio-button-on" size={24} color="#10B981" style={{ marginRight: 12 }} />
              <View style={styles.resultInfo}>
                <Text style={[styles.resultName, { color: colors.text }]}>Buy groceries</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View all results</Text>
        </TouchableOpacity>

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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.size.md,
    height: '100%',
  },
  cancelBtn: {
    marginLeft: 16,
  },
  cancelText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.size.md,
  },
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tabsContainer: {
    paddingHorizontal: theme.spacing.md,
    gap: 24,
  },
  tab: {
    paddingVertical: 12,
    position: 'relative',
    alignItems: 'center',
  },
  tabText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.size.sm,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: -4,
    right: -4,
    height: 3,
    borderRadius: 2,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 12,
  },
  card: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 4,
  },
  resultMeta: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.fontFamily.medium,
  },
  resultAmount: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.bold,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  viewAllBtn: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  viewAllText: {
    color: '#64748B',
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.size.sm,
  }
});
