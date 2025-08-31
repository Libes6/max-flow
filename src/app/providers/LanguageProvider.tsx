import React from 'react';
import { useLanguageInit } from '../../shared/lib/hooks/useLanguageInit';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  useLanguageInit();

  return <>{children}</>;
};
