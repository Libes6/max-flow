import React from 'react';
import { useSystemThemeListener } from '../../shared/lib';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  useSystemThemeListener();

  return <>{children}</>;
};
