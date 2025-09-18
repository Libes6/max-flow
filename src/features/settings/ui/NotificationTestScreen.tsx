import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../app/navigation/types';
import { useTranslation } from 'react-i18next';
import { useTheme, spacing } from '../../../shared/theme';
import { Button } from '../../../shared/ui/Button';
import { FormInput } from '../../../shared/ui/FormInput';
import { useNotifications } from '../../../shared/lib/hooks/useNotifications';

export const NotificationTestScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { 
    isInitialized,
    permissions,
    scheduledNotifications,
    scheduleHabitReminder,
    scheduleDailySummary,
    scheduleMotivationalMessage,
    scheduleSyncReminder,
    cancelAllNotifications,
    getToken
  } = useNotifications();

  const [token, setToken] = useState<string | null>(null);
  const [testTime, setTestTime] = useState('00:01'); // Через 1 минуту

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    const pushToken = await getToken();
    setToken(pushToken);
  };

  const getTestTime = () => {
    const [hours, minutes] = testTime.split(':').map(Number);
    const testDate = new Date();
    testDate.setHours(hours, minutes, 0, 0);
    
    // Если время уже прошло, планируем на завтра
    if (testDate <= new Date()) {
      testDate.setDate(testDate.getDate() + 1);
    }
    
    return testDate;
  };

  const testHabitReminder = async () => {
    try {
      const testDate = getTestTime();
      await scheduleHabitReminder('test-habit', 'Тестовая привычка', testDate);
      Alert.alert('✅ Успех', `Напоминание запланировано на ${testDate.toLocaleString()}`);
    } catch (error) {
      Alert.alert('❌ Ошибка', `Не удалось запланировать напоминание: ${error}`);
    }
  };

  const testDailySummary = async () => {
    try {
      const testDate = getTestTime();
      await scheduleDailySummary(testDate);
      Alert.alert('✅ Успех', `Ежедневный отчет запланирован на ${testDate.toLocaleString()}`);
    } catch (error) {
      Alert.alert('❌ Ошибка', `Не удалось запланировать отчет: ${error}`);
    }
  };

  const testMotivationalMessage = async () => {
    try {
      const testDate = getTestTime();
      await scheduleMotivationalMessage(testDate);
      Alert.alert('✅ Успех', `Мотивационное сообщение запланировано на ${testDate.toLocaleString()}`);
    } catch (error) {
      Alert.alert('❌ Ошибка', `Не удалось запланировать сообщение: ${error}`);
    }
  };

  const testSyncReminder = async () => {
    try {
      await scheduleSyncReminder();
      Alert.alert('✅ Успех', 'Напоминание о синхронизации запланировано через 5 минут');
    } catch (error) {
      Alert.alert('❌ Ошибка', `Не удалось запланировать напоминание: ${error}`);
    }
  };

  const testImmediateNotification = async () => {
    try {
      const now = new Date(Date.now() + 2000); // Через 2 секунды
      await scheduleMotivationalMessage(now);
      Alert.alert('✅ Успех', 'Уведомление придет через 2 секунды!');
    } catch (error) {
      Alert.alert('❌ Ошибка', `Не удалось отправить уведомление: ${error}`);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await cancelAllNotifications();
      Alert.alert('✅ Успех', 'Все уведомления отменены');
    } catch (error) {
      Alert.alert('❌ Ошибка', `Не удалось отменить уведомления: ${error}`);
    }
  };

  if (!isInitialized) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <Text style={[styles.text, { color: colors.text }]}>Инициализация уведомлений...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permissions) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <Text style={[styles.text, { color: colors.text }]}>
            Уведомления не разрешены. Включите их в настройках устройства.
          </Text>
          <Button
            title="Назад"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Статус системы
          </Text>
          
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: colors.text }]}>
              ✅ Инициализация: {isInitialized ? 'Завершена' : 'В процессе'}
            </Text>
            <Text style={[styles.statusText, { color: colors.text }]}>
              ✅ Разрешения: {permissions ? 'Предоставлены' : 'Не предоставлены'}
            </Text>
            <Text style={[styles.statusText, { color: colors.text }]}>
              📱 Push токен: {token ? 'Получен' : 'Не получен'}
            </Text>
            <Text style={[styles.statusText, { color: colors.text }]}>
              📋 Запланировано: {scheduledNotifications.length} уведомлений
            </Text>
          </View>

          {token && (
            <View style={styles.tokenContainer}>
              <Text style={[styles.tokenLabel, { color: colors.text }]}>Push токен:</Text>
              <Text style={[styles.tokenText, { color: colors.textSecondary }]} numberOfLines={2}>
                {token}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Настройка времени тестирования
          </Text>
          
          <FormInput
            label="Время уведомления (ЧЧ:ММ)"
            value={testTime}
            onChangeText={setTestTime}
            placeholder="00:01"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Тестирование уведомлений
          </Text>
          
          <View style={styles.buttonGrid}>
            <Button
              title="🚀 Мгновенное уведомление"
              onPress={testImmediateNotification}
              style={styles.testButton}
            />
            
            <Button
              title="⏰ Напоминание о привычке"
              onPress={testHabitReminder}
              style={styles.testButton}
            />
            
            <Button
              title="📊 Ежедневный отчет"
              onPress={testDailySummary}
              style={styles.testButton}
            />
            
            <Button
              title="💪 Мотивационное сообщение"
              onPress={testMotivationalMessage}
              style={styles.testButton}
            />
            
            <Button
              title="🔄 Напоминание о синхронизации"
              onPress={testSyncReminder}
              style={styles.testButton}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Управление уведомлениями
          </Text>
          
          <Button
            title="🗑️ Отменить все уведомления"
            onPress={clearAllNotifications}
            variant="secondary"
            style={styles.clearButton}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Запланированные уведомления ({scheduledNotifications.length})
          </Text>
          
          {scheduledNotifications.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Нет запланированных уведомлений
            </Text>
          ) : (
            scheduledNotifications.map((notification, index) => (
              <View key={notification.id} style={[styles.notificationItem, { backgroundColor: colors.surface }]}>
                <Text style={[styles.notificationTitle, { color: colors.text }]}>
                  {notification.title}
                </Text>
                <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
                  {notification.message}
                </Text>
                <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
                  {new Date(notification.date).toLocaleString()}
                </Text>
                <Text style={[styles.notificationType, { color: colors.primary }]}>
                  Тип: {notification.type}
                </Text>
              </View>
            ))
          )}
        </View>

        <Button
          title="Назад"
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={styles.backButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  statusContainer: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statusText: {
    fontSize: 14,
  },
  tokenContainer: {
    backgroundColor: '#f5f5f5',
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  tokenText: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
  buttonGrid: {
    gap: spacing.sm,
  },
  testButton: {
    marginBottom: spacing.sm,
  },
  clearButton: {
    marginBottom: spacing.sm,
  },
  backButton: {
    marginTop: spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
  notificationItem: {
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  notificationTime: {
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  notificationType: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
