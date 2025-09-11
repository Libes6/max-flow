import { useState, useRef, useCallback, useEffect } from 'react';
import { BottomSheetRef } from '../ui/BottomSheet';

interface UseLocalBottomSheetReturn {
  isVisible: boolean;
  title: string;
  content: React.ReactNode;
  bottomSheetRef: React.RefObject<BottomSheetRef>;
  openBottomSheet: (title: string, content: React.ReactNode) => void;
  updateBottomSheetContent: (content: React.ReactNode) => void;
  closeBottomSheet: () => void;
  handleClose: () => void;
}

export const useLocalBottomSheet = (): UseLocalBottomSheetReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<React.ReactNode>(null);
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const openBottomSheet = useCallback((newTitle: string, newContent: React.ReactNode) => {
    setTitle(newTitle);
    setContent(newContent);
    setIsVisible(true);
  }, []);

  const updateBottomSheetContent = useCallback((newContent: React.ReactNode) => {
    setContent(newContent);
  }, []);

  const closeBottomSheet = useCallback(() => {
    setIsVisible(false);
    bottomSheetRef.current?.close();
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Автоматически открываем BottomSheet после того как состояние обновится
  useEffect(() => {
    if (isVisible && bottomSheetRef.current) {
      // Небольшая задержка чтобы убедиться что компонент смонтирован
      const timer = setTimeout(() => {
        bottomSheetRef.current?.open();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return {
    isVisible,
    title,
    content,
    bottomSheetRef,
    openBottomSheet,
    updateBottomSheetContent,
    closeBottomSheet,
    handleClose,
  };
};
