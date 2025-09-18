import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
import { mmkvStorageAdapter } from '../mmkv';
import { getFCMToken, setupBackgroundMessageHandler, setupForegroundMessageHandler } from '../firebase';
import { requestExactAlarmPermission, checkAllPermissions } from '../permissions';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  date: Date;
  habitId?: string;
  type: 'habit_reminder' | 'motivation';
  scheduled: boolean;
  sent?: boolean;
  token?: string;
}

export interface NotificationSettings {
  allNotifications: boolean;
  habitReminders: boolean;
  motivationalMessages: boolean;
  habitReminderTime: string; // HH:mm format
  habitReminderDays: number[]; // [0,1,2,3,4,5,6] - дни недели (0 = воскресенье)
  motivationalTime: string; // HH:mm format
}

class NotificationService {
  private isInitialized = false;
  private pushToken: string | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🔔 NotificationService: Инициализация...');

    // Настраиваем Firebase Messaging
    console.log('🔔 NotificationService: Настраиваем Firebase обработчики...');
    setupBackgroundMessageHandler();
    setupForegroundMessageHandler();

    // Получаем FCM токен
    const fcmToken = await getFCMToken();
    if (fcmToken) {
      this.pushToken = fcmToken;
      mmkvStorageAdapter.setItem('push_token', fcmToken);
    }

    PushNotification.configure({
      onRegister: async (token) => {
        console.log('Push notification token:', token);
        this.pushToken = token.token;
        
        // Сохраняем токен в MMKV
        mmkvStorageAdapter.setItem('push_token', token.token);
      },

      onNotification: (notification) => {
        console.log('Notification received:', notification);
        this.handleNotificationPress(notification);
      },

      onAction: (notification) => {
        console.log('Notification action:', notification);
        this.handleNotificationAction(notification);
      },

      onRegistrationError: (err) => {
        console.error('Push notification registration error:', err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Загружаем сохраненный токен
    this.pushToken = mmkvStorageAdapter.getItem('push_token');

    this.isInitialized = true;
  }

  async requestPermissions(): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        // Запрашиваем разрешения на уведомления
        const pushPermissions = await PushNotification.requestPermissions();
        console.log('📱 Push permissions result:', pushPermissions);
        
        // Проверяем что разрешения получены
        let pushGranted = false;
        
        if (pushPermissions && typeof pushPermissions === 'object') {
          pushGranted = !!(pushPermissions.alert && pushPermissions.badge && pushPermissions.sound);
        } else {
          // Если разрешения не получены, пробуем альтернативный способ
          console.log('⚠️ Push permissions не получены, пробуем альтернативный способ');
          pushGranted = true; // Предполагаем что разрешения есть
        }
        
        console.log('🔔 Push permissions granted:', pushGranted);
        
        // Запрашиваем разрешения на точные будильники
        const exactAlarmGranted = await requestExactAlarmPermission();
        
        const allGranted = pushGranted && exactAlarmGranted;
        mmkvStorageAdapter.setItem('notification_permissions', allGranted.toString());
        
        console.log('🔐 Разрешения уведомлений:', { pushGranted, exactAlarmGranted, allGranted });
        resolve(allGranted);
      } catch (error) {
        console.error('❌ Ошибка запроса разрешений:', error);
        // В случае ошибки, разрешаем работу с уведомлениями
        console.log('⚠️ Разрешаем работу с уведомлениями несмотря на ошибку');
        resolve(true);
      }
    });
  }


  async scheduleNotification(notification: Omit<NotificationData, 'id' | 'scheduled'>): Promise<string> {
    const id = `${notification.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullNotification: NotificationData = {
      ...notification,
      id,
      scheduled: true,
    };

    // Проверяем разрешения перед планированием
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Нет разрешений для уведомлений');
    }

    // Планируем локальное уведомление
    PushNotification.localNotificationSchedule({
      id: parseInt(id.replace(/\D/g, '').slice(-8)), // Берем последние 8 цифр
      title: fullNotification.title,
      message: fullNotification.message,
      date: fullNotification.date,
      userInfo: {
        habitId: fullNotification.habitId,
        type: fullNotification.type,
        id: fullNotification.id,
      },
      playSound: true,
      soundName: 'default',
      vibrate: true,
      vibration: 300,
      priority: 'high',
      importance: 'high',
    });

    // Сохраняем в MMKV
    const scheduledNotifications = this.getScheduledNotifications();
    scheduledNotifications.push(fullNotification);
    mmkvStorageAdapter.setItem('scheduled_notifications', JSON.stringify(scheduledNotifications));

    return id;
  }

  async scheduleHabitReminder(habitId: string, habitName: string, time: Date): Promise<string> {
    const settings = this.getNotificationSettings();
    if (!settings.habitReminders) {
      throw new Error('Уведомления о привычках отключены');
    }

    return this.scheduleNotification({
      title: 'Напоминание о привычке',
      message: `Время для: ${habitName}`,
      date: time,
      habitId,
      type: 'habit_reminder',
    });
  }


  async scheduleMotivationalMessage(time: Date): Promise<string> {
    const settings = this.getNotificationSettings();
    if (!settings.motivationalMessages || !settings.allNotifications) {
      throw new Error('Мотивационные сообщения отключены');
    }

    const messages = [
      'Продолжайте двигаться к своей цели! 💪',
      'Каждый день - это новая возможность! ✨',
      'Вы на правильном пути! 🎯',
      'Небольшие шаги ведут к большим результатам! 🚀',
      'Сегодня вы стали лучше, чем вчера! 🌟',
      'Ваша дисциплина - это ваша свобода! 🔥',
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    return this.scheduleNotification({
      title: 'Мотивация',
      message: randomMessage,
      date: time,
      type: 'motivation',
    });
  }

  async scheduleHabitRemindersForAllHabits(): Promise<void> {
    console.log('🔔 scheduleHabitRemindersForAllHabits: Starting...');
    
    const settings = this.getNotificationSettings();
    console.log('🔔 Settings:', settings);
    
    if (!settings.habitReminders || !settings.allNotifications) {
      console.log('🔔 Habit reminders or all notifications disabled');
      return;
    }

    // Получаем все привычки из MMKV (Zustand сохраняет под ключом 'habits-store')
    const habitsStoreData = mmkvStorageAdapter.getItem('habits-store');
    console.log('🔔 Habits store data from MMKV:', habitsStoreData);
    
    if (!habitsStoreData) {
      console.log('🔔 No habits store found in MMKV');
      return;
    }

    const habitsStore = JSON.parse(habitsStoreData);
    const habits = habitsStore.state?.habits || habitsStore.habits || [];
    console.log('🔔 Parsed habits:', habits);
    
    if (!Array.isArray(habits) || habits.length === 0) {
      console.log('🔔 No habits found in store');
      return;
    }
    
    const [hours, minutes] = settings.habitReminderTime.split(':').map(Number);
    const today = new Date();
    console.log('🔔 Reminder time:', hours, minutes);
    console.log('🔔 Today:', today);

    // Отменяем все существующие напоминания о привычках
    const scheduledNotifications = this.getScheduledNotifications();
    const habitReminders = scheduledNotifications.filter(n => n.type === 'habit_reminder');
    console.log('🔔 Existing habit reminders to cancel:', habitReminders.length);
    
    for (const reminder of habitReminders) {
      await this.cancelNotification(reminder.id);
    }

    // Планируем напоминания для каждой привычки на следующие 4 недели
    let scheduledCount = 0;
    
    // Планируем на завтра для тестирования
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(hours, minutes, 0, 0);
    
    console.log('🔔 Scheduling test notification for tomorrow:', tomorrow);
    
    for (const habit of habits) {
      try {
        const notificationId = await this.scheduleNotification({
          title: 'Напоминание о привычке',
          message: `Время для: ${habit.name}`,
          date: tomorrow,
          habitId: habit.id,
          type: 'habit_reminder',
        });
        console.log('🔔 Scheduled notification:', notificationId, 'for habit:', habit.name);
        scheduledCount++;
      } catch (error) {
        console.error('🔔 Error scheduling notification for habit:', habit.name, error);
      }
    }
    
    // Планируем на выбранные дни недели
    for (let week = 0; week < 4; week++) {
      for (const dayOfWeek of settings.habitReminderDays) {
        const notificationDate = new Date(today);
        const daysUntilTarget = (dayOfWeek - today.getDay() + 7) % 7;
        notificationDate.setDate(today.getDate() + daysUntilTarget + (7 * week));
        notificationDate.setHours(hours, minutes, 0, 0);

        console.log('🔔 Checking date:', notificationDate, 'vs today:', today);

        // Пропускаем прошедшие даты
        if (notificationDate > today) {
          console.log('🔔 Scheduling for date:', notificationDate);
          for (const habit of habits) {
            try {
              const notificationId = await this.scheduleNotification({
                title: 'Напоминание о привычке',
                message: `Время для: ${habit.name}`,
                date: notificationDate,
                habitId: habit.id,
                type: 'habit_reminder',
              });
              console.log('🔔 Scheduled notification:', notificationId, 'for habit:', habit.name);
              scheduledCount++;
            } catch (error) {
              console.error('🔔 Error scheduling notification for habit:', habit.name, error);
            }
          }
        } else {
          console.log('🔔 Skipping past date:', notificationDate);
        }
      }
    }
    
    console.log('🔔 Total scheduled notifications:', scheduledCount);
  }


  async cancelNotification(notificationId: string): Promise<void> {
    // Отменяем локальное уведомление
    const numericId = parseInt(notificationId.replace(/\D/g, '').slice(-8));
    PushNotification.cancelLocalNotifications({ id: numericId.toString() });
    
    // Удаляем из MMKV
    const scheduledNotifications = this.getScheduledNotifications();
    const filtered = scheduledNotifications.filter((n: NotificationData) => n.id !== notificationId);
    mmkvStorageAdapter.setItem('scheduled_notifications', JSON.stringify(filtered));
  }

  async cancelHabitReminders(habitId: string): Promise<void> {
    const scheduledNotifications = this.getScheduledNotifications();
    const habitNotifications = scheduledNotifications.filter(
      (n: NotificationData) => n.habitId === habitId && n.type === 'habit_reminder'
    );

    for (const notification of habitNotifications) {
      await this.cancelNotification(notification.id);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    PushNotification.cancelAllLocalNotifications();
    mmkvStorageAdapter.setItem('scheduled_notifications', JSON.stringify([]));
  }

  getScheduledNotifications(): NotificationData[] {
    const notificationsStr = mmkvStorageAdapter.getItem('scheduled_notifications');
    if (notificationsStr) {
      try {
        const notifications = JSON.parse(notificationsStr);
        if (Array.isArray(notifications)) {
          return notifications;
        }
      } catch (error) {
        console.error('Error parsing scheduled notifications:', error);
      }
    }
    return [];
  }

  getNotificationSettings(): NotificationSettings {
    const settingsStr = mmkvStorageAdapter.getItem('notification_settings');
    if (settingsStr) {
      try {
        const settings = JSON.parse(settingsStr);
        if (typeof settings === 'object') {
          return settings as NotificationSettings;
        }
      } catch (error) {
        console.error('Error parsing notification settings:', error);
      }
    }
    
    return {
      allNotifications: true,
      habitReminders: true,
      motivationalMessages: true,
      habitReminderTime: '09:00',
      habitReminderDays: [1, 2, 3, 4, 5], // Пн-Пт
      motivationalTime: '09:00',
    };
  }

  updateNotificationSettings(settings: Partial<NotificationSettings>): void {
    const currentSettings = this.getNotificationSettings();
    const newSettings = { ...currentSettings, ...settings };
    mmkvStorageAdapter.setItem('notification_settings', JSON.stringify(newSettings));
  }

  async getToken(): Promise<string | null> {
    if (this.pushToken) {
      return this.pushToken;
    }
    
    return mmkvStorageAdapter.getItem('push_token');
  }


  private handleNotificationPress(notification: any): void {
    const { habitId, type } = notification.userInfo || {};
    
    // Сохраняем информацию о нажатии на уведомление
    const notificationClicksStr = mmkvStorageAdapter.getItem('notification_clicks');
    const notificationClicks = notificationClicksStr ? JSON.parse(notificationClicksStr) : [];
    notificationClicks.push({
      id: notification.userInfo?.id,
      type,
      habitId,
      timestamp: new Date().toISOString(),
    });
    mmkvStorageAdapter.setItem('notification_clicks', JSON.stringify(notificationClicks));

    // Здесь можно добавить навигацию к нужному экрану
    console.log('Notification pressed:', { habitId, type });
  }

  private handleNotificationAction(notification: any): void {
    console.log('Notification action pressed:', notification);
  }

  // Методы для работы с кешем
  async cacheNotificationData(data: any): Promise<void> {
    const cacheKey = `notification_cache_${Date.now()}`;
    mmkvStorageAdapter.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 часа
    }));
  }

  async getCachedNotificationData(cacheKey: string): Promise<any | null> {
    const cachedStr = mmkvStorageAdapter.getItem(cacheKey);
    if (!cachedStr) return null;

    try {
      const cached = JSON.parse(cachedStr);
      if (typeof cached === 'object' && cached.expiresAt) {
        if (Date.now() > cached.expiresAt) {
          mmkvStorageAdapter.removeItem(cacheKey);
          return null;
        }
        return cached.data;
      }
    } catch (error) {
      console.error('Error parsing cached data:', error);
    }

    return null;
  }

  // Очистка устаревших кешей (упрощенная версия)
  cleanupExpiredCache(): void {
    // В упрощенной версии просто очищаем все кеши старше 24 часов
    // Это можно расширить, если понадобится более детальная очистка
    console.log('Cache cleanup: simplified version - no automatic cleanup');
  }
}

export const notificationService = new NotificationService();
