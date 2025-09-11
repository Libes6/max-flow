import React, { useEffect } from 'react';
import { useLanguageInit } from '../../shared/lib/hooks/useLanguageInit';
import { useSettingsStore } from '../../shared/lib/stores/useSettingsStore';
import i18n from '../../shared/lib/i18n';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  useLanguageInit();
  const { language } = useSettingsStore();

  // Инициализируем язык при первом запуске приложения
  useEffect(() => {
    console.log('LanguageProvider: initializing language:', language);
    i18n.changeLanguage(language);
  }, []);

  return <>{children}</>;
};
