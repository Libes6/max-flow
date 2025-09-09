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
import { registerSchema, type RegisterFormData } from '../model/auth-schemas';

export const RegisterScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { register, isRegisterLoading, registerError, user, isLoading } = useAuth();
  const [isWaitingForProfile, setIsWaitingForProfile] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log('🚀 Starting registration process...');
      setIsWaitingForProfile(true);
      await register(data);
      console.log('✅ Registration completed, showing success alert');
      
      Alert.alert(
        t('auth.registrationSuccess'),
        t('auth.registrationSuccessMessage'),
        [{ 
          text: 'OK', 
          onPress: () => {
            console.log('🎯 Starting profile load check after registration');
            // Ждем загрузки профиля перед переходом (максимум 10 секунд)
            let attempts = 0;
            const maxAttempts = 100; // 10 секунд при проверке каждые 100мс
            
            const checkProfileLoaded = () => {
              attempts++;
              if (!isLoading && user) {
                console.log('✅ Profile loaded, navigating to Main');
                setIsWaitingForProfile(false);
                navigation.navigate('Main' as never);
              } else if (attempts >= maxAttempts) {
                console.log('⏰ Timeout waiting for profile, navigating anyway');
                setIsWaitingForProfile(false);
                navigation.navigate('Main' as never);
              } else {
                console.log(`⏳ Waiting for profile to load... (attempt ${attempts}/${maxAttempts})`);
                setTimeout(checkProfileLoaded, 100);
              }
            };
            checkProfileLoaded();
          }
        }]
      );
    } catch (error) {
      console.error('❌ Registration error:', error);
      setIsWaitingForProfile(false);
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
            {t('auth.createAccount')}
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label={t('auth.firstName')}
                placeholder={t('auth.firstNamePlaceholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.firstName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label={t('auth.lastName')}
                placeholder={t('auth.lastNamePlaceholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.lastName?.message}
              />
            )}
          />

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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label={t('auth.confirmPassword')}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                isPassword
              />
            )}
          />

          {registerError && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: colors.error }]}>
                {registerError.message}
              </Text>
            </View>
          )}

          <Button
            title={isWaitingForProfile ? 'Загрузка профиля...' : t('auth.register')}
            onPress={handleSubmit(onSubmit)}
            loading={isRegisterLoading || isWaitingForProfile}
            disabled={isWaitingForProfile}
            style={styles.submitButton}
          />
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
  loginLink: {
    ...typography.body,
    fontWeight: '600',
  },
});
