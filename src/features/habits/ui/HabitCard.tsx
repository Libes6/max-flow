import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography } from '../../../shared/theme';
import { useTranslation } from 'react-i18next';
import type { Priority } from '../../../shared/ui';

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    description?: string;
    category?: string;
    color: string;
    icon?: string;
    priority?: Priority;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const translateX = useRef(new Animated.Value(0)).current;
  const [isSwiped, setIsSwiped] = useState(false);
  const swipeThreshold = 80;

  const priorityConfig = {
    low: {
      label: 'priority.low',
      icon: 'chevron-down' as const,
      color: '#10b981', // green
    },
    medium: {
      label: 'priority.medium',
      icon: 'remove' as const,
      color: '#f59e0b', // amber
    },
    high: {
      label: 'priority.high',
      icon: 'chevron-up' as const,
      color: '#ef4444', // red
    },
  };

  const predefinedCategories = {
    health: { icon: 'heart', color: '#ef4444' },
    fitness: { icon: 'fitness', color: '#f59e0b' },
    learning: { icon: 'book', color: '#3b82f6' },
    work: { icon: 'briefcase', color: '#8b5cf6' },
    personal: { icon: 'person', color: '#10b981' },
    social: { icon: 'people', color: '#ec4899' },
    hobby: { icon: 'musical-notes', color: '#06b6d4' },
    general: { icon: 'list', color: '#6b7280' },
  };

  const customCategoryIcons = [
    'star', 'diamond', 'flash', 'leaf', 'flower', 'sunny', 'moon', 'cloud',
    'snow', 'rainy', 'thunderstorm', 'partly-sunny', 'umbrella', 'beach',
    'bicycle', 'car', 'airplane', 'train', 'boat', 'rocket', 'home',
    'restaurant', 'cafe', 'wine', 'pizza', 'ice-cream', 'gift', 'balloon',
    'trophy', 'medal', 'ribbon', 'flag', 'paw', 'fish', 'bug', 'leaf-outline',
    'flower-outline', 'heart-outline', 'happy', 'sad', 'thumbs-up', 'thumbs-down'
  ];

  const getCategoryIcon = (category: string) => {
    const predefined = predefinedCategories[category as keyof typeof predefinedCategories];
    if (predefined) return predefined.icon;
    
    // Для пользовательских категорий используем детерминированную случайную иконку
    const hash = category.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % customCategoryIcons.length;
    return customCategoryIcons[index];
  };

  const getCategoryColor = (category: string) => {
    const predefined = predefinedCategories[category as keyof typeof predefinedCategories];
    if (predefined) return predefined.color;
    
    // Для пользовательских категорий используем детерминированный случайный цвет
    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ec4899', '#06b6d4', '#6b7280'];
    const hash = category.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

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
      <Animated.View style={[styles.deleteBackground, { backgroundColor: colors.error }, animatedBackgroundStyle]}>
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
        <Animated.View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, animatedCardStyle]}>
          <TouchableOpacity 
            style={[styles.habitCard, { borderColor: colors.border }]}
            onPress={onEdit}
          >
            <View style={styles.habitHeader}>
              <View style={[styles.habitIcon, { backgroundColor: habit.color }]}>
                {habit.icon ? (
                  <Ionicons 
                    name={habit.icon as any} 
                    size={24} 
                    color="white" 
                  />
                ) : (
                  <Text style={[styles.habitIconText, { color: colors.text }]}>
                    {habit.name.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={styles.habitInfo}>
                <View style={styles.habitTitleRow}>
                  <Text style={[styles.habitName, { color: colors.text }]}>{habit.name}</Text>
                  {habit.priority && (
                    <View style={[styles.priorityBadge, { backgroundColor: priorityConfig[habit.priority].color }]}>
                      <Ionicons
                        name={priorityConfig[habit.priority].icon}
                        size={12}
                        color="white"
                      />
                      <Text style={styles.priorityText}>
                        {t(priorityConfig[habit.priority].label)}
                      </Text>
                    </View>
                  )}
                </View>
                {!!habit.description && (
                  <Text style={[styles.habitDescription, { color: colors.textSecondary }]}>{habit.description}</Text>
                )}
                {!!habit.category && (
                  <View style={styles.categoryRow}>
                    <Ionicons
                      name={getCategoryIcon(habit.category) as any}
                      size={14}
                      color={getCategoryColor(habit.category)}
                    />
                    <Text style={[styles.habitCategory, { color: colors.textTertiary }]}>
                      {t(`categories.${habit.category}`)}
                    </Text>
                  </View>
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
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 2,
  },
  habitCard: {
    borderRadius: 12,
    padding: spacing.lg,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  habitInfo: {
    flex: 1,
  },
  habitTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  habitName: {
    ...typography.h3,
    flex: 1,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  habitDescription: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  habitCategory: {
    ...typography.caption,
  },
  habitArrow: {
    marginLeft: spacing.sm,
  },
});
