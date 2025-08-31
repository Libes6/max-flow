import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../../shared/lib/stores/useSettingsStore';
import { SettingSelector } from './SettingSelector';

const getThemeOptions = (t: any) => [
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
  const { theme, setTheme } = useSettingsStore();

  const themeOptions = getThemeOptions(t);

  const handleThemeSelect = (value: string) => {
    console.log('ThemeSelector: handleThemeSelect called with value:', value);
    console.log('ThemeSelector: current theme before change:', theme);
    setTheme(value as 'light' | 'dark');
    console.log('ThemeSelector: theme changed to:', value);
  };

  return (
    <SettingSelector
      title={t('settings.theme')}
      subtitle={t('settings.themeSubtitle')}
      icon={theme === 'dark' ? 'moon-outline' : 'sunny-outline'}
      options={themeOptions}
      selectedValue={theme}
      onSelect={handleThemeSelect}
    />
  );
};
