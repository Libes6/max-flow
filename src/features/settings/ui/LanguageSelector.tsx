import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore, Language } from '../../../shared/lib/stores/useSettingsStore';
import { SettingSelector } from './SettingSelector';

const getLanguageOptions = (t: any) => [
  { value: 'ru', label: 'Русский', description: 'Russian', icon: 'language-outline' },
  { value: 'en', label: 'English', description: 'English', icon: 'language-outline' },
  { value: 'uk', label: 'Українська', description: 'Ukrainian', icon: 'language-outline' },
  { value: 'kk', label: 'Қазақша', description: 'Kazakh', icon: 'language-outline' },
];

export const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useSettingsStore();

  const languageOptions = getLanguageOptions(t);

  const handleLanguageSelect = (value: string) => {
    setLanguage(value as Language);
  };

  return (
    <SettingSelector
      title={t('settings.language')}
      subtitle={t('settings.languageSubtitle')}
      icon="language-outline"
      options={languageOptions}
      selectedValue={language}
      onSelect={handleLanguageSelect}
    />
  );
};
