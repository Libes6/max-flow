import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorageAdapter } from '../mmkv';
import i18n, { getDefaultLanguage as getDefaultLang } from '../i18n';

export type Language = 'ru' | 'en' | 'uk' | 'kk';

export interface SettingsState {
  language: Language;
  theme: 'light' | 'dark';
  notifications: boolean;
  setLanguage: (language: Language) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setNotifications: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: getDefaultLang() as Language,
      theme: 'light',
      notifications: true,
      setLanguage: (language: Language) => {
        i18n.changeLanguage(language);
        set({ language });
      },
      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
      },
      setNotifications: (notifications: boolean) => {
        set({ notifications });
      },
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => mmkvStorageAdapter),
    }
  )
);
