// Цветовая схема приложения

export const colors = {
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

export type ColorKey = keyof typeof colors;
