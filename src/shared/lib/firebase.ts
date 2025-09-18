import { initializeApp, getApps } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

// Firebase конфигурация загружается из google-services.json
// Для справки, значения также доступны в src/shared/lib/env.ts

// Инициализация Firebase (конфигурация загружается из google-services.json)
if (getApps().length === 0) {
  console.log('🔥 Firebase: Инициализируем Firebase...');
  initializeApp();
  console.log('🔥 Firebase: Firebase инициализирован');
} else {
  console.log('🔥 Firebase: Firebase уже инициализирован');
}

// Firebase Messaging
export const firebaseMessaging = messaging();
console.log('🔥 Firebase: Messaging инициализирован');

// Получение FCM токена
export const getFCMToken = async (): Promise<string | null> => {
  try {
    console.log('🔥 Firebase: Начинаем получение FCM токена...');
    
    if (Platform.OS === 'android') {
      console.log('🔥 Firebase: Запрашиваем разрешения...');
      const authStatus = await messaging().requestPermission();
      console.log('🔥 Firebase: Статус разрешений:', authStatus);
      
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
      console.log('🔥 Firebase: Разрешения включены:', enabled);
      
      if (enabled) {
        console.log('🔥 Firebase: Получаем токен...');
        const token = await messaging().getToken();
        console.log('🔥 FCM Token получен:', token);
        console.log('📱 Полный FCM токен:', token);
        return token;
      } else {
        console.log('🔥 Firebase: Разрешения не предоставлены');
      }
    } else {
      console.log('🔥 Firebase: Платформа не Android, токен не получен');
    }
    return null;
  } catch (error) {
    console.error('❌ Firebase: Ошибка получения FCM токена:', error);
    return null;
  }
};

// Обработка уведомлений в фоне
export const setupBackgroundMessageHandler = () => {
  console.log('🔥 Firebase: Настраиваем обработчик фоновых сообщений');
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('📱 Background message received:', remoteMessage);
    
    // Показываем уведомление через Notifee в фоне
    if (remoteMessage.notification) {
      const { title, body } = remoteMessage.notification;
      
      try {
        // Импортируем Notifee динамически
        const notifee = require('@notifee/react-native').default;
        
        // Создаем канал для уведомлений
        const channelId = await notifee.createChannel({
          id: 'firebase-background',
          name: 'Firebase Background',
          importance: 4, // High importance
        });
        
        // Показываем уведомление
        await notifee.displayNotification({
          title: title || 'Уведомление',
          body: body || 'Новое сообщение',
          data: remoteMessage.data,
          android: {
            channelId,
            smallIcon: 'ic_launcher',
            pressAction: {
              id: 'default',
            },
          },
        });
        
        console.log('✅ Notifee уведомление показано в фоне');
      } catch (error) {
        console.error('❌ Ошибка показа Notifee уведомления в фоне:', error);
      }
    }
  });
};

// Обработка уведомлений на переднем плане
export const setupForegroundMessageHandler = () => {
  console.log('🔥 Firebase: Настраиваем обработчик сообщений на переднем плане');
  messaging().onMessage(async (remoteMessage) => {
    console.log('📱 Foreground message received:', remoteMessage);
    
    // Показываем уведомление через Notifee когда приложение открыто
    if (remoteMessage.notification) {
      const { title, body } = remoteMessage.notification;
      
      try {
        // Импортируем Notifee динамически
        const notifee = require('@notifee/react-native').default;
        
        // Создаем канал для уведомлений
        const channelId = await notifee.createChannel({
          id: 'firebase-foreground',
          name: 'Firebase Foreground',
          importance: 4, // High importance
        });
        
        // Показываем уведомление
        await notifee.displayNotification({
          title: title || 'Уведомление',
          body: body || 'Новое сообщение',
          data: remoteMessage.data,
          android: {
            channelId,
            smallIcon: 'ic_launcher',
            pressAction: {
              id: 'default',
            },
          },
        });
        
        console.log('✅ Notifee уведомление показано на переднем плане');
      } catch (error) {
        console.error('❌ Ошибка показа Notifee уведомления:', error);
        
        // Fallback на PushNotification если Notifee не работает
        const PushNotification = require('react-native-push-notification').default;
        PushNotification.localNotification({
          title: title || 'Уведомление',
          message: body || 'Новое сообщение',
          playSound: true,
          soundName: 'default',
          priority: 'high',
          importance: 'high',
          data: remoteMessage.data,
        });
      }
    }
  });
};

export default firebaseMessaging;
