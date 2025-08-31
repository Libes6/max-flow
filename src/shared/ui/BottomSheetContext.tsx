import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { BottomSheetRef } from './BottomSheet';

interface BottomSheetContextType {
  openBottomSheet: (title: string, content: ReactNode) => void;
  closeBottomSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within BottomSheetProvider');
  }
  return context;
};

interface BottomSheetProviderProps {
  children: ReactNode;
}

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({ children }) => {
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const openBottomSheet = (title: string, content: ReactNode) => {
    // Здесь будет логика открытия BottomSheet
    bottomSheetRef.current?.open();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}
      {/* BottomSheet будет рендериться здесь, в корне приложения */}
    </BottomSheetContext.Provider>
  );
};
