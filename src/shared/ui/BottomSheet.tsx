import React, { forwardRef, useImperativeHandle, useRef, useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTheme } from '../theme';
import { spacing, typography, dimensions } from '../theme';

const { height: screenHeight } = Dimensions.get('window');

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

interface BottomSheetProps {
  title: string;
  children: React.ReactNode;
  height?: number | string;
  onClose?: () => void;
}

export const BottomSheetComponent = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ title, children, height = 'auto', onClose }, ref) => {
    const { colors } = useTheme();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const [isContentMeasured, setIsContentMeasured] = useState(false);
    
    // Адаптивные снаппойнты на основе размера контента
    const snapPoints = useMemo(() => {
      if (height !== 'auto') {
        return [height as number];
      }
      
      // Всегда предоставляем 3 точки для гибкости:
      // 25% - для малого количества контента
      // 50% - для среднего количества контента  
      // 90% - для большого количества контента
      return ['25%', '50%', '90%'];
    }, [height]);

    // Определяем начальный индекс открытия на основе размера контента
    const initialIndex = useMemo(() => {
      if (height !== 'auto') {
        return 0;
      }
      
      if (!isContentMeasured) {
        return 1; // Открываем на 50% пока не измерен
      }
      
      // Вычисляем оптимальную высоту:
      // headerHeight = примерная высота заголовка + отступы
      // bottomPadding = отступ снизу для системных элементов Android (жесты навигации)
      // totalHeight = контент + заголовок + отступ снизу
      const headerHeight = 50; // Примерная высота заголовка
      const bottomPadding = Platform.OS === 'ios' ? spacing.md : spacing.md + dimensions.androidBottomPadding;
      const totalHeight = contentHeight + headerHeight + bottomPadding;
      
      console.log('BottomSheet: calculating initial index:');
      console.log('  - contentHeight:', contentHeight);
      console.log('  - headerHeight:', headerHeight);
      console.log('  - bottomPadding:', bottomPadding);
      console.log('  - totalHeight:', totalHeight);
      console.log('  - screenHeight:', screenHeight);
      console.log('  - 25% of screen:', screenHeight * 0.25);
      console.log('  - 50% of screen:', screenHeight * 0.5);
      
      // Более точные пороги для определения размера
      if (totalHeight <= screenHeight * 0.25) {
        console.log('  - result: 0 (25%) - очень мало контента');
        return 0; // 25% - очень мало контента (1-2 элемента)
      } else if (totalHeight <= screenHeight * 0.5) {
        console.log('  - result: 1 (50%) - мало-средний контент');
        return 1; // 50% - мало-средний контент (3-4 элемента)
      } else {
        console.log('  - result: 2 (90%) - средний-много контента');
        return 2; // 90% - средний-много контента (5+ элементов)
      }
    }, [height, contentHeight, isContentMeasured]);

    useImperativeHandle(ref, () => ({
      open: () => {
        console.log('BottomSheet: open called');
        // Открываем на оптимальной высоте
        if (initialIndex === 0) {
          bottomSheetRef.current?.snapToIndex(0);
        } else if (initialIndex === 1) {
          bottomSheetRef.current?.snapToIndex(1);
        } else {
          bottomSheetRef.current?.snapToIndex(2);
        }
      },
      close: () => {
        console.log('BottomSheet: close called');
        bottomSheetRef.current?.close();
      },
    }), [initialIndex]);

    const handleSheetChanges = useCallback((index: number) => {
      console.log('BottomSheet: sheet changed to index:', index);
      if (index === -1) {
        console.log('BottomSheet: calling onClose');
        onClose?.();
      }
    }, [onClose]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          onPress={() => {
            console.log('BottomSheet: backdrop pressed, closing');
            bottomSheetRef.current?.close();
          }}
        />
      ),
      []
    );

    const handleContentLayout = useCallback((event: any) => {
      const { height: newHeight } = event.nativeEvent.layout;
      // Учитываем системные отступы Android для жестов навигации
      const bottomPadding = Platform.OS === 'ios' ? spacing.md : spacing.md;
      console.log('BottomSheet: content height measured:', newHeight);
      console.log('BottomSheet: screen height:', screenHeight);
      console.log('BottomSheet: header height:', 50);
      console.log('BottomSheet: bottom padding:', bottomPadding);
      console.log('BottomSheet: total height:', newHeight + 50 + bottomPadding);
      setContentHeight(newHeight);
      setIsContentMeasured(true);
    }, []);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
        style={styles.bottomSheet}
      >
        <BottomSheetView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {title}
            </Text>
          </View>
          
          {/* Content */}
          <View style={styles.content} onLayout={handleContentLayout}>
            {children}
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheet: {
    // Убеждаемся, что BottomSheet рендерится поверх всего
    elevation: 1000,
    zIndex: 1000,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    ...typography.h2,
    fontWeight: '600',
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    // Учитываем системные отступы Android для жестов навигации
    paddingBottom: Platform.OS === 'ios' ? spacing.md : spacing.md + dimensions.androidBottomSheetPadding,
  },
});
