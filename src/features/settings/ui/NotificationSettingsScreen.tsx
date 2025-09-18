import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../app/navigation/types';
import { useTranslation } from 'react-i18next';
import { useTheme, spacing, typography } from '../../../shared/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FormInput } from '../../../shared/ui/FormInput';
import { Button } from '../../../shared/ui/Button';
import { TimePicker } from '../../../shared/ui/TimePicker';
import { DaysOfWeekSelector } from '../../../shared/ui/DaysOfWeekSelector';
import { Switch } from '../../../shared/ui/Switch';
import { useNotifications } from '../../../shared/lib/hooks/useNotifications';

const Header: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        {t('settings.notifications')}
      </Text>
      <View style={styles.headerRight} />
    </View>
  );
};

export const NotificationSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { 
    settings, 
    updateSettings, 
    permissions, 
    scheduleMotivationalMessage,
    scheduleHabitRemindersForAllHabits
  } = useNotifications();

  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);


  const handleSave = async () => {
    try {
      updateSettings(localSettings);
      
      // Планируем новые уведомления если они включены
      if (localSettings.motivationalMessages && localSettings.allNotifications) {
        const [hours, minutes] = localSettings.motivationalTime.split(':').map(Number);
        const motivationalTime = new Date();
        motivationalTime.setHours(hours, minutes, 0, 0);
        if (motivationalTime <= new Date()) {
          motivationalTime.setDate(motivationalTime.getDate() + 1);
        }
        await scheduleMotivationalMessage(motivationalTime);
      }

      // Планируем напоминания о привычках если они включены
      if (localSettings.habitReminders && localSettings.allNotifications) {
        console.log('🔔 NotificationSettingsScreen: Scheduling habit reminders...');
        await scheduleHabitRemindersForAllHabits();
        console.log('🔔 NotificationSettingsScreen: Habit reminders scheduled');
      } else {
        console.log('🔔 NotificationSettingsScreen: Habit reminders disabled', {
          habitReminders: localSettings.habitReminders,
          allNotifications: localSettings.allNotifications
        });
      }

      Alert.alert(t('common.success'), t('settings.notificationsUpdated'));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      Alert.alert(t('common.error'), t('settings.updateError'));
    }
  };



  if (!permissions) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.permissionContainer}>
            <FormInput
              label={t('settings.notificationsDisabled')}
              value={t('settings.notificationsDisabledSubtitle')}
              onChangeText={() => {}}
              multiline
              numberOfLines={3}
              editable={false}
            />
            <Button
              title={t('settings.enableNotifications')}
              onPress={() => {
                // Здесь можно добавить логику для запроса разрешений
                Alert.alert(t('common.info'), t('settings.enableNotificationsInfo'));
              }}
              style={styles.enableButton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        <View style={styles.form}>
          {/* Главный переключатель */}
          <Switch
            label="🔔 Включить все уведомления"
            subtitle="Включить или отключить все уведомления"
            value={localSettings.allNotifications}
            onValueChange={(enabled) => {
              setLocalSettings(prev => ({
                ...prev,
                allNotifications: enabled,
                habitReminders: enabled ? prev.habitReminders : false,
                motivationalMessages: enabled ? prev.motivationalMessages : false,
              }));
            }}
          />

          {/* Мотивационные сообщения */}
          <Switch
            label="📝 Включить мотивации"
            subtitle="Мотивационные сообщения для поддержания привычек"
            value={localSettings.motivationalMessages}
            onValueChange={(enabled) => setLocalSettings(prev => ({
              ...prev,
              motivationalMessages: enabled
            }))}
            disabled={!localSettings.allNotifications}
          />

          {localSettings.motivationalMessages && localSettings.allNotifications && (
            <TimePicker
              label="Время мотивационных сообщений"
              value={localSettings.motivationalTime}
              onChange={(time) => setLocalSettings(prev => ({
                ...prev,
                motivationalTime: time
              }))}
            />
          )}

          {/* Напоминания о привычках */}
          <Switch
            label="⏰ Включить уведомления привычек"
            subtitle="Напоминания о выполнении привычек"
            value={localSettings.habitReminders}
            onValueChange={(enabled) => setLocalSettings(prev => ({
              ...prev,
              habitReminders: enabled
            }))}
            disabled={!localSettings.allNotifications}
          />

          {localSettings.habitReminders && localSettings.allNotifications && (
            <View style={styles.habitSettings}>
              <TimePicker
                label="Время напоминаний"
                value={localSettings.habitReminderTime}
                onChange={(time) => setLocalSettings(prev => ({
                  ...prev,
                  habitReminderTime: time
                }))}
              />
              
              <DaysOfWeekSelector
                selectedDays={localSettings.habitReminderDays}
                onDaysChange={(days) => setLocalSettings(prev => ({
                  ...prev,
                  habitReminderDays: days
                }))}
              />
            </View>
          )}


          <View style={styles.saveButtonContainer}>
            <Button
              title={t('common.save')}
              onPress={handleSave}
              style={styles.saveButton}
            />
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  headerTitle: {
    ...typography.h3,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },
  headerRight: {
    width: 40, // Для центрирования заголовка
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  habitSettings: {
    gap: spacing.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.md,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  enableButton: {
    marginTop: spacing.md,
  },
  saveButtonContainer: {
    marginTop: spacing.lg,
  },
  saveButton: {
    width: '100%',
  },
});
