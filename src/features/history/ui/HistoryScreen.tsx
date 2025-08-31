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
import { Calendar } from '../../../shared/ui';
import { useHabitsStore } from '../../habits/model/useHabitsStore';
import { useStatisticsStore } from '../../statistics/model/useStatisticsStore';
import { EditHabitModal } from '../../habits/ui/EditHabitModal';
import { Habit } from '../../../shared/types';

const HabitDayCard: React.FC<{
  habit: any;
  isCompleted: boolean;
  onToggle: () => void;
  onEdit: () => void;
}> = ({ habit, isCompleted, onToggle, onEdit }) => {

  return (
    <TouchableOpacity 
      style={styles.habitDayCard}
      onPress={onEdit}
    >
      <View style={styles.habitDayHeader}>
        <View style={[styles.habitDayIcon, { backgroundColor: habit.color }]}>
          <Text style={styles.habitDayIconText}>
            {habit.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.habitDayInfo}>
          <Text style={styles.habitDayName}>{habit.name}</Text>
          {!!habit.description && (
            <Text style={styles.habitDayDescription}>{habit.description}</Text>
          )}
        </View>
      </View>

      <View style={styles.habitDayActions}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={onToggle}
        >
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
            size={22}
            color={isCompleted ? colors.success : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export const HistoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const habits = useHabitsStore((s) => s.habits);
  const updateHabit = useHabitsStore((s) => s.updateHabit);
  const { habitCompletions, markHabitCompleted, markHabitIncomplete } = useStatisticsStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  const getHabitCompletionStatus = (habitId: string) => {
    const habitData = habitCompletions[habitId] || [];
    const dayEntry = habitData.find(entry => entry.date === selectedDateStr);
    return dayEntry?.completed || false;
  };

  const toggleHabit = (habitId: string) => {
    const isCompleted = getHabitCompletionStatus(habitId);

    if (isCompleted) {
      markHabitIncomplete(habitId, selectedDateStr);
    } else {
      markHabitCompleted(habitId, selectedDateStr);
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

  const handleCloseModal = () => {
    setIsEditOpen(false);
    setSelectedHabit(null);
  };

  const getDayStats = () => {
    const completedCount = habits.filter(habit => getHabitCompletionStatus(habit.id)).length;
    const totalCount = habits.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return { completedCount, totalCount, progressPercentage };
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const dayStats = getDayStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('history.title')}</Text>
        <Text style={styles.subtitle}>{t('history.month')}</Text>
      </View>

      <Calendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        habitCompletions={habitCompletions}
        habits={habits}
      />

        <FlatList
         data={habits}
         keyExtractor={(item) => item.id}
         renderItem={({ item }) => (
           <HabitDayCard
             habit={item}
             isCompleted={getHabitCompletionStatus(item.id)}
             onToggle={() => toggleHabit(item.id)}
             onEdit={() => handleEditHabit(item)}
           />
         )}
         ListHeaderComponent={() => (
           <View>
             <View style={styles.selectedDateSection}>
               <View style={styles.selectedDateHeader}>
                 <Text style={styles.selectedDateTitle}>
                   {formatDate(selectedDate)}
                 </Text>
                 {isToday(selectedDate) && (
                   <View style={styles.todayBadge}>
                     <Text style={styles.todayBadgeText}>Сегодня</Text>
                   </View>
                 )}
               </View>

               {dayStats.totalCount > 0 && (
                 <View style={styles.dayProgressSection}>
                   <View style={styles.dayProgressHeader}>
                     <Text style={styles.dayProgressText}>
                       Прогресс: {dayStats.completedCount}/{dayStats.totalCount}
                     </Text>
                     <Text style={styles.dayProgressPercentage}>
                       {Math.round(dayStats.progressPercentage)}%
                     </Text>
                   </View>
                   <View style={styles.dayProgressBar}>
                     <View
                       style={[
                         styles.dayProgressFill,
                         { width: `${dayStats.progressPercentage}%` }
                       ]}
                     />
                   </View>
                 </View>
               )}
             </View>

             <View style={styles.habitsSection}>
               <Text style={styles.sectionTitle}>
                 {t('history.title')} {selectedDate.getDate()} {t(`months.${selectedDate.toLocaleDateString('en-US', { month: 'long' }).toLowerCase()}`)}
               </Text>
             </View>
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
               {t('history.noEntries')}
             </Text>
             <Text style={styles.emptyStateSubtext}>
               {t('history.noEntriesSubtitle')}
             </Text>
             </View>
         )}
         contentContainerStyle={styles.listContainer}
         showsVerticalScrollIndicator={false}
         style={styles.flatList}
       />

      <EditHabitModal
        visible={isEditOpen}
        habit={selectedHabit}
        onClose={handleCloseModal}
        onSubmit={handleUpdateHabit}
        onDelete={() => {
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
  flatList: {
    flexGrow: 1,
  },
  listContainer: {
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.xl + dimensions.androidBottomPadding,
  },
  selectedDateSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  selectedDateTitle: {
    ...typography.h2,
    color: colors.text,
    flex: 1,
    flexShrink: 1,
  },
  todayBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  todayBadgeText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '500',
  },
  dayProgressSection: {
    marginBottom: spacing.lg,
  },
  dayProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dayProgressText: {
    ...typography.body,
    color: colors.text,
  },
  dayProgressPercentage: {
    ...typography.h3,
    color: colors.primary,
  },
  dayProgressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  dayProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  habitsSection: {
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  habitDayCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitDayIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  habitDayIconText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  habitDayInfo: {
    flex: 1,
  },
  habitDayName: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  habitDayDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  habitDayActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  completeButton: {
    padding: spacing.xs,
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
