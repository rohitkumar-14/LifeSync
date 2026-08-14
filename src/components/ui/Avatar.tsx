import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { theme } from '../../theme';

interface AvatarProps {
  source?: ImageSourcePropType;
  fallback?: string;
  size?: number;
  isDark?: boolean;
}

export const Avatar = ({
  source,
  fallback = 'U',
  size = 40,
  isDark = false,
}: AvatarProps) => {
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primaryLight,
        },
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <Text
          style={[
            styles.fallbackText,
            { color: colors.primary, fontSize: size * 0.4 },
          ]}
        >
          {fallback.substring(0, 1).toUpperCase()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fallbackText: {
    fontFamily: theme.typography.fontFamily.semiBold,
  },
});
