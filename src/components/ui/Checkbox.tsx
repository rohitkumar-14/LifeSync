import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  color?: string;
  isDark?: boolean;
}

export const Checkbox = ({
  checked,
  onToggle,
  size = 24,
  color = theme.colors.light.primary,
  isDark = false,
}: CheckboxProps) => {
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(checked ? 1 : 0) }],
      opacity: withTiming(checked ? 1 : 0),
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(checked ? color : 'transparent'),
      borderColor: withTiming(checked ? color : colors.border),
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle();
      }}
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Animated.View
        style={[
          styles.innerContainer,
          { width: size, height: size, borderRadius: size / 2 },
          animatedContainerStyle,
        ]}
      >
        <Animated.View style={animatedStyle}>
          <Ionicons name="checkmark" size={size * 0.7} color={colors.white} />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
