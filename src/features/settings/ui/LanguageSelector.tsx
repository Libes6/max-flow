import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../shared/theme';
import { useSettingsStore, Language } from '../../../shared/lib/stores/useSettingsStore';
import { spacing, typography } from '../../../shared/theme';
import { OptionSelector, Option } from '../../../shared/ui';

const getLanguageOptions = (t: any): Option[] => [
  { value: 'ru', label: 'Русский', description: 'Russian', icon: 'language-outline' },
  { value: 'en', label: 'English', description: 'English', icon: 'language-outline' },
  { value: 'uk', label: 'Українська', description: 'Ukrainian', icon: 'language-outline' },
  { value: 'kk', label: 'Қазақша', description: 'Kazakh', icon: 'language-outline' },
];

export const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { language, setLanguage } = useSettingsStore();

  const languageOptions = getLanguageOptions(t);
  const currentLanguage = languageOptions.find(option => option.value === language);

  const handleLanguageSelect = (value: string) => {
    setLanguage(value as Language);
  };

  const trigger = (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons name="language-outline" size={20} color={colors.textSecondary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {t('settings.language')}
        </Text>
        <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
          {currentLanguage?.label || t('languages.ru')}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </View>
  );

  return (
    <OptionSelector
      title={t('settings.language')}
      options={languageOptions}
      selectedValue={language}
      onSelect={handleLanguageSelect}
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
