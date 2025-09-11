import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography, dimensions } from '../../../shared/theme';
import { useHabitsStore } from '../../habits/model/useHabitsStore';
import { useStatisticsStore } from '../../statistics/model/useStatisticsStore';
import { Habit } from '../../../shared/types';
import { format } from 'date-fns';
import { ru, enUS, uk, kk } from 'date-fns/locale';
import { ConfettiEffect } from '../../../shared/ui/ConfettiEffect';
import { useSettingsStore } from '../../../shared/lib/stores/useSettingsStore';

const HabitCard: React.FC<{
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}> = ({ habit, isCompleted, onToggle }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.habitCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onToggle}
    >
      <View style={styles.habitHeader}>
        <View style={[styles.habitIcon, { backgroundColor: habit.color }]}>
          {habit.icon ? (
            <Ionicons 
              name={habit.icon as any} 
              size={20} 
              color="white" 
            />
          ) : (
            <Text style={[styles.habitIconText, { color: colors.text }]}>
              {habit.name.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <View style={styles.habitInfo}>
          <Text style={[styles.habitName, { color: colors.text }]}>{habit.name}</Text>
          {!!habit.description && (
            <Text style={[styles.habitDescription, { color: colors.textSecondary }]}>{habit.description}</Text>
          )}
          {!!habit.category && (
            <Text style={[styles.habitCategory, { color: colors.textTertiary }]}>{habit.category}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.habitActions}>
        <Ionicons
          name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={20}
          color={isCompleted ? colors.success : colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
};

export const TodayScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const habits = useHabitsStore((s) => s.habits);
  const { habitCompletions, markHabitCompleted, markHabitIncomplete } = useStatisticsStore();
  const { visualEffects } = useSettingsStore();
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Получаем сегодняшнюю дату в формате YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  // Функция для получения локали date-fns
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'en': return enUS;
      case 'uk': return uk;
      case 'kk': return kk;
      default: return ru;
    }
  };
  
  // Форматируем дату для отображения
  const formattedDate = format(new Date(), 'EEEE, d MMMM', { locale: getDateLocale() });

  // Проверяем, какие привычки выполнены сегодня
  const getHabitCompletionStatus = (habitId: string) => {
    const habitData = habitCompletions[habitId] || [];
    const todayEntry = habitData.find(entry => entry.date === today);
    return todayEntry?.completed || false;
  };

  const toggleHabit = (habitId: string) => {
    const isCompleted = getHabitCompletionStatus(habitId);
    
    if (isCompleted) {
      markHabitIncomplete(habitId, today);
    } else {
      markHabitCompleted(habitId, today);
      // Показываем конфетти только при выполнении привычки
      if (visualEffects) {
        setShowConfetti(true);
      }
    }
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };


  const completedCount = habits.filter(habit => getHabitCompletionStatus(habit.id)).length;
  const totalCount = habits.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <>
    
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ConfettiEffect 
        isVisible={showConfetti} 
        onComplete={handleConfettiComplete} 
      />
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('today.title')}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{formattedDate}</Text>
        </View>
      
      {totalCount > 0 && (
        <View style={styles.progressSection}>
                     <View style={styles.progressHeader}>
             <Text style={[styles.progressText, { color: colors.text }]}>
               Прогресс: {completedCount}/{totalCount}
             </Text>
             <Text style={[styles.progressPercentage, { color: colors.primary }]}>
               {Math.round(progressPercentage)}%
             </Text>
           </View>
           <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
             <View 
               style={[
                 styles.progressFill, 
                 { backgroundColor: colors.primary, width: `${progressPercentage}%` }
               ]} 
             />
           </View>
        </View>
      )}
      
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            isCompleted={getHabitCompletionStatus(item.id)}
            onToggle={() => toggleHabit(item.id)}
          />
        )}
                 ListHeaderComponent={() => (
           <View style={styles.section}>
             <Text style={[styles.sectionTitle, { color: colors.text }]}>
               {t('today.title')} ({totalCount})
             </Text>
           </View>
         )}
                 ListEmptyComponent={() => (
           <View style={styles.emptyState}>
             <Ionicons 
               name="calendar-outline" 
               size={64} 
               color={colors.textTertiary} 
             />
             <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
               {t('today.noHabits')}
             </Text>
             <Text style={[styles.emptyStateSubtext, { color: colors.textTertiary }]}>
               {t('today.noHabitsSubtitle')}
             </Text>
           </View>
         )}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.content}
      />
      </SafeAreaView>
    </>
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
  progressSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressText: {
    ...typography.body,
  },
  progressPercentage: {
    ...typography.h3,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.xl + dimensions.androidBottomPadding,
  },
  section: {
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  habitCard: {
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  habitIconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  habitDescription: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
  },
  habitCategory: {
    ...typography.caption,
  },
  habitActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    ...typography.h3,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
});
