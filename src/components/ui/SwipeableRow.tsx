import React, { useRef } from 'react';
import { Animated, StyleSheet, View, I18nManager } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import * as Haptics from 'expo-haptics';

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
  isDark: boolean;
}

export function SwipeableRow({ children, onDelete, onEdit, isDark }: SwipeableRowProps) {
  const swipeableRow = useRef<Swipeable>(null);

  const renderRightAction = (
    text: string,
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation<number>,
    iconName: keyof typeof Ionicons.glyphMap,
    onPress: () => void
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    
    const pressHandler = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      swipeableRow.current?.close();
      onPress();
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}>
          <Ionicons name={iconName} size={24} color="#fff" />
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>
  ) => {
    const actionsCount = (onEdit ? 1 : 0) + (onDelete ? 1 : 0);
    if (actionsCount === 0) return null;
    
    const actionWidth = 80;
    
    return (
      <View
        style={{
          width: actionWidth * actionsCount,
          flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        }}>
        {onEdit && renderRightAction('Edit', theme.colors.light.primary, actionWidth * (actionsCount === 2 ? 2 : 1), progress, 'pencil', onEdit)}
        {onDelete && renderRightAction('Delete', theme.colors.light.error, actionWidth, progress, 'trash', onDelete)}
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRow}
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={renderRightActions}
      onSwipeableOpen={(direction) => {
        if (direction === 'right') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}>
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
