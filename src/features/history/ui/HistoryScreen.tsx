import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme, spacing, typography, dimensions } from '../../../shared/theme';
import { NewCalendar } from '../../../shared/ui/NewCalendar';
import { DayHabitsBottomSheet } from '../../../shared/ui/DayHabitsBottomSheet';
import { useGlobalBottomSheet } from '../../../shared/ui/GlobalBottomSheet';
import { useHabitsStore } from '../../habits/model/useHabitsStore';
import { useStatisticsStore } from '../../statistics/model/useStatisticsStore';
import { Habit } from '../../../shared/types';



export const HistoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const habits = useHabitsStore((s) => s.habits);
  const { habitCompletions, markHabitCompleted, markHabitIncomplete } = useStatisticsStore();
  const { openBottomSheet, updateBottomSheetContent, closeBottomSheet } = useGlobalBottomSheet();

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
    closeBottomSheet();
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  // Обновляем контент bottom sheet при изменении habitCompletions
  useEffect(() => {
    if (isBottomSheetOpen) {
      const content = (
        <DayHabitsBottomSheet
          date={selectedDate}
          habits={habits}
          habitCompletions={habitCompletions}
          onToggleHabit={toggleHabit}
        />
      );
      updateBottomSheetContent(content);
    }
  }, [habitCompletions, habits, selectedDate, isBottomSheetOpen, updateBottomSheetContent]);

  // Обрабатываем закрытие bottom sheet
  useEffect(() => {
    if (!isBottomSheetOpen) {
      handleCloseBottomSheet();
    }
  }, [isBottomSheetOpen]);

  const getHabitCompletionStatus = (habitId: string) => {
    const habitData = habitCompletions[habitId] || [];
    const dayEntry = habitData.find(entry => entry.date === selectedDateStr);
    return dayEntry?.completed || false;
  };

  const toggleHabit = (habitId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const isCompleted = getHabitCompletionStatus(habitId);

    if (isCompleted) {
      markHabitIncomplete(habitId, dateStr);
    } else {
      markHabitCompleted(habitId, dateStr);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsBottomSheetOpen(true);
    
    const title = date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    const content = (
      <DayHabitsBottomSheet
        date={date}
        habits={habits}
        habitCompletions={habitCompletions}
        onToggleHabit={toggleHabit}
      />
    );

    openBottomSheet(title, content);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('history.title')}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t(`months.${selectedDate.toLocaleDateString('en-US', { month: 'long' }).toLowerCase()}`)} {selectedDate.getFullYear()}
        </Text>
      </View>

      <NewCalendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        habitCompletions={habitCompletions}
        habits={habits}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
  },
});
