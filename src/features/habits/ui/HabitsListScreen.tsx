import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography, dimensions } from '../../../shared/theme';
import { Button } from '../../../shared/ui';
import { HabitCard } from './HabitCard';
import { useHabitsSync } from '../hooks/useHabitsSync';
import { HabitsStackParamList } from '../../../app/navigation/types';
import { Habit } from '../../../shared/types';

type HabitListItem = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  color: string;
  icon?: string;
};

export const HabitsListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { 
    habits, 
    removeHabit
  } = useHabitsSync();

  // Сортируем привычки по приоритету: высокий -> средний -> низкий
  const sortedHabits = [...habits].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority || 'medium'];
    const bPriority = priorityOrder[b.priority || 'medium'];
    return bPriority - aPriority; // Сначала высокий приоритет
  });

  // Определяем тип навигации на Android
  const isGestureNavigation = Platform.OS === 'android' && insets.bottom === 0;
  const isButtonNavigation = Platform.OS === 'android' && insets.bottom > 0;

  // Вычисляем правильные отступы
  const fabBottomOffset = Platform.OS === 'ios' 
    ? 120 + insets.bottom
    : isGestureNavigation 
      ? 120 
      : 120 + insets.bottom;

  const listBottomPadding = Platform.OS === 'ios' 
    ? 140 + insets.bottom
    : isGestureNavigation 
      ? 140 
      : 140 + insets.bottom;

  const handleEditHabit = (habit: Habit) => {
    navigation.navigate('EditHabit', { habitId: habit.id });
  };

  const handleDeleteHabit = (habitId: string) => {
    // Удаляем привычку без подтверждения
    removeHabit(habitId);
  };

  const handleAddHabit = () => {
    navigation.navigate('CreateHabit');
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('habits.title')}</Text>
      </View>

      <FlatList
        data={sortedHabits as unknown as HabitListItem[]}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onEdit={() => handleEditHabit(item as Habit)}
            onDelete={() => handleDeleteHabit(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: listBottomPadding }
        ]}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
      />

      {/* Плавающая кнопка добавления */}
      <TouchableOpacity
        style={[
          styles.fab, 
          { 
            backgroundColor: colors.primary,
            shadowColor: colors.text,
            bottom: fabBottomOffset,
          }
        ]}
        onPress={handleAddHabit}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={isDark ? '#ffffff' : '#1e1b4b'} />
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.65,
  },
  listContainer: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  flatList: {
    flexGrow: 1,
  },
});
