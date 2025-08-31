import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/theme';
import { useSettingsStore } from '../../../shared/lib/stores/useSettingsStore';
import { spacing, typography } from '../../../shared/theme';
import { OptionSelector, Option } from '../../../shared/ui';

const getThemeOptions = (t: any): Option[] => [
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
  const { colors } = useTheme();
  const { theme, setTheme } = useSettingsStore(); // Получаем theme напрямую из store

  const themeOptions = getThemeOptions(t);
  const currentTheme = themeOptions.find(option => option.value === theme);

  const handleThemeSelect = (value: string) => {
    console.log('ThemeSelector: handleThemeSelect called with value:', value);
    console.log('ThemeSelector: current theme before change:', theme);
    setTheme(value as 'light' | 'dark');
    console.log('ThemeSelector: theme changed to:', value);
  };

  const trigger = (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons 
          name={theme === 'dark' ? 'moon-outline' : 'sunny-outline'} 
          size={20} 
          color={colors.textSecondary} 
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {t('settings.theme')}
        </Text>
        <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
          {currentTheme?.label || t('settings.themeSubtitle')}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </View>
  );

  return (
    <OptionSelector
      title={t('settings.theme')}
      options={themeOptions}
      selectedValue={theme}
      onSelect={handleThemeSelect}
      trigger={trigger}
    />
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    ...typography.caption,
  },
});
