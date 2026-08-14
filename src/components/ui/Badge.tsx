import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../../theme';

interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md';
  isDark?: boolean;
}

export const Badge = ({
  label,
  variant = 'default',
  size = 'md',
  isDark = false,
  style,
  ...props
}: BadgeProps) => {
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { bg: colors.primaryLight, text: colors.primary };
      case 'success':
        return { bg: colors.successLight, text: colors.success };
      case 'warning':
        return { bg: colors.warningLight, text: colors.warning };
      case 'error':
        return { bg: colors.errorLight, text: colors.error };
      case 'info':
        return { bg: colors.infoLight, text: colors.info };
      case 'default':
      default:
        return { bg: colors.surfaceHighlight, text: colors.textSecondary };
    }
  };

  const { bg, text } = getVariantStyles();

  return (
    <View
      style={[
        styles.container,
        styles[`${size}Container`],
        { backgroundColor: bg },
        style,
      ]}
      {...props}
    >
      <Text style={[styles.label, styles[`${size}Label`], { color: text }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.round,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smContainer: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  mdContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
  },
  label: {
    fontFamily: theme.typography.fontFamily.medium,
  },
  smLabel: {
    fontSize: 10,
  },
  mdLabel: {
    fontSize: theme.typography.size.xs,
  },
});
