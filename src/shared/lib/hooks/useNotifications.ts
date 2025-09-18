import { useEffect, useState, useCallback } from 'react';
import { notificationService, NotificationData, NotificationSettings } from '../notifications';

export const useNotifications = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissions, setPermissions] = useState<boolean | null>(null);
  const [scheduledNotifications, setScheduledNotifications] = useState<NotificationData[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(notificationService.getNotificationSettings());

  useEffect(() => {
    initializeNotifications();
    loadScheduledNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      await notificationService.initialize();
      const hasPermissions = await notificationService.requestPermissions();
      setPermissions(hasPermissions);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  };

  const loadScheduledNotifications = useCallback(() => {
    const notifications = notificationService.getScheduledNotifications();
    setScheduledNotifications(notifications);
  }, []);

  const scheduleHabitReminder = useCallback(async (
    habitId: string,
    habitName: string,
    time: Date
  ): Promise<string> => {
    if (!permissions) {
      throw new Error('Уведомления не разрешены');
    }
    
    const notificationId = await notificationService.scheduleHabitReminder(habitId, habitName, time);
    loadScheduledNotifications();
    return notificationId;
  }, [permissions, loadScheduledNotifications]);

  const scheduleMotivationalMessage = useCallback(async (time: Date): Promise<string> => {
    if (!permissions) {
      throw new Error('Уведомления не разрешены');
    }
    
    const notificationId = await notificationService.scheduleMotivationalMessage(time);
    loadScheduledNotifications();
    return notificationId;
  }, [permissions, loadScheduledNotifications]);

  const cancelNotification = useCallback(async (notificationId: string): Promise<void> => {
    await notificationService.cancelNotification(notificationId);
    loadScheduledNotifications();
  }, [loadScheduledNotifications]);

  const cancelHabitReminders = useCallback(async (habitId: string): Promise<void> => {
    await notificationService.cancelHabitReminders(habitId);
    loadScheduledNotifications();
  }, [loadScheduledNotifications]);

  const cancelAllNotifications = useCallback(async (): Promise<void> => {
    await notificationService.cancelAllNotifications();
    loadScheduledNotifications();
  }, [loadScheduledNotifications]);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    notificationService.updateNotificationSettings(newSettings);
    setSettings(notificationService.getNotificationSettings());
  }, []);

  const getToken = useCallback(async () => {
    return notificationService.getToken();
  }, []);

  const sendNotificationToServer = useCallback(async (notification: {
    title: string;
    message: string;
    userId: string;
    type: string;
    habitId?: string;
  }) => {
    return notificationService.sendNotificationToServer(notification);
  }, []);

  const scheduleHabitRemindersForAllHabits = useCallback(async (): Promise<void> => {
    if (!permissions) {
      throw new Error('Уведомления не разрешены');
    }
    
    await notificationService.scheduleHabitRemindersForAllHabits();
    loadScheduledNotifications();
  }, [permissions, loadScheduledNotifications]);

  return {
    isInitialized,
    permissions,
    scheduledNotifications,
    settings,
    scheduleHabitReminder,
    scheduleMotivationalMessage,
    scheduleHabitRemindersForAllHabits,
    cancelNotification,
    cancelHabitReminders,
    cancelAllNotifications,
    updateSettings,
    getToken,
    sendNotificationToServer,
    refreshNotifications: loadScheduledNotifications,
  };
};


