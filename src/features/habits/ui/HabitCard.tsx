import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../../../shared/theme';

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    description?: string;
    category?: string;
    color: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isSwiped, setIsSwiped] = useState(false);
  const swipeThreshold = 80;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      
      if (translationX < -swipeThreshold) {
        // Свайп достаточно далеко - показываем кнопку удаления
        Animated.spring(translateX, {
          toValue: -swipeThreshold,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
        setIsSwiped(true);
      } else {
        // Возвращаем в исходное положение
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
        setIsSwiped(false);
      }
    }
  };

  const handleDelete = useCallback(() => {
    onDelete();
    // Возвращаем карточку в исходное положение после удаления
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    setIsSwiped(false);
  }, [onDelete, translateX]);

  const animatedCardStyle = {
    transform: [{ translateX }],
  };

  const animatedBackgroundStyle = {
    opacity: translateX.interpolate({
      inputRange: [-swipeThreshold, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
  };

  return (
    <View style={styles.container}>
      {/* Фон с кнопкой удаления */}
      <Animated.View style={[styles.deleteBackground, animatedBackgroundStyle]}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
          <Text style={styles.deleteButtonText}>Удалить</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Основная карточка */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
      >
        <Animated.View style={[styles.card, animatedCardStyle]}>
          <TouchableOpacity 
            style={styles.habitCard}
            onPress={onEdit}
          >
            <View style={styles.habitHeader}>
              <View style={[styles.habitIcon, { backgroundColor: habit.color }]}>
                <Text style={styles.habitIconText}>
                  {habit.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.name}</Text>
                {!!habit.description && (
                  <Text style={styles.habitDescription}>{habit.description}</Text>
                )}
                {!!habit.category && (
                  <Text style={styles.habitCategory}>{habit.category}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.habitArrow}>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: colors.error,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 2,
  },
  habitCard: {
    borderRadius: 12,
    padding: spacing.lg,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  habitIconText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  habitDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  habitCategory: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  habitArrow: {
    marginLeft: spacing.sm,
  },
});
