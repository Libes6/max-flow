import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { useSettingsStore } from '../stores/useSettingsStore';

export const useSystemThemeListener = () => {
  const { theme, setTheme } = useSettingsStore();

  useEffect(() => {
    // Если тема установлена в 'system', слушаем изменения системной темы
    if (theme === 'system') {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        console.log('System theme changed to:', colorScheme);
        // Принудительно обновляем компоненты, которые используют тему
        // Это делается через изменение состояния store
        setTheme('system'); // Это вызовет перерендер компонентов
      });

      return () => subscription?.remove();
    }
  }, [theme, setTheme]);
};
