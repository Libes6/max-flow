import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography } from '../../../shared/theme';
import { testSupabaseConnection } from '../../../shared/lib/supabase';

export const SupabaseTestButton: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const isConnected = await testSupabaseConnection();
      if (isConnected) {
        Alert.alert(
          '✅ Успешно!',
          'Подключение к Supabase работает корректно',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          '❌ Ошибка',
          'Не удалось подключиться к Supabase. Проверьте настройки.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        '❌ Ошибка',
        `Ошибка подключения: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: colors.surface, borderBottomColor: colors.border }]} 
      onPress={handleTestConnection}
      disabled={isTesting}
    >
      <View style={styles.settingIcon}>
        <Ionicons 
          name={isTesting ? 'sync' : 'wifi-outline'} 
          size={20} 
          color={isTesting ? colors.primary : colors.textSecondary} 
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {isTesting ? 'Тестирование...' : 'Тест подключения Supabase'}
        </Text>
        <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
          {isTesting ? 'Проверяем соединение...' : 'Проверить подключение к базе данных'}
        </Text>
      </View>
      <Ionicons 
        name={isTesting ? 'sync' : 'chevron-forward'} 
        size={20} 
        color={isTesting ? colors.primary : colors.textTertiary} 
      />
    </TouchableOpacity>
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

