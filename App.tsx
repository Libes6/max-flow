import React from 'react';
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
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://b0c84b77bfc2e1218c17ef1b314d1863@o4507758662189056.ingest.de.sentry.io/4510001418469456',


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
