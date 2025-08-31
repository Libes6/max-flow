import { useSettingsStore } from '../lib/stores/useSettingsStore';
import { darkColors, lightColors } from './colors';

export const useTheme = () => {
  const { theme } = useSettingsStore();
  
  console.log('useTheme: current theme from store:', theme);
  
  const colors = theme === 'dark' ? darkColors : lightColors;
  const isDark = theme === 'dark';
  
  return {
    colors,
    isDark,
    theme,
  };
};
