import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography } from '../theme';
import { FlatList } from 'react-native-gesture-handler';

interface Habit {
  id: string;
  name: string;
  color: string;
  description?: string;
}

interface HabitCompletion {
  date: string;
  completed: boolean;
}

interface DayHabitsBottomSheetProps {
  date: Date;
  habits: Habit[];
  habitCompletions: Record<string, HabitCompletion[]>;
  onToggleHabit: (habitId: string, date: Date) => void;
}

export const DayHabitsBottomSheet: React.FC<DayHabitsBottomSheetProps> = ({
  date,
  habits,
  habitCompletions,
  onToggleHabit,
}) => {
  const { colors } = useTheme();

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  const dayHabits = useMemo(() => {
    const dateString = date.toISOString().split('T')[0];
    
    return habits.map(habit => {
      const completions = habitCompletions[habit.id] || [];
      const completion = completions.find(c => c.date === dateString);
      
      return {
        ...habit,
        completed: completion?.completed || false,
      };
    });
  }, [habits, habitCompletions, date]);

  const completedCount = dayHabits.filter(h => h.completed).length;
  const totalCount = dayHabits.length;

  const renderHabitItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.habitItem,
        { backgroundColor: colors.surface, borderColor: colors.border }
      ]}
      onPress={() => onToggleHabit(item.id, date)}
      activeOpacity={0.7}
    >
      <View style={styles.habitLeft}>
        <View style={[styles.habitIcon, { backgroundColor: item.color }]}>
          <Text style={[styles.habitIconText, { color: colors.surface }]}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.habitInfo}>
          <Text style={[styles.habitName, { color: colors.text }]}>
            {item.name}
          </Text>
          {item.description && (
            <Text style={[styles.habitDescription, { color: colors.textSecondary }]}>
              {item.description}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.habitRight}>
        <View style={[
          styles.completionButton,
          { 
            backgroundColor: item.completed ? colors.success : colors.background,
            borderColor: item.completed ? colors.success : colors.border,
          }
        ]}>
          {item.completed && (
            <Ionicons name="checkmark" size={16} color={colors.surface} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.dateText, { color: colors.text }]}>
          {formatDate(date)}
        </Text>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          Выполнено: {completedCount} из {totalCount}
        </Text>
      </View>

      {dayHabits.length > 0 ? (
        <FlatList
          data={dayHabits}
          keyExtractor={(item) => item.id}
          renderItem={renderHabitItem}
          style={styles.habitsList}
          contentContainerStyle={styles.habitsListContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Нет привычек на этот день
          </Text>
        </View>
      )}  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.lg,
    flex: 1,
  },
  header: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dateText: {
    ...typography.h3,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  progressText: {
    ...typography.body,
  },
  habitsList: {
    flex: 1,
  },
  habitsListContent: {
    paddingBottom: spacing.lg,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.sm,
    minHeight: 64,
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  habitIconText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    ...typography.body,
    fontWeight: '500',
    marginBottom: 2,
  },
  habitDescription: {
    ...typography.caption,
  },
  habitRight: {
    marginLeft: spacing.sm,
  },
  completionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
