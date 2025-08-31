import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography } from '../theme';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  habitCompletions: Record<string, { date: string; completed: boolean }[]>;
  habits: any[];
}

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  habitCompletions,
  habits,
}) => {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Получаем день недели первого дня месяца (0 = воскресенье, 1 = понедельник)
    const firstDayOfWeek = firstDay.getDay();
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Приводим к понедельник = 0
    
    return { daysInMonth, startOffset };
  };

  const getCompletionStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    let completedCount = 0;
    let totalCount = habits.length;

    habits.forEach(habit => {
      const habitData = habitCompletions[habit.id] || [];
      const dayEntry = habitData.find(entry => entry.date === dateStr);
      if (dayEntry?.completed) {
        completedCount++;
      }
    });

    if (totalCount === 0) return { completed: false, percentage: 0 };
    
    const percentage = (completedCount / totalCount) * 100;
    return {
      completed: completedCount > 0,
      percentage,
      completedCount,
      totalCount,
    };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const renderCalendarDays = () => {
    const { daysInMonth, startOffset } = getDaysInMonth(selectedDate);
    const days = [];

    // Добавляем пустые ячейки для выравнивания
    for (let i = 0; i < startOffset; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const status = getCompletionStatus(date);
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            (isToday(date) || isSelected(date)) && styles.dayWithBackground,
            isToday(date) && styles.today,
            isSelected(date) && styles.selectedDay,
          ]}
          onPress={() => onDateSelect(date)}
        >
          <Text style={[
            styles.dayNumber,
            isToday(date) && styles.todayText,
            isSelected(date) && styles.selectedDayText,
          ]}>
            {day}
          </Text>
          
          {status.completed && (
            <View style={[
              styles.completionIndicator,
              { backgroundColor: status.percentage === 100 ? colors.success : colors.warning }
            ]} />
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  const getMonthName = (date: Date) => {
    const months = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return months[date.getMonth()];
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateSelect(newDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth('prev')} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>
          {getMonthName(selectedDate)} {selectedDate.getFullYear()}
        </Text>
        
        <TouchableOpacity onPress={() => changeMonth('next')} style={styles.navButton}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekDaysHeader}>
        {weekDays.map(day => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {renderCalendarDays()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  navButtonText: {
    fontSize: 24,
    color: colors.text,
    fontWeight: 'bold',
  },
  monthTitle: {
    ...typography.h2,
    color: colors.text,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
    color: colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 40,
  },
  dayWithBackground: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    ...typography.bodyMedium,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  today: {
    backgroundColor: colors.primary,
  },
  todayText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  selectedDay: {
    backgroundColor: colors.primaryLight,
  },
  selectedDayText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  completionIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.background,
  },
});
