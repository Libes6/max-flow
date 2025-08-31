import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Базовые размеры для разных экранов
const baseWidth = 375; // iPhone X ширина
const baseHeight = 812; // iPhone X высота

// Утилиты для относительных размеров
export const dimensions = {
  // Относительная ширина (от 0 до 1)
  rw: (percentage: number) => screenWidth * percentage,
  
  // Относительная высота (от 0 до 1)
  rh: (percentage: number) => screenHeight * percentage,
  
  // Адаптивная ширина на основе базовой ширины
  aw: (width: number) => (width / baseWidth) * screenWidth,
  
  // Адаптивная высота на основе базовой высоты
  ah: (height: number) => (height / baseHeight) * screenHeight,
  
  // Размеры экрана
  screenWidth,
  screenHeight,
  
  // Базовые размеры
  baseWidth,
  baseHeight,
  
  // Отступы для таб бара
  tabBarHeight: 64,
  tabBarPaddingBottom: 55,
  
  // Дополнительные отступы для Android
  androidBottomPadding: 80,
} as const;

export type DimensionsKey = keyof typeof dimensions;
