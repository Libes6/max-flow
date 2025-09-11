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
  // Основные цвета (смягченные синие акценты)
  primary: '#4f46e5', // индиго (мягче синего)
  primaryDark: '#4338ca',
  primaryLight: '#e0e7ff', // очень светло-индиго для выделения
  
  // Фон
  background: '#e4e8ec', // светло-серый (мягче белого)
  surface: '#f1f5f9', // еще светлее
  surfaceLight: '#e2e8f0', // еще светлее
  
  // Текст (смягченные)
  text: '#2a3546', // темно-серый (мягче черного)
  textSecondary: '#64748b', // серый (мягче)
  textTertiary: '#94a3b8', // светло-серый
  
  // Статусы (смягченные)
  success: '#16a34a', // зеленый (мягче)
  warning: '#ea580c', // оранжевый (мягче)
  error: '#dc2626', // красный (оставляем для важности)
  info: '#4f46e5', // индиго (как primary)
  
  // Границы (смягченные)
  border: '#e2e8f0', // светло-серый
  borderLight: '#cbd5e1', // серый
  
  // Перекрытия
  overlay: 'rgba(0, 0, 0, 0.05)', // очень прозрачный
  backdrop: 'rgba(255, 255, 255, 0.95)', // почти белый
} as const;

// Экспортируем темную тему по умолчанию для обратной совместимости
export const colors = darkColors;

export type ColorKey = keyof typeof darkColors;
export type LightColorKey = keyof typeof lightColors;
