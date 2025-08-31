import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography, dimensions } from '../../../shared/theme';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';

const SettingItem: React.FC<{
  title: string;
  subtitle?: string;
  icon: string;
  onPress?: () => void;
}> = ({ title, subtitle, icon, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]} onPress={onPress}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={20} color={colors.textSecondary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );
};

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const settingsData = [
    {
      sectionTitle: t('settings.app'),
      items: [
        {
          title: t('settings.notifications'),
          subtitle: t('settings.notificationsSubtitle'),
          icon: 'notifications-outline',
        },
        {
          title: t('settings.theme'),
          subtitle: t('settings.themeSubtitle'),
          icon: 'moon-outline',
        },
      ],
    },
    {
      sectionTitle: t('settings.data'),
      items: [
        {
          title: t('settings.exportData'),
          subtitle: t('settings.exportDataSubtitle'),
          icon: 'download-outline',
        },
        {
          title: t('settings.importData'),
          subtitle: t('settings.importDataSubtitle'),
          icon: 'cloud-upload-outline',
        },
        {
          title: t('settings.clearData'),
          subtitle: t('settings.clearDataSubtitle'),
          icon: 'trash-outline',
        },
      ],
    },
    {
      sectionTitle: t('settings.about'),
      items: [
        {
          title: t('settings.version'),
          subtitle: t('settings.versionSubtitle'),
          icon: 'information-circle-outline',
        },
        {
          title: t('settings.privacy'),
          icon: 'shield-outline',
        },
        {
          title: t('settings.terms'),
          icon: 'document-text-outline',
        },
      ],
    },
  ];

  const renderSettingItem = ({ item }: { item: any }) => (
    <SettingItem
      title={item.title}
      subtitle={item.subtitle}
      icon={item.icon}
    />
  );

  const renderSection = ({ item }: { item: any }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{item.sectionTitle}</Text>
      {item.items.map((settingItem: any, index: number) => {
        // Пропускаем элемент темы, так как он будет заменен на ThemeSelector
        if (settingItem.title === t('settings.theme')) {
          return null;
        }
        return (
          <SettingItem
            key={index}
            title={settingItem.title}
            subtitle={settingItem.subtitle}
            icon={settingItem.icon}
          />
        );
      })}
      {/* Добавляем селекторы после первой секции */}
      {item.sectionTitle === t('settings.app') && (
        <>
          <LanguageSelector />
          <ThemeSelector />
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('settings.title')}</Text>
      </View>
      
      <FlatList
        data={settingsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSection}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.content}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.xl + dimensions.androidBottomPadding,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
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
