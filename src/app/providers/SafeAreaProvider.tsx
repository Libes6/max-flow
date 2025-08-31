import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface SafeAreaProviderProps {
  children: React.ReactNode;
}

export const AppSafeAreaProvider: React.FC<SafeAreaProviderProps> = ({ children }) => {
  return (
    <SafeAreaProvider>
      {children}
    </SafeAreaProvider>
  );
};
