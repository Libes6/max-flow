import { useCallback } from 'react';
import { useNotifications } from '../../../shared/lib/hooks/useNotifications';
import { useHabitsStore } from '../model/useHabitsStore';

export const useHabitNotifications = () => {
  const { 
    scheduleHabitReminder, 
    cancelHabitReminders, 
    scheduledNotifications,
    permissions 
  } = useNotifications();
  const { habits } = useHabitsStore();

  const scheduleHabitReminders = useCallback(async (
    habitId: string, 
    reminderTime: Date
  ): Promise<string> => {
    // Получаем актуальные привычки из store
    const { habits: currentHabits } = useHabitsStore.getState();
    const habit = currentHabits.find(h => h.id === habitId);
    
    if (!habit) {
      console.error('🔔 useHabitNotifications: Habit not found:', habitId);
      throw new Error('Привычка не найдена');
    }

    if (!permissions) {
      console.error('🔔 useHabitNotifications: No permissions');
      throw new Error('Уведомления не разрешены');
    }

    console.log('🔔 useHabitNotifications: Scheduling reminder for habit:', habit.name, 'at:', reminderTime);

    // Отменяем предыдущие напоминания для этой привычки
    await cancelHabitReminders(habitId);

    // Создаем новое напоминание
    const notificationId = await scheduleHabitReminder(habitId, habit.name, reminderTime);
    console.log('🔔 useHabitNotifications: Notification scheduled:', notificationId);
    return notificationId;
  }, [scheduleHabitReminder, cancelHabitReminders, permissions]);

  const getHabitReminders = useCallback((habitId: string) => {
    return scheduledNotifications.filter(
      n => n.habitId === habitId && n.type === 'habit_reminder'
    );
  }, [scheduledNotifications]);

  const hasHabitReminders = useCallback((habitId: string) => {
    return getHabitReminders(habitId).length > 0;
  }, [getHabitReminders]);

  const scheduleDailyHabitReminders = useCallback(async (habitId: string, time: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) {
      throw new Error('Привычка не найдена');
    }

    // Планируем напоминание на завтра в указанное время
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const [hours, minutes] = time.split(':').map(Number);
    tomorrow.setHours(hours, minutes, 0, 0);

    return scheduleHabitReminders(habitId, tomorrow);
  }, [habits, scheduleHabitReminders]);

  const scheduleWeeklyHabitReminders = useCallback(async (
    habitId: string, 
    time: string, 
    daysOfWeek: number[]
  ) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) {
      throw new Error('Привычка не найдена');
    }

    const [hours, minutes] = time.split(':').map(Number);
    const today = new Date();
    const notifications: Promise<string>[] = [];

    // Планируем напоминания на следующие 4 недели
    for (let week = 0; week < 4; week++) {
      for (const dayOfWeek of daysOfWeek) {
        const notificationDate = new Date(today);
        notificationDate.setDate(today.getDate() + (dayOfWeek - today.getDay() + 7 * week));
        notificationDate.setHours(hours, minutes, 0, 0);

        // Пропускаем прошедшие даты
        if (notificationDate > today) {
          notifications.push(scheduleHabitReminders(habitId, notificationDate));
        }
      }
    }

    return Promise.all(notifications);
  }, [habits, scheduleHabitReminders]);

  return {
    scheduleHabitReminders,
    scheduleDailyHabitReminders,
    scheduleWeeklyHabitReminders,
    cancelHabitReminders,
    getHabitReminders,
    hasHabitReminders,
    permissions,
  };
};
