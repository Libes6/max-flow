import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography } from '../../../shared/theme';
import { useNavigationContext } from '../../../app/providers/NavigationProvider';

export const AuthChoiceScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { setGuestMode } = useNavigationContext();

  const handleEmailAuth = () => {
    navigation.navigate('Register' as never);
  };

  // const handleGoogleAuth = () => {
  //   // TODO: Реализовать Google авторизацию
  //   console.log('Google auth - будет реализовано позже');
  // };

  const handleContinueWithoutAuth = () => {
    setGuestMode(true);
    navigation.navigate('Main' as never);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('auth.welcome')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('auth.chooseMethod')}
          </Text>
        </View>

        <View style={styles.authOptions}>
          <TouchableOpacity
            style={[styles.authOption, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleEmailAuth}
            activeOpacity={0.7}
          >
            <View style={styles.authOptionContent}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                <Ionicons name="mail-outline" size={24} color={colors.text} />
              </View>
              <View style={styles.authOptionText}>
                <Text style={[styles.authOptionTitle, { color: colors.text }]}>
                  {t('auth.emailAuth')}
                </Text>
                <Text style={[styles.authOptionSubtitle, { color: colors.textSecondary }]}>
                  {t('auth.emailAuthSubtitle')}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[styles.authOption, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleGoogleAuth}
            activeOpacity={0.7}
          >
            <View style={styles.authOptionContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#4285F4' }]}>
                <Ionicons name="logo-google" size={24} color={colors.text} />
              </View>
              <View style={styles.authOptionText}>
                <Text style={[styles.authOptionTitle, { color: colors.text }]}>
                  {t('auth.googleAuth')}
                </Text>
                <Text style={[styles.authOptionSubtitle, { color: colors.textSecondary }]}>
                  {t('auth.googleAuthSubtitle')}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity> */}

          <TouchableOpacity
            style={[styles.authOption, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleContinueWithoutAuth}
            activeOpacity={0.7}
          >
            <View style={styles.authOptionContent}>
              <View style={[styles.iconContainer, { backgroundColor: colors.textSecondary }]}>
                <Ionicons name="phone-portrait-outline" size={24} color={colors.text} />
              </View>
              <View style={styles.authOptionText}>
                <Text style={[styles.authOptionTitle, { color: colors.text }]}>
                  {t('auth.continueWithoutAuth')}
                </Text>
                <Text style={[styles.authOptionSubtitle, { color: colors.textSecondary }]}>
                  {t('auth.continueWithoutAuthSubtitle')}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {t('auth.alreadyHaveAccount')}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>
              {t('auth.signIn')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl * 2,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
  },
  authOptions: {
    gap: spacing.md,
  },
  authOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
  },
  authOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  authOptionText: {
    flex: 1,
  },
  authOptionTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  authOptionSubtitle: {
    ...typography.caption,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl * 2,
    gap: spacing.xs,
  },
  footerText: {
    ...typography.body,
  },
  loginLink: {
    ...typography.body,
    fontWeight: '600',
  },
});
