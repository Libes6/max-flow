import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography } from '../../../shared/theme';
import { FormInput } from '../../../shared/ui/FormInput';
import { Button } from '../../../shared/ui/Button';
import { useAuth } from '../model/useAuth';
import { loginSchema, type LoginFormData } from '../model/auth-schemas';

export const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { 
    login, 
    isLoginLoading, 
    loginError, 
    resendConfirmation, 
    isResendConfirmationLoading,
    user,
    isLoading
  } = useAuth();
  


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [lastAttemptedEmail, setLastAttemptedEmail] = useState<string>('');
  const [isWaitingForProfile, setIsWaitingForProfile] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('🚀 Starting login process for:', data.email);
      setLastAttemptedEmail(data.email);
      setIsWaitingForProfile(true);
      await login(data);
      console.log('✅ Login completed, waiting for profile to load');
      
      // Ждем загрузки профиля перед переходом (максимум 10 секунд)
      let attempts = 0;
      const maxAttempts = 100; // 10 секунд при проверке каждые 100мс
      
      const checkProfileLoaded = () => {
        attempts++;
        if (!isLoading && user) {
          console.log('✅ Profile loaded, navigating to Main');
          setIsWaitingForProfile(false);
          try {
            navigation.navigate('Main' as never);
            console.log('🎯 Navigation to Main successful');
          } catch (navError) {
            console.error('❌ Navigation error:', navError);
          }
        } else if (attempts >= maxAttempts) {
          console.log('⏰ Timeout waiting for profile, navigating anyway');
          setIsWaitingForProfile(false);
          try {
            navigation.navigate('Main' as never);
          } catch (navError) {
            console.error('❌ Navigation error:', navError);
          }
        } else {
          console.log(`⏳ Waiting for profile to load... (attempt ${attempts}/${maxAttempts})`);
          setTimeout(checkProfileLoaded, 100);
        }
      };
      checkProfileLoaded();
    } catch (error) {
      console.error('❌ Login error:', error);
      setIsWaitingForProfile(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!lastAttemptedEmail) {
      Alert.alert('Ошибка', 'Email не найден');
      return;
    }

    try {
      await resendConfirmation(lastAttemptedEmail);
      Alert.alert(
        'Email отправлен',
        'Письмо с подтверждением отправлено на ваш email. Проверьте почту и перейдите по ссылке подтверждения.'
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось отправить email подтверждения');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('auth.signIn')}
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label={t('auth.email')}
                placeholder={t('auth.emailPlaceholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label={t('auth.password')}
                placeholder={t('auth.passwordPlaceholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                isPassword
              />
            )}
          />

          {loginError && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: colors.error }]}>
                {loginError.message}
              </Text>
              {loginError.message.includes('подтвердите ваш email') && (
                <TouchableOpacity
                  style={[styles.resendButton, { backgroundColor: colors.primary }]}
                  onPress={handleResendConfirmation}
                  disabled={isResendConfirmationLoading}
                >
                  <Text style={[styles.resendButtonText, { color: colors.text }]}>
                    {isResendConfirmationLoading ? 'Отправка...' : 'Отправить подтверждение'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <Button
            title={isWaitingForProfile ? 'Загрузка профиля...' : t('auth.signIn')}
            onPress={() => {
              handleSubmit(onSubmit)();
            }}
            loading={isLoginLoading || isWaitingForProfile}
            disabled={isWaitingForProfile}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {t('auth.dontHaveAccount')}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
            <Text style={[styles.registerLink, { color: colors.primary }]}>
              {t('auth.register')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  backButton: {
    marginRight: spacing.md,
  },
  title: {
    ...typography.h1,
    flex: 1,
  },
  form: {
    flex: 1,
    paddingVertical: spacing.lg,
  },
  errorContainer: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  errorText: {
    ...typography.body,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  footerText: {
    ...typography.body,
  },
  registerLink: {
    ...typography.body,
    fontWeight: '600',
  },
  resendButton: {
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  resendButtonText: {
    ...typography.body,
    fontWeight: '600',
  },
});
