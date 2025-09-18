# Настройка системы уведомлений

## Обзор

Система уведомлений использует:
- **React Native Push Notification** - для локальных уведомлений
- **MMKV** - для кеширования данных уведомлений
- **Supabase Edge Functions** - для отправки push уведомлений через сервер
- **FCM (Firebase Cloud Messaging)** - для Android уведомлений

## Преимущества этого решения

1. **Универсальность**: Работает на всех устройствах, включая Huawei без Google Play Services
2. **Локальные уведомления**: Не требуют интернета для работы
3. **MMKV кеширование**: Быстрое и надежное хранение данных
4. **Гибкость**: Легко настраивать разные типы уведомлений
5. **TypeScript**: Полная типизация для безопасности

## Настройка

### 1. Установка зависимостей

```bash
npm install react-native-push-notification @types/react-native-push-notification
```

### 2. Настройка Android

Добавьте в `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Разрешения для уведомлений -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />

<!-- В application -->
<receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationActions" />
<receiver android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationPublisher" />
<service android:name="com.dieam.reactnativepushnotification.modules.RNPushNotificationListenerService" />
```

### 3. Настройка Supabase

1. Создайте Edge Function:
```bash
supabase functions deploy send-notification
```

2. Добавьте переменные окружения:
```bash
# В Supabase Dashboard -> Settings -> Edge Functions
FCM_SERVER_KEY=your_fcm_server_key
```

3. Выполните миграцию базы данных:
```bash
supabase db push
```

### 4. Настройка FCM (опционально)

1. Создайте проект в Firebase Console
2. Добавьте Android приложение
3. Скачайте `google-services.json` в `android/app/`
4. Получите Server Key из Firebase Console
5. Добавьте Server Key в переменные Supabase

## Использование

### Базовое использование

```typescript
import { useNotifications } from '@shared/lib/hooks/useNotifications';

const MyComponent = () => {
  const { 
    scheduleHabitReminder, 
    scheduleDailySummary,
    permissions 
  } = useNotifications();

  const handleScheduleReminder = async () => {
    if (permissions) {
      await scheduleHabitReminder('habit-id', 'Название привычки', new Date());
    }
  };

  return (
    // Ваш компонент
  );
};
```

### Настройка уведомлений для привычек

```typescript
import { useHabitNotifications } from '@features/habits/hooks/useHabitNotifications';

const HabitComponent = () => {
  const { scheduleHabitReminders, hasHabitReminders } = useHabitNotifications();

  const scheduleReminder = async (habitId: string, time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const reminderDate = new Date();
    reminderDate.setHours(hours, minutes, 0, 0);
    
    await scheduleHabitReminders(habitId, reminderDate);
  };

  return (
    // Ваш компонент
  );
};
```

## Типы уведомлений

1. **habit_reminder** - Напоминания о привычках
2. **daily_summary** - Ежедневные отчеты
3. **motivation** - Мотивационные сообщения
4. **sync_reminder** - Напоминания о синхронизации

## Настройки уведомлений

Пользователь может настроить:
- Включение/отключение типов уведомлений
- Время ежедневных отчетов
- Время мотивационных сообщений
- Тестирование уведомлений

## Кеширование с MMKV

Все данные уведомлений кешируются в MMKV:
- Планируемые уведомления
- Настройки уведомлений
- Push токены
- История нажатий на уведомления

## Отладка

1. Проверьте логи в консоли
2. Убедитесь, что разрешения предоставлены
3. Проверьте настройки уведомлений в MMKV
4. Тестируйте на реальном устройстве

## Безопасность

- Push токены хранятся в зашифрованном виде в MMKV
- Все API вызовы защищены RLS политиками
- Пользователи могут управлять только своими уведомлениями

## Производительность

- Уведомления планируются локально для быстрого отклика
- MMKV обеспечивает быстрое чтение/запись
- Автоматическая очистка устаревших кешей
- Оптимизированные запросы к базе данных


