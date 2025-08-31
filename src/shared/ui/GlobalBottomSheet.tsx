import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BottomSheetComponent, BottomSheetRef } from './BottomSheet';

interface GlobalBottomSheetContextType {
  openBottomSheet: (title: string, content: ReactNode) => void;
  closeBottomSheet: () => void;
}

const GlobalBottomSheetContext = createContext<GlobalBottomSheetContextType | undefined>(undefined);

export const useGlobalBottomSheet = () => {
  const context = useContext(GlobalBottomSheetContext);
  if (!context) {
    throw new Error('useGlobalBottomSheet must be used within GlobalBottomSheetProvider');
  }
  return context;
};

interface GlobalBottomSheetProviderProps {
  children: ReactNode;
}

export const GlobalBottomSheetProvider: React.FC<GlobalBottomSheetProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<ReactNode>(null);
  const bottomSheetRef = React.useRef<BottomSheetRef>(null);

  // Открываем BottomSheet после того как состояние обновится
  useEffect(() => {
    if (isVisible && bottomSheetRef.current) {
      // Небольшая задержка чтобы убедиться что компонент смонтирован
      const timer = setTimeout(() => {
        bottomSheetRef.current?.open();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const openBottomSheet = (newTitle: string, newContent: ReactNode) => {
    setTitle(newTitle);
    setContent(newContent);
    setIsVisible(true);
  };

  const closeBottomSheet = () => {
    setIsVisible(false);
    bottomSheetRef.current?.close();
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <GlobalBottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}
      
      {/* Глобальный BottomSheet рендерится здесь */}
      {isVisible && (
        <BottomSheetComponent
          ref={bottomSheetRef}
          title={title}
          height="auto"
          onClose={handleClose}
        >
          {content}
        </BottomSheetComponent>
      )}
    </GlobalBottomSheetContext.Provider>
  );
};
