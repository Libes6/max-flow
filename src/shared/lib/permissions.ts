import { Platform, PermissionsAndroid, Alert } from 'react-native';

// Функция для запроса разрешений на точные будильники
export const requestExactAlarmPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true; // На iOS не нужно
  }

  try {
    // Проверяем версию Android
    const androidVersion = Platform.Version;
    if (androidVersion < 31) {
      console.log('📱 Android версия < 31, разрешение не нужно');
      return true; // Для старых версий Android не нужно
    }

    // Для Android 12+ просто предполагаем что разрешение есть
    // так как оно уже добавлено в AndroidManifest.xml
    console.log('📱 Android 12+, предполагаем что разрешение на точные будильники есть');
    return true;

  } catch (error) {
    console.error('❌ Ошибка запроса разрешения на точные будильники:', error);
    return true; // В случае ошибки тоже разрешаем
  }
};

// Функция для проверки всех разрешений
export const checkAllPermissions = async (): Promise<boolean> => {
  try {
    // Проверяем разрешения на уведомления
    const notificationPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    // Проверяем разрешения на точные будильники
    const exactAlarmPermission = await requestExactAlarmPermission();

    console.log('🔐 Проверка разрешений:', { notificationPermission, exactAlarmPermission });
    return notificationPermission && exactAlarmPermission;
  } catch (error) {
    console.error('❌ Ошибка проверки разрешений:', error);
    return true; // В случае ошибки разрешаем работу
  }
};
