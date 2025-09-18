import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  AppSafeAreaProvider,
  QueryProvider,
  LanguageProvider,
  NavigationProvider,
  ProfileProvider,
  ThemeProvider,
} from './src/app/providers';
import { RootNavigator } from './src/app/navigation';
import './src/shared/lib/i18n';
import './src/shared/lib/firebase'; // Инициализация Firebase
import { notificationService } from './src/shared/lib/notifications';
import { ENV, validateEnv } from './src/shared/lib/env';
import * as Sentry from '@sentry/react-native';

// Проверяем переменные окружения
validateEnv();

Sentry.init({
  dsn: ENV.SENTRY_DSN,


  sendDefaultPii: true,

  replaysSessionSampleRate: 0.1, // Записываем все сессии
  replaysOnErrorSampleRate: 1.0, // Записываем все сессии с ошибками
  
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllText: false,
      maskAllImages: false,
      maskAllVectors: false,
    }),

  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
});

const queryClient = new QueryClient();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Инициализируем уведомления и запрашиваем разрешения при запуске
    const initNotifications = async () => {
      try {
        console.log('🔔 App: Инициализируем уведомления...');
        await notificationService.initialize();
        console.log('🔔 App: Уведомления инициализированы');
      } catch (error) {
        console.error('❌ App: Ошибка инициализации уведомлений:', error);
      }
    };

    initNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppSafeAreaProvider>
          <QueryProvider>
            <LanguageProvider>
              <ThemeProvider>
                <NavigationProvider>
                  <ProfileProvider>
                    <RootNavigator />
                    <StatusBar
                      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    />
                  </ProfileProvider>
                </NavigationProvider>
              </ThemeProvider>
            </LanguageProvider>
          </QueryProvider>
        </AppSafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
