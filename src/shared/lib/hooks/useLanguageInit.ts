import { useEffect } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import i18n from '../i18n';

export const useLanguageInit = () => {
  const { language } = useSettingsStore();

  useEffect(() => {
    // Инициализируем язык при первом запуске
    i18n.changeLanguage(language);
  }, []);

  useEffect(() => {
    // Обновляем язык при изменении в store
    i18n.changeLanguage(language);
  }, [language]);
};
