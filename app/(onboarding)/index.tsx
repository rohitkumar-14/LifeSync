import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { useAppStore } from '../../src/store/useAppStore';
import { useRouter } from 'expo-router';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  interpolate, 
  Extrapolation, 
  FadeInUp, 
  FadeInDown,
  FadeIn
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Manage Your Day',
    description: 'Plan tasks, track daily habits, and organize all your routines in one unified space.',
    image: require('../../assets/images/onboarding_slide_1.png'),
    accent: '#4361EE',
  },
  {
    id: '2',
    title: 'Build Better Habits',
    description: 'Stay consistent with intelligent habit streaks, reminders, and daily progress targets.',
    image: require('../../assets/images/onboarding_slide_2.png'),
    accent: '#F59E0B',
  },
  {
    id: '3',
    title: 'Achieve Your Goals',
    description: 'Set ambitious goals, monitor your finance & fitness rings, and celebrate every milestone.',
    image: require('../../assets/images/onboarding_slide_3.png'),
    accent: '#10B981',
  },
];

export default function OnboardingScreen() {
  const setHasCompletedOnboarding = useAppStore((state) => state.setHasCompletedOnboarding);
  const router = useRouter();
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  const insets = useSafeAreaInsets();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<any>(null);
  const scrollX = useSharedValue(0);

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setHasCompletedOnboarding(true);
    router.replace('/(auth)/login');
  };

  const handleDotPress = (index: number) => {
    Haptics.selectionAsync();
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Top Header Branding (No Skip button) */}
      <View style={styles.topHeader}>
        <View style={[styles.brandPill, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name="sparkles" size={14} color={colors.primary} />
          <Text style={[styles.brandText, { color: colors.primary }]}>LifeSync</Text>
        </View>
      </View>

      {/* Main Swipeable Slides Carousel */}
      <View style={styles.carouselWrapper}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={(e) => {
            scrollX.value = e.nativeEvent.contentOffset.x;
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            if (index !== currentIndex && index >= 0 && index < SLIDES.length) {
              setCurrentIndex(index);
            }
          }}
          scrollEventThrottle={16}
        >
          {SLIDES.map((slide) => {
            return (
              <View key={slide.id} style={styles.slide}>
                <View style={styles.textContainer}>
                  <Animated.Text entering={FadeInUp.delay(100).springify()} style={[styles.title, { color: colors.text }]}>
                    {slide.title}
                  </Animated.Text>
                  <Animated.Text entering={FadeInUp.delay(200).springify()} style={[styles.description, { color: colors.textSecondary }]}>
                    {slide.description}
                  </Animated.Text>
                </View>

                <Animated.View 
                  entering={FadeInDown.delay(300).springify()}
                  style={styles.imageContainer}
                >
                  <Image source={slide.image} style={styles.image} resizeMode="contain" />
                </Animated.View>
              </View>
            );
          })}
        </Animated.ScrollView>
      </View>

      {/* Bottom Controls Area */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 8, 20) }]}>
        
        {/* Dynamic Animated Indicator Dots (Expanding Pills) */}
        <View style={styles.paginationRow}>
          {SLIDES.map((_, index) => {
            const animatedDotStyle = useAnimatedStyle(() => {
              const dotWidth = interpolate(
                scrollX.value,
                [(index - 1) * width, index * width, (index + 1) * width],
                [8, 28, 8],
                Extrapolation.CLAMP
              );

              const opacity = interpolate(
                scrollX.value,
                [(index - 1) * width, index * width, (index + 1) * width],
                [0.3, 1, 0.3],
                Extrapolation.CLAMP
              );

              return {
                width: dotWidth,
                opacity,
              };
            });

            return (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => handleDotPress(index)}
                hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.dot,
                    animatedDotStyle,
                    { backgroundColor: colors.primary }
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Button: Get Started on last slide, or Subtle Swipe Navigation on previous slides */}
        <View style={styles.actionContainer}>
          {isLastSlide ? (
            <Animated.View entering={FadeIn.duration(300)} style={styles.buttonWrapper}>
              <Button 
                title="Get Started" 
                onPress={handleFinish} 
                style={styles.button}
                isDark={isDark}
              />
            </Animated.View>
          ) : (
            <TouchableOpacity 
              style={[styles.nextArrowBtn, { backgroundColor: colors.primary }]}
              onPress={() => handleDotPress(currentIndex + 1)}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  brandText: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
  carouselWrapper: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: 8,
    textAlign: 'center',
    includeFontPadding: false,
  },
  description: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: theme.spacing.sm,
    includeFontPadding: false,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
  },
  image: {
    width: width * 0.72,
    height: width * 0.72,
    maxHeight: 260,
  },
  footer: {
    width: '100%',
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    marginBottom: theme.spacing.md,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  actionContainer: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
  nextArrowBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
