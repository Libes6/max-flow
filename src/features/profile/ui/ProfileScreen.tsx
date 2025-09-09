import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography } from '../../../shared/theme';
import { useAuth } from '../../auth/model/useAuth';
import { useProfileStore } from '../model/useProfileStore';
import { LanguageSelector } from '../../settings/ui/LanguageSelector';
import { ThemeSelector } from '../../settings/ui/ThemeSelector';
import { useNavigationContext } from '../../../app/providers/NavigationProvider';
import { useGlobalBottomSheet } from '../../../shared/ui/GlobalBottomSheet';
import { useSettingsStore } from '../../../shared/lib/stores/useSettingsStore';

const ProfileHeader: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user, isAuthenticated, session, isLoading, refreshAuth } = useAuth();
  const { profile, loading: profileLoading, initialized } = useProfileStore();
  const { isGuestMode, setGuestMode } = useNavigationContext();

  const handleAuthPress = () => {
    if (isAuthenticated) {
      navigation.navigate('EditProfile' as never);
    } else if (isGuestMode) {
      // В гостевом режиме - выходим из него и переходим к авторизации
      setGuestMode(false);
      navigation.navigate('Auth' as never);
    } else {
      navigation.navigate('Auth' as never);
    }
  };

  return (
    <View style={styles.profileCardContainer}>
      <TouchableOpacity
        style={[styles.profileCard, { backgroundColor: colors.surface }]}
        onPress={handleAuthPress}
        activeOpacity={0.7}
      >
        <View style={styles.profileCardContent}>
          <View style={styles.profileLeft}>
            <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
              {isAuthenticated && user?.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
              ) : (
                <Ionicons name="person" size={24} color="white" />
              )}
            </View>
          </View>
          
          <View style={styles.profileCenter}>
            {isLoading ? (
              <>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  Загрузка...
                </Text>
                <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                  Проверка авторизации
                </Text>
              </>
            ) : isAuthenticated && profile ? (
              <>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  {profile.name || 'Пользователь'}
                </Text>
                <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                  {profile.email}
                </Text>
              </>
            ) : isAuthenticated ? (
              <>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  {user?.email?.split('@')[0] || 'Пользователь'}
                </Text>
                <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                  {user?.email}
                </Text>
              </>
            ) : isGuestMode ? (
              <>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  {t('profile.guestMode')}
                </Text>
                <Text style={[styles.profileEmail, { color: colors.primary }]}>
                  {t('profile.tapToLogin')}
                </Text>
              </>
            ) : (
              <>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  {t('profile.notAuthenticated')}
                </Text>
                <Text style={[styles.profileEmail, { color: colors.primary }]}>
                  {t('profile.registerNow')}
                </Text>
              </>
            )}
          </View>
          
          <View style={styles.profileRight}>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const SettingItem: React.FC<{
  title: string;
  subtitle?: string;
  icon: string;
  onPress?: () => void;
}> = ({ title, subtitle, icon, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: colors.surface }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
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

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { openBottomSheet, closeBottomSheet } = useGlobalBottomSheet();
  const { language, theme, setLanguage, setTheme } = useSettingsStore();

  // Обработчики для языка и темы
  const handleLanguagePress = () => {
    const languageOptions = [
      { value: 'ru', label: 'Русский', description: 'Russian', icon: 'language-outline' },
      { value: 'en', label: 'English', description: 'English', icon: 'language-outline' },
      { value: 'uk', label: 'Українська', description: 'Ukrainian', icon: 'language-outline' },
      { value: 'kk', label: 'Қазақша', description: 'Kazakh', icon: 'language-outline' },
    ];

    const content = (
      <View style={{ padding: 16 }}>
        {languageOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionItem,
              { backgroundColor: colors.surface },
              option.value === language && {
                borderColor: colors.primary,
                borderWidth: 2,
              },
            ]}
            onPress={() => {
              setLanguage(option.value as any);
              closeBottomSheet();
            }}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionIcon}>
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={option.value === language ? colors.primary : colors.textSecondary}
                />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  {option.description}
                </Text>
              </View>
            </View>
            {option.value === language && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );

    openBottomSheet(t('settings.language'), content);
  };

  const handleThemePress = () => {
    const themeOptions = [
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

    const content = (
      <View style={{ padding: 16 }}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionItem,
              { backgroundColor: colors.surface },
              option.value === theme && {
                borderColor: colors.primary,
                borderWidth: 2,
              },
            ]}
            onPress={() => {
              setTheme(option.value as 'light' | 'dark');
              closeBottomSheet();
            }}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionIcon}>
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={option.value === theme ? colors.primary : colors.textSecondary}
                />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  {option.description}
                </Text>
              </View>
            </View>
            {option.value === theme && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );

    openBottomSheet(t('settings.theme'), content);
  };





  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('profile.title')}</Text>
      </View>

      <ProfileHeader />
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.settingsGroup}>
          <SettingItem
            title={t('settings.language')}
            subtitle={t('settings.languageSubtitle')}
            icon="language-outline"
            onPress={handleLanguagePress}
          />
          <SettingItem
            title={t('settings.theme')}
            subtitle={t('settings.themeSubtitle')}
            icon={theme === 'dark' ? 'moon-outline' : 'sunny-outline'}
            onPress={handleThemePress}
          />
          <SettingItem
            title={t('profile.notifications')}
            subtitle={t('profile.notificationsSubtitle')}
            icon="notifications-outline"
          />
          <SettingItem
            title={t('profile.version')}
            subtitle="1.0.0"
            icon="information-circle-outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  title: {
    ...typography.h2,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  profileCardContainer: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  profileCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  profileLeft: {
    marginRight: spacing.md,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileCenter: {
    flex: 1,
  },
  profileName: {
    ...typography.h3,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileEmail: {
    ...typography.bodySmall,
  },
  profileRight: {
    marginLeft: spacing.sm,
  },
  settingsGroup: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    marginBottom: spacing.sm,
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
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  optionDescription: {
    ...typography.caption,
  },
});
