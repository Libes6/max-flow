// Цветовые схемы приложения

export const darkColors = {
  // Основные цвета
  primary: '#8b5cf6', // фиолетовый
  primaryDark: '#7c3aed',
  primaryLight: '#1e1b4b', // темно-фиолетовый для выделения
  
  // Фон
  background: '#0f0f23', // темно-синий
  surface: '#1a1a2e', // темно-серый
  surfaceLight: '#16213e', // чуть светлее
  
  // Текст
  text: '#ffffff',
  textSecondary: '#a3a3a3',
  textTertiary: '#6b7280',
  
  // Статусы
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Границы
  border: '#374151',
  borderLight: '#4b5563',
  
  // Перекрытия
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(15, 15, 35, 0.8)',
} as const;

export const lightColors = {
  // Основные цвета (синие акценты)
  primary: '#2563eb', // синий
  primaryDark: '#1d4ed8',
  primaryLight: '#dbeafe', // светло-синий для выделения
  
  // Фон
  background: '#ffffff', // белый
  surface: '#f8fafc', // светло-серый
  surfaceLight: '#f1f5f9', // еще светлее
  
  // Текст
  text: '#0f172a', // темно-синий
  textSecondary: '#475569', // серый
  textTertiary: '#94a3b8', // светло-серый
  
  // Статусы
  success: '#059669', // зеленый
  warning: '#d97706', // оранжевый
  error: '#dc2626', // красный
  info: '#2563eb', // синий
  
  // Границы
  border: '#e2e8f0', // светло-серый
  borderLight: '#cbd5e1', // серый
  
  // Перекрытия
  overlay: 'rgba(0, 0, 0, 0.1)',
  backdrop: 'rgba(255, 255, 255, 0.9)',
} as const;

// Экспортируем темную тему по умолчанию для обратной совместимости
export const colors = darkColors;

export type ColorKey = keyof typeof darkColors;
export type LightColorKey = keyof typeof lightColors;
