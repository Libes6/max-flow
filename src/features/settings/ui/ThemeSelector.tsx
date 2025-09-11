import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore, Theme } from '../../../shared/lib/stores/useSettingsStore';
import { SettingSelector } from './SettingSelector';

const getThemeOptions = (t: any) => [
  {
    value: 'system',
    label: t('themes.system'),
    description: t('themes.systemDescription'),
    icon: 'phone-portrait',
  },
  {
    value: 'light',
    label: t('themes.light'),
    description: t('themes.lightDescription'),
    icon: 'sunny',
  },
  {
    value: 'dark',
    label: t('themes.dark'),
    description: t('themes.darkDescription'),
    icon: 'moon',
  },
];

export const ThemeSelector: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme, getCurrentTheme } = useSettingsStore();
  
  // Получаем актуальную тему (учитывая системную)
  const currentTheme = getCurrentTheme();

  const themeOptions = getThemeOptions(t);

  const handleThemeSelect = (value: string) => {
    setTheme(value as Theme);
  };

  return (
    <SettingSelector
      title={t('settings.theme')}
      subtitle={theme === 'system' ? t('themes.system') : currentTheme === 'dark' ? t('themes.dark') : t('themes.light')}
      icon={theme === 'system' ? 'phone-portrait-outline' : currentTheme === 'dark' ? 'moon-outline' : 'sunny-outline'}
      options={themeOptions}
      selectedValue={theme}
      onSelect={handleThemeSelect}
    />
  );
};
