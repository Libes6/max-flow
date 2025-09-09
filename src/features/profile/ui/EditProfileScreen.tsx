import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography } from '../../../shared/theme';
import { FormInput } from '../../../shared/ui/FormInput';
import { Button } from '../../../shared/ui/Button';
import { useAuth } from '../../auth/model/useAuth';
import { useProfileStore } from '../model/useProfileStore';
import { editProfileSchema, type EditProfileFormData } from '../model/profile-schemas';

export const EditProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user, refreshAuth } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfileStore();
  
  // Проверяем, что пользователь аутентифицирован
  if (!user) {
    Alert.alert('Ошибка', 'Пользователь не аутентифицирован');
    navigation.goBack();
    return null;
  }
  
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: profile?.name || user?.email?.split('@')[0] || '',
    },
  });

  const handleUpdateProfile = async (formData: EditProfileFormData) => {
    try {
      setIsLoading(true);
      
      // Используем хук синхронизации для обновления профиля
      await updateProfile({
        name: formData.name,
      });
      
      // Обновляем локальное состояние
      await refreshAuth();
      
      Alert.alert(
        'Успех',
        'Профиль успешно обновлен',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      Alert.alert('Ошибка', 'Не удалось обновить профиль');
    } finally {
      setIsLoading(false);
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
            {t('profile.editProfile')}
          </Text>
        </View>

        {/* Блок с информацией */}
        <View style={[styles.infoSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Информация об аккаунте
          </Text>
          
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Имя"
                placeholder="Введите ваше имя"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />
        </View>

        <Button
          title={isLoading ? 'Сохранение...' : 'Сохранить изменения'}
          onPress={handleSubmit(handleUpdateProfile)}
          loading={isLoading}
          style={styles.saveButton}
        />
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
  infoSection: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.lg,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
});