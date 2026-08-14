import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../../theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
  isDark?: boolean;
}

export const Card = ({
  children,
  variant = 'elevated',
  isDark = false,
  style,
  ...props
}: CardProps) => {
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  const getStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          ...theme.shadows.md,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'flat':
        return {
          backgroundColor: colors.surfaceHighlight,
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: colors.surface,
        };
    }
  };

  return (
    <View style={[styles.container, getStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
});
