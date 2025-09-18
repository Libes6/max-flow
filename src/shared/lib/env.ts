// Конфигурация переменных окружения
// Создайте файл .env в корне проекта с вашими значениями

export const ENV = {
  // Sentry
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://b0c84b77bfc2e1218c17ef1b314d1863@o4507758662189056.ingest.de.sentry.io/4510001418469456',
  
  // Firebase (для справки, основная конфигурация в google-services.json)
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || 'AIzaSyAx9bS5wZ7ryuV73gcWKDbUu8-ZyRlJx6M',
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || 'flow-max-6c2ac.firebaseapp.com',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'flow-max-6c2ac',
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || 'flow-max-6c2ac.firebasestorage.app',
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '693657338765',
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '1:693657338765:android:ede6d1967430862101b3c4',
  
  // Firebase Server Key для отправки пушей
  FCM_SERVER_KEY: process.env.FCM_SERVER_KEY || '',
} as const;

// Проверяем, что все необходимые переменные заданы
export const validateEnv = () => {
  const required = ['SENTRY_DSN'];
  const missing = required.filter(key => !ENV[key as keyof typeof ENV]);
  
  if (missing.length > 0) {
    console.warn('⚠️ Отсутствуют переменные окружения:', missing.join(', '));
    console.warn('📝 Создайте файл .env в корне проекта с необходимыми значениями');
  }
  
  return missing.length === 0;
};
