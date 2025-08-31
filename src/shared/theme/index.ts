// Экспорт всех тем

export { colors, darkColors, lightColors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';
export { dimensions } from './dimensions';
export { useTheme } from './useTheme';

// Импортируем для создания объединенной темы
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

// Объединенная тема
export const theme = {
  colors,
  spacing,
  typography,
} as const;
