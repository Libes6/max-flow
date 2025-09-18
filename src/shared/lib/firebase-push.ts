import { Platform } from 'react-native';

// FCM Server Key из Firebase Console
const FCM_SERVER_KEY = 'AIzaSyAx9bS5wZ7ryuV73gcWKDbUu8-ZyRlJx6M';

interface PushNotificationData {
  title: string;
  body: string;
  token: string;
  data?: Record<string, string>;
}

// Функция отправки уведомления через Firebase
export const sendFirebasePush = async (notification: PushNotificationData) => {
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
      error: error.message,
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


