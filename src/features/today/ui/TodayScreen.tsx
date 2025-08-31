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
import { colors, spacing, typography, dimensions } from '../../../shared/theme';
import { useHabitsStore } from '../../habits/model/useHabitsStore';
import { useStatisticsStore } from '../../statistics/model/useStatisticsStore';
import { EditHabitModal } from '../../habits/ui/EditHabitModal';
import { Habit } from '../../../shared/types';
import { format } from 'date-fns';
import { ru, en, uk, kk } from 'date-fns/locale';

const HabitCard: React.FC<{
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
  onEdit: () => void;
}> = ({ habit, isCompleted, onToggle, onEdit }) => {

  return (
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
      
      <View style={styles.habitActions}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={onToggle}
        >
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={isCompleted ? colors.success : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export const TodayScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const habits = useHabitsStore((s) => s.habits);
  const updateHabit = useHabitsStore((s) => s.updateHabit);
  const { habitCompletions, markHabitCompleted, markHabitIncomplete } = useStatisticsStore();
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  // Получаем сегодняшнюю дату в формате YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  // Функция для получения локали date-fns
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'en': return en;
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
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsEditOpen(true);
  };

  const handleUpdateHabit = (data: {
    name: string;
    description?: string;
    category?: string;
    color?: string;
  }) => {
    if (selectedHabit) {
      updateHabit(selectedHabit.id, data);
    }
  };

  const completedCount = habits.filter(habit => getHabitCompletionStatus(habit.id)).length;
  const totalCount = habits.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('today.title')}</Text>
        <Text style={styles.subtitle}>{formattedDate}</Text>
      </View>
      
      {totalCount > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              Прогресс: {completedCount}/{totalCount}
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
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
            onEdit={() => handleEditHabit(item)}
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
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
            <Text style={styles.emptyStateText}>
              {t('today.noHabits')}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {t('today.noHabitsSubtitle')}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.content}
      />

      <EditHabitModal
        visible={isEditOpen}
        habit={selectedHabit}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedHabit(null);
        }}
        onSubmit={handleUpdateHabit}
        onDelete={() => {
          // Удаление из экрана "Сегодня" не поддерживается
          Alert.alert('Информация', 'Для удаления привычки перейдите в раздел "Привычки"');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
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
    color: colors.text,
  },
  progressPercentage: {
    ...typography.h3,
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.xl + dimensions.androidBottomPadding,
  },
  section: {
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  habitCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
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
  habitActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  completeButton: {
    padding: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    ...typography.h3,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
