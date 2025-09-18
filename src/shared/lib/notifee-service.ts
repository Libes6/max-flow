import notifee, { 
  AndroidImportance, 
  AndroidVisibility, 
  AndroidCategory,
  AuthorizationStatus,
  TriggerType,
  TimeUnit,
  RepeatFrequency
} from '@notifee/react-native';
import { Platform } from 'react-native';

export interface NotifeeNotificationData {
  id: string;
  title: string;
  body: string;
  date: Date;
  type: string;
  habitId?: string;
  data?: Record<string, any>;
}

class NotifeeService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Запрашиваем разрешения
      const settings = await notifee.requestPermission();
      
      if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        console.log('✅ Notifee разрешения получены');
      } else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
        console.log('❌ Notifee разрешения отклонены');
      }

      // Настраиваем каналы уведомлений
      await this.createNotificationChannels();

      this.isInitialized = true;
      console.log('✅ NotifeeService инициализирован');
    } catch (error) {
      console.error('❌ Ошибка инициализации NotifeeService:', error);
    }
  }

  private async createNotificationChannels(): Promise<void> {
    // Канал для привычек
    await notifee.createChannel({
      id: 'habits',
      name: 'Напоминания о привычках',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      sound: 'default',
      vibration: true,
    });

    // Канал для общих уведомлений
    await notifee.createChannel({
      id: 'general',
      name: 'Общие уведомления',
      importance: AndroidImportance.DEFAULT,
      visibility: AndroidVisibility.PUBLIC,
      sound: 'default',
    });

    // Канал для тестовых уведомлений
    await notifee.createChannel({
      id: 'test',
      name: 'Тестовые уведомления',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      sound: 'default',
      vibration: true,
    });
  }

  async scheduleNotification(notification: NotifeeNotificationData): Promise<string> {
    try {
      await this.initialize();

      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: notification.date.getTime(),
        repeatFrequency: RepeatFrequency.NONE,
      };

      const channelId = this.getChannelId(notification.type);

      const notificationId = await notifee.createTriggerNotification(
        {
          id: notification.id,
          title: notification.title,
          body: notification.body,
          data: {
            ...notification.data,
            type: notification.type,
            habitId: notification.habitId,
          },
          android: {
            channelId,
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
            category: AndroidCategory.REMINDER,
            pressAction: {
              id: 'default',
            },
            sound: 'default',
            vibrationPattern: [300, 500],
          },
        },
        trigger
      );

      console.log('✅ Notifee уведомление запланировано:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Ошибка планирования Notifee уведомления:', error);
      throw error;
    }
  }

  async showInstantNotification(title: string, body: string, type: string = 'test'): Promise<string> {
    try {
      await this.initialize();

      const channelId = this.getChannelId(type);
      const notificationId = Date.now().toString();

      await notifee.displayNotification({
        id: notificationId,
        title,
        body,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
          pressAction: {
            id: 'default',
          },
          sound: 'default',
          vibrationPattern: [300, 500],
        },
      });

      console.log('✅ Notifee мгновенное уведомление показано:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('❌ Ошибка показа Notifee уведомления:', error);
      throw error;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await notifee.cancelNotification(notificationId);
      console.log('✅ Notifee уведомление отменено:', notificationId);
    } catch (error) {
      console.error('❌ Ошибка отмены Notifee уведомления:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await notifee.cancelAllNotifications();
      console.log('✅ Все Notifee уведомления отменены');
    } catch (error) {
      console.error('❌ Ошибка отмены всех Notifee уведомлений:', error);
    }
  }

  async getScheduledNotifications(): Promise<any[]> {
    try {
      const notifications = await notifee.getTriggerNotifications();
      return notifications;
    } catch (error) {
      console.error('❌ Ошибка получения Notifee уведомлений:', error);
      return [];
    }
  }

  private getChannelId(type: string): string {
    switch (type) {
      case 'habit_reminder':
        return 'habits';
      case 'test':
        return 'test';
      default:
        return 'general';
    }
  }

  // Обработчики событий
  setupEventHandlers(): void {
    // Обработка нажатия на уведомление
    notifee.onForegroundEvent(({ type, detail }) => {
      console.log('📱 Notifee foreground event:', { type, detail });
      
      if (type === 1) { // PRESS
        console.log('🔔 Уведомление нажато:', detail.notification);
      }
    });

    // Обработка фоновых событий
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log('📱 Notifee background event:', { type, detail });
    });
  }
}

export const notifeeService = new NotifeeService();


