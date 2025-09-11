import { useSettingsStore } from '../lib/stores/useSettingsStore';
import { darkColors, lightColors } from './colors';

export const useTheme = () => {
  const { theme, getCurrentTheme } = useSettingsStore();
  
  // Получаем актуальную тему (учитывая системную)
  const currentTheme = getCurrentTheme();
  
  console.log('useTheme: theme setting:', theme, 'current theme:', currentTheme);
  
  const colors = currentTheme === 'dark' ? darkColors : lightColors;
  const isDark = currentTheme === 'dark';
  
  return {
    colors,
    isDark,
    theme: currentTheme,
    themeSetting: theme, // Возвращаем настройку темы (light/dark/system)
  };
};
