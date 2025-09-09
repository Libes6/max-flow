

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppSafeAreaProvider, QueryProvider, LanguageProvider, NavigationProvider, ProfileProvider } from './src/app/providers';
import { RootNavigator } from './src/app/navigation';
import { GlobalBottomSheetProvider } from './src/shared/ui/GlobalBottomSheet';
import './src/shared/lib/i18n';



const queryClient = new QueryClient();

function App() {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <AppSafeAreaProvider>
                    <QueryProvider>
                        <LanguageProvider>
                            <NavigationProvider>
                                <ProfileProvider>
                                    <GlobalBottomSheetProvider>
                                        <RootNavigator />
                                        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                                    </GlobalBottomSheetProvider>
                                </ProfileProvider>
                            </NavigationProvider>
                        </LanguageProvider>
                    </QueryProvider>
                </AppSafeAreaProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}

export default App;
