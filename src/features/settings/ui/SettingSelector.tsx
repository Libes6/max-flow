import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography } from '../../../shared/theme';
import { OptionSelector, Option } from '../../../shared/ui';

interface SettingSelectorProps {
  title: string;
  subtitle: string;
  icon: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const SettingSelector: React.FC<SettingSelectorProps> = ({
  title,
  subtitle,
  icon,
  options,
  selectedValue,
  onSelect,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const currentOption = options.find(option => option.value === selectedValue);

  const trigger = (
    <View style={[styles.settingItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={20} color={colors.textSecondary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
          {currentOption?.label || subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </View>
  );

  return (
    <OptionSelector
      title={title}
      options={options}
      selectedValue={selectedValue}
      onSelect={onSelect}
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
