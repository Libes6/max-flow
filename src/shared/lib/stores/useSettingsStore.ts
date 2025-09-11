import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorageAdapter } from '../mmkv';
import i18n, { getDefaultLanguage as getDefaultLang } from '../i18n';
import { Appearance } from 'react-native';

export type Language = 'ru' | 'en' | 'uk' | 'kk';
export type Theme = 'light' | 'dark' | 'system';

// Функция для получения системной темы
const getSystemTheme = (): 'light' | 'dark' => {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
};

export interface SettingsState {
  language: Language;
  theme: Theme;
  notifications: boolean;
  visualEffects: boolean;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  setNotifications: (enabled: boolean) => void;
  setVisualEffects: (enabled: boolean) => void;
  getCurrentTheme: () => 'light' | 'dark';
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: getDefaultLang() as Language,
      theme: 'system', // По умолчанию используем системную тему
      notifications: true,
      visualEffects: true, // По умолчанию включены визуальные эффекты
      setLanguage: (language: Language) => {
        i18n.changeLanguage(language);
        set({ language });
      },
      setTheme: (theme: Theme) => {
        console.log('SettingsStore: setTheme called with:', theme);
        set({ theme });
        console.log('SettingsStore: theme state updated to:', theme);
      },
      setNotifications: (notifications: boolean) => {
        set({ notifications });
      },
      setVisualEffects: (visualEffects: boolean) => {
        set({ visualEffects });
      },
      getCurrentTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          return getSystemTheme();
        }
        return theme;
      },
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => mmkvStorageAdapter),
    }
  )
);
