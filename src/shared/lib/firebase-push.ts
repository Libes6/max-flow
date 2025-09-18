import { Platform } from 'react-native';
import { ENV } from './env';

// FCM Server Key из Firebase Console (из переменных окружения)
const FCM_SERVER_KEY = ENV.FCM_SERVER_KEY;

interface PushNotificationData {
  title: string;
  body: string;
  token: string;
  data?: Record<string, string>;
}

// Функция отправки уведомления через Firebase
export const sendFirebasePush = async (notification: PushNotificationData) => {
  if (!FCM_SERVER_KEY) {
    console.error('❌ FCM_SERVER_KEY не задан в переменных окружения');
    return {
      success: false,
      error: 'FCM_SERVER_KEY не задан в переменных окружения',
    };
  }

  try {
    const message = {
      to: notification.token,
      notification: {
        title: notification.title,
        body: notification.body,
        sound: 'default',
        priority: 'high',
      },
      data: {
        ...notification.data,
        timestamp: new Date().toISOString(),
      },
    };

    console.log('🚀 Отправляем уведомление через Firebase:', message);

    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${FCM_SERVER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Уведомление отправлено:', result);
    
    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error('❌ Ошибка отправки уведомления:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// Функция тестирования уведомления
export const testFirebasePush = async (token: string) => {
  return await sendFirebasePush({
    title: 'Тест уведомления! 🔥',
    body: 'Это тестовое уведомление через Firebase',
    token,
    data: {
      type: 'test',
      source: 'Flow Max App',
    },
  });
};


