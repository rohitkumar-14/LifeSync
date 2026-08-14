import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Button } from '../../src/components/ui/Button';
import { useAppStore } from '../../src/store/useAppStore';
import { useRouter } from 'expo-router';
import { theme } from '../../src/theme';
import { useAppColorScheme } from '../../src/hooks/useAppColorScheme';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, interpolateColor, interpolate, Extrapolation, FadeInUp, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Manage your day',
    description: 'Plan tasks, track habits and organize your work in one place.',
    image: require('../../assets/images/onboarding_slide_1.png'),
    color: theme.colors.light.primary,
  },
  {
    id: '2',
    title: 'Build better habits',
    description: 'Track your daily habits and build consistency with streaks.',
    image: require('../../assets/images/onboarding_slide_2.png'),
    color: theme.colors.light.warning,
  },
  {
    id: '3',
    title: 'Reach your goals',
    description: 'Set goals, track progress and achieve the things that matter.',
    image: require('../../assets/images/onboarding_slide_3.png'),
    color: theme.colors.light.success,
  },
];

export default function OnboardingScreen() {
  const setHasCompletedOnboarding = useAppStore((state) => state.setHasCompletedOnboarding);
  const router = useRouter();
  const isDark = useAppColorScheme();
  const colors = isDark ? theme.colors.dark : theme.colors.light;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);

  const handleFinish = () => {
    setHasCompletedOnboarding(true);
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    } else {
      handleFinish();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.skipContainer}>
        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity onPress={handleFinish} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: '#4F46E5' }]}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={(e) => {
          scrollX.value = e.nativeEvent.contentOffset.x;
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          if (index !== currentIndex) {
            setCurrentIndex(index);
          }
        }}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide, index) => {
          return (
            <View key={slide.id} style={styles.slide}>
              <Animated.Text entering={FadeInUp.delay(200).springify()} style={[styles.title, { color: colors.text }]}>
                {slide.title}
              </Animated.Text>
              <Animated.Text entering={FadeInUp.delay(300).springify()} style={[styles.description, { color: colors.textSecondary }]}>
                {slide.description}
              </Animated.Text>
              <Animated.View 
                entering={FadeInDown.delay(400).springify()}
                style={styles.imageContainer}
              >
                <Image source={slide.image} style={styles.image} resizeMode="contain" />
              </Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => {
            const animatedDotStyle = useAnimatedStyle(() => {
              const opacityAnimation = interpolate(
                scrollX.value,
                [(index - 1) * width, index * width, (index + 1) * width],
                [0.2, 1, 0.2],
                Extrapolation.CLAMP
              );
              return {
                opacity: opacityAnimation,
              };
            });

            return (
              <Animated.View
                key={index.toString()}
                style={[
                  styles.dot,
                  animatedDotStyle,
                  { backgroundColor: '#4F46E5' }
                ]}
              />
            );
          })}
        </View>

        <Button 
          title={currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"} 
          onPress={handleNext} 
          style={styles.button}
          isDark={isDark}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
  },
  skipBtn: {
    padding: theme.spacing.sm,
  },
  skipText: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 80, // Offset for footer
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  image: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    marginTop: theme.spacing.xxxl,
  },
  description: {
    fontSize: theme.typography.size.md,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  button: {
    width: '100%',
  },
});
