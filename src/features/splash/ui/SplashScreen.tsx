import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography, dimensions as themeDimensions } from '../../../shared/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const progressOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const decorativeOpacity = useRef(new Animated.Value(0)).current;
  const decorativeScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const startAnimation = () => {
      // Анимация декоративных элементов
      Animated.timing(decorativeOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      Animated.timing(decorativeScale, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }).start();

      // Анимация логотипа
      Animated.sequence([
        Animated.parallel([
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Вращение логотипа
        Animated.timing(logoRotation, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        // Анимация заголовка
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(titleTranslateY, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.back(1.1)),
            useNativeDriver: true,
          }),
        ]),
        // Анимация подзаголовка
        Animated.parallel([
          Animated.timing(subtitleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
                  Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
        ]),
        // Анимация прогресс-бара
        Animated.timing(progressOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Анимация прогресс-бара
      Animated.timing(progressWidth, {
        toValue: 1,
        duration: 1500,
        delay: 1200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();

      // Завершение сплеш-скрина
      setTimeout(() => {
        onFinish();
      }, 3000);
    };

    startAnimation();
  }, []);

  const logoRotationInterpolate = logoRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="default" 
        backgroundColor={colors.surfaceLight}
        translucent={true}
      />
      
      <View style={styles.content}>
        {/* Логотип */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                { scale: logoScale },
                { rotate: logoRotationInterpolate },
              ],
            },
          ]}
        >
          <View style={styles.logoBackground}>
            <Ionicons name="flash" size={60} color={colors.text} />
          </View>
          {/* Свечение вокруг логотипа */}
          <View style={styles.logoGlow} />
        </Animated.View>

        {/* Заголовок */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          <Text style={styles.title}>Max Flow</Text>
        </Animated.View>

        {/* Подзаголовок */}
        <Animated.View
          style={[
            styles.subtitleContainer,
            {
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslateY }],
            },
          ]}
        >
          <Text style={styles.subtitle}>Управляйте своими привычками</Text>
        </Animated.View>

        {/* Прогресс-бар */}
        <Animated.View
          style={[
            styles.progressContainer,
            {
              opacity: progressOpacity,
            },
          ]}
        >
          <View style={styles.progressBackground}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </Animated.View>
      </View>

      {/* Дополнительные элементы дизайна */}
      <Animated.View
        style={[
          styles.decorativeElements,
          {
            opacity: decorativeOpacity,
            transform: [{ scale: decorativeScale }],
          },
        ]}
      >
        <View style={[styles.decorativeCircle, styles.circle1]} />
        <View style={[styles.decorativeCircle, styles.circle2]} />
        <View style={[styles.decorativeCircle, styles.circle3]} />
        <View style={[styles.decorativeCircle, styles.circle4]} />
        <View style={[styles.decorativeCircle, styles.circle5]} />
      </Animated.View>

      {/* Градиентный фон */}
      <View style={styles.gradientOverlay} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: spacing.xl,
    position: 'relative',
  },
  logoBackground: {
    width: themeDimensions.aw(120),
    height: themeDimensions.aw(120),
    borderRadius: themeDimensions.aw(60),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  logoGlow: {
    position: 'absolute',
    top: themeDimensions.aw(-10),
    left: themeDimensions.aw(-10),
    right: themeDimensions.aw(-10),
    bottom: themeDimensions.aw(-10),
    borderRadius: themeDimensions.aw(70),
    backgroundColor: colors.primary,
    opacity: 0.2,
    zIndex: -1,
  },
  titleContainer: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    fontSize: themeDimensions.aw(36),
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitleContainer: {
    marginBottom: spacing.xl,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: themeDimensions.aw(18),
  },
  progressContainer: {
    width: '100%',
    maxWidth: themeDimensions.aw(200),
  },
  progressBackground: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 1,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.08,
  },
  circle1: {
    width: themeDimensions.aw(120),
    height: themeDimensions.aw(120),
    backgroundColor: colors.primary,
    top: '15%',
    right: themeDimensions.aw(-60),
  },
  circle2: {
    width: themeDimensions.aw(80),
    height: themeDimensions.aw(80),
    backgroundColor: colors.success,
    bottom: '25%',
    left: themeDimensions.aw(-40),
  },
  circle3: {
    width: themeDimensions.aw(100),
    height: themeDimensions.aw(100),
    backgroundColor: colors.warning,
    top: '55%',
    right: '5%',
  },
  circle4: {
    width: themeDimensions.aw(60),
    height: themeDimensions.aw(60),
    backgroundColor: colors.info,
    top: '75%',
    left: '10%',
  },
  circle5: {
    width: themeDimensions.aw(90),
    height: themeDimensions.aw(90),
    backgroundColor: colors.primary,
    top: '35%',
    left: '5%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 0,
  },
});
