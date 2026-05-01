import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { theme } from '@/theme';
import { springs } from '@/animations/springConfigs';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@/navigation/types';
import Feather from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');
const MAX_STEPS = 3;

// ─── Onboarding slide data ───
interface OnboardingSlide {
  title: string;
  subtitle: string;
  iconName?: string;
  iconSet?: 'feather' | 'material';
  image?: ImageSourcePropType;
}

const slides: OnboardingSlide[] = [
  {
    iconName: 'refresh-cw',
    iconSet: 'feather',
    title: 'Build Consistency',
    subtitle:
      'Transform small actions into lasting rituals with effortless daily tracking.',
  },
  {
    iconName: 'trending-up',
    iconSet: 'feather',
    title: 'Track Progress',
    subtitle:
      'Beautiful visualizations and streaks keep your motivation alive every day.',
  },
  {
    iconName: 'target',
    iconSet: 'feather',
    title: 'Stay Focused',
    subtitle:
      'Subtle reminders and home screen widgets keep your intentions at the heart of your day.',
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const translateX = useSharedValue(0);
  const contextX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    if (currentIndex < MAX_STEPS - 1) {
      const nextIndex = currentIndex + 1;
      translateX.value = withSpring(-nextIndex * width, springs.snappy);
      setCurrentIndex(nextIndex);
    }
  };

  const goToSignIn = () => {
    storage.set(STORAGE_KEYS.ONBOARDING_DONE, true);
    navigation.replace('SignIn');
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
    })
    .onUpdate((event) => {
      translateX.value = contextX.value + event.translationX;
    })
    .onEnd((event) => {
      const threshold = width * 0.2;
      let targetIndex = currentIndex;

      if (event.translationX < -threshold && currentIndex < MAX_STEPS - 1) {
        targetIndex += 1;
      } else if (event.translationX > threshold && currentIndex > 0) {
        targetIndex -= 1;
      }

      translateX.value = withSpring(-targetIndex * width, springs.snappy);
      runOnJS(handleIndexChange)(targetIndex);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    flexDirection: 'row' as const,
    width: width * MAX_STEPS,
    flex: 1,
  }));

  const completeOnboarding = async () => {
    storage.set(STORAGE_KEYS.ONBOARDING_DONE, true);
    navigation.replace('SignIn');
  };

  // ─── Render illustration (icon or image) ───
  const renderIllustration = (slide: OnboardingSlide) => {
    if (slide.image) {
      return (
        <Image
          source={slide.image}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      );
    }
    return <Feather name={slide.iconName || 'help-circle'} size={64} color={theme.colors.primary} />;
  };

  // ─── Pagination dots ───
  const renderDots = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => {
        const dotAnimStyle = useAnimatedStyle(() => {
          const inputRange = [index - 1, index, index + 1];
          const dotWidth = interpolate(
            Math.abs(translateX.value / width),
            inputRange,
            [8, 28, 8],
            Extrapolate.CLAMP,
          );
          const opacity = interpolate(
            Math.abs(translateX.value / width),
            inputRange,
            [0.3, 1, 0.3],
            Extrapolate.CLAMP,
          );
          return {
            width: dotWidth,
            opacity,
          };
        });

        return (
          <Animated.View
            key={index}
            style={[styles.dot, dotAnimStyle, index === currentIndex && styles.dotActive]}
          />
        );
      })}
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.container}>
          <Animated.View style={animatedStyle}>
            {slides.map((slide, index) => (
              <View key={index} style={styles.page}>
                {/* Top bar */}
                <View style={styles.topBar}>
                  {renderDots()}
                  <Text style={styles.stepLabel}>
                    STEP {index + 1} OF {MAX_STEPS}
                  </Text>
                </View>

                {/* Center Content Section */}
                <View style={styles.centerContent}>
                  {/* Illustration */}
                  <View style={styles.illustrationCard}>
                    {renderIllustration(slide)}
                  </View>

                  {/* Content */}
                  <View style={styles.contentSection}>
                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.subtitle}>{slide.subtitle}</Text>
                  </View>
                </View>

                {/* Action buttons */}
                <View style={styles.actionSection}>
                  {index < MAX_STEPS - 1 ? (
                    <>
                      <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={goToNext}
                      >
                        <Text style={styles.primaryButtonText}>
                          CONTINUE JOURNEY
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.skipButton}
                        onPress={goToSignIn}
                      >
                        <Text style={styles.skipButtonText}>SKIP</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <View style={{ height: 24 }} />

                      <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={completeOnboarding}
                      >
                        <Text style={styles.primaryButtonText}>Get Started</Text>
                      </TouchableOpacity>
                      <Text style={styles.footerTagline}>
                        YOUR JOURNEY TO CALM BEGINS NOW
                      </Text>
                    </>
                  )}
                </View>
              </View>
            ))}
          </Animated.View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  page: {
    width,
    flex: 1,
    paddingHorizontal: theme.spacing.containerPadding,
    paddingTop: 56,
    paddingBottom: 32,
  },

  // ─── Top Bar ───
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.primary,
    letterSpacing: 1.5,
  },

  // ─── Pagination ───
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.outlineVariant,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
  },

  // ─── Center Content ───
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  // ─── Illustration ───
  illustrationCard: {
    width: '100%',
    aspectRatio: 1.2,
    backgroundColor: 'rgba(77, 97, 78, 0.05)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    maxHeight: height * 0.3,
    overflow: 'hidden',
  },
  illustrationImage: {
    width: '80%',
    height: '80%',
  },

  // ─── Content ───
  contentSection: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.onBackground,
    fontFamily: theme.typography.fonts.display,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.primary,
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.2,
  },

  // ─── Actions ───
  actionSection: {
    alignItems: 'center',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 9999,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: theme.typography.fonts.primary,
    letterSpacing: 1.5,
  },
  skipButton: {
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.primary,
    letterSpacing: 1.5,
  },

  // ─── Footer ───
  footerTagline: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.outline,
    fontFamily: theme.typography.fonts.primary,
    letterSpacing: 1.5,
    marginTop: 4,
  },
});

export default OnboardingScreen;
