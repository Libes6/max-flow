import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
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
  const [isExpanded, setIsExpanded] = useState(false);

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysFromMonday);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    
    return weekDates;
  };

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

  const toggleView = () => {
    setIsExpanded(!isExpanded);
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

  const onGestureEvent = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      
      if (translationX < -50) {
        // Свайп влево - следующий месяц
        changeMonth('next');
      } else if (translationX > 50) {
        // Свайп вправо - предыдущий месяц
        changeMonth('prev');
      }
    }
  };

  const weekDates = getCurrentWeekDates();

  const renderWeekView = () => (
    <>
      <View style={styles.weekDaysHeader}>
        {weekDays.map((day, index) => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.weekDatesRow}>
        {weekDates.map((date, index) => {
          const status = getCompletionStatus(date);
          const dayNumber = date.getDate();
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.weekDateItem,
                isToday(date) && styles.today,
                isSelected(date) && !isToday(date) && styles.selectedDay,
              ]}
              onPress={() => onDateSelect(date)}
            >
              <Text style={[
                styles.weekDateNumber,
                isToday(date) && styles.todayText,
                isSelected(date) && !isToday(date) && styles.selectedDayText,
              ]}>
                {dayNumber}
              </Text>
              
              {status.completed && (
                <View style={[
                  styles.completionIndicator,
                  { backgroundColor: status.percentage === 100 ? colors.success : colors.warning }
                ]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );

  const renderMonthView = () => {
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

    return (
      <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onGestureEvent}>
        <View>
          <View style={styles.weekDaysHeader}>
            {weekDays.map(day => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>
          
          <View style={styles.calendarGrid}>
            {days}
          </View>
        </View>
      </PanGestureHandler>
    );
  };

  return (
    <View style={styles.container}>
      {isExpanded ? renderMonthView() : renderWeekView()}
      
      {/* Кнопка переключения вида */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleView}>
        <Text style={styles.toggleButtonText}>
          {isExpanded ? 'Свернуть' : 'Развернуть'}
        </Text>
      </TouchableOpacity>
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
    marginBottom: spacing.xs,
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
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  selectedDay: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  toggleButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  weekDatesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  weekDateItem: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 2,
    minHeight: 40,
  },
  weekDateNumber: {
    ...typography.bodyMedium,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
});
