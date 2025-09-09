import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Calendar from 'react-native-calendars/src/calendar';
import { LocaleConfig } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import i18n from '../lib/i18n';
import { useTheme, spacing } from '../theme';

interface Habit {
  id: string;
  name: string;
  color: string;
}

interface HabitCompletion {
  date: string;
  completed: boolean;
}

interface NewCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  habitCompletions: Record<string, HabitCompletion[]>;
  habits: Habit[];
}

export const NewCalendar: React.FC<NewCalendarProps> = ({
  selectedDate,
  onDateSelect,
  habitCompletions,
  habits,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [calendarKey, setCalendarKey] = useState(0);

  // Настраиваем локализацию календаря
  useEffect(() => {
    const currentLanguage = i18n.language;
    
    LocaleConfig.locales[currentLanguage] = {
      monthNames: [
        t('months.january'),
        t('months.february'),
        t('months.march'),
        t('months.april'),
        t('months.may'),
        t('months.june'),
        t('months.july'),
        t('months.august'),
        t('months.september'),
        t('months.october'),
        t('months.november'),
        t('months.december'),
      ],
      monthNamesShort: [
        t('months.january').substring(0, 3),
        t('months.february').substring(0, 3),
        t('months.march').substring(0, 3),
        t('months.april').substring(0, 3),
        t('months.may').substring(0, 3),
        t('months.june').substring(0, 3),
        t('months.july').substring(0, 3),
        t('months.august').substring(0, 3),
        t('months.september').substring(0, 3),
        t('months.october').substring(0, 3),
        t('months.november').substring(0, 3),
        t('months.december').substring(0, 3),
      ],
      dayNames: [
        t('weekdays.sunday'),
        t('weekdays.monday'),
        t('weekdays.tuesday'),
        t('weekdays.wednesday'),
        t('weekdays.thursday'),
        t('weekdays.friday'),
        t('weekdays.saturday'),
      ],
      dayNamesShort: [
        t('weekdaysShort.sunday'),
        t('weekdaysShort.monday'),
        t('weekdaysShort.tuesday'),
        t('weekdaysShort.wednesday'),
        t('weekdaysShort.thursday'),
        t('weekdaysShort.friday'),
        t('weekdaysShort.saturday'),
      ],
      today: t('calendar.today'),
    };
    
    LocaleConfig.defaultLocale = currentLanguage;
    
    // Принудительно перерендериваем календарь при изменении языка
    setCalendarKey(prev => prev + 1);
  }, [t, i18n.language]);

  // Преобразуем данные привычек в формат для календаря
  const getMarkedDates = () => {
    const marked: any = {};
    
    // Добавляем выбранную дату
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    marked[selectedDateString] = {
      selected: true,
      selectedColor: colors.primary,
    };

    // Добавляем индикаторы выполнения привычек
    habits.forEach(habit => {
      const completions = habitCompletions[habit.id] || [];
      
      completions.forEach(completion => {
        const dateString = completion.date;
        
        if (!marked[dateString]) {
          marked[dateString] = {
            dots: [],
            marked: false,
          };
        }

        // Убеждаемся, что dots существует и является массивом
        if (!marked[dateString].dots) {
          marked[dateString].dots = [];
        }

        // Добавляем точку для каждой привычки
        marked[dateString].dots.push({
          key: habit.id,
          color: completion.completed ? colors.success : colors.warning,
        });
      });
    });

    return marked;
  };

  const handleDayPress = (day: any) => {
    const date = new Date(day.dateString);
    onDateSelect(date);
  };

  return (
    <View style={styles.container}>
      <Calendar
        key={calendarKey}
        current={selectedDate.toISOString().split('T')[0]}
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
        theme={{
          backgroundColor: colors.surface,
          calendarBackground: colors.surface,
          textSectionTitleColor: colors.text,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.surface,
          todayTextColor: colors.primary,
          dayTextColor: colors.text,
          textDisabledColor: colors.textSecondary,
          dotColor: colors.primary,
          selectedDotColor: colors.surface,
          arrowColor: colors.primary,
          monthTextColor: colors.text,
          indicatorColor: colors.primary,
          textDayFontWeight: '500',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '500',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
        hideExtraDays={true}
        firstDay={1} // Начинаем с понедельника
        showWeekNumbers={false}
        disableMonthChange={false}
        enableSwipeMonths={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  calendar: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
