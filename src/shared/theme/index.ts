// Экспорт всех тем

export { colors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';
export { dimensions } from './dimensions';

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
