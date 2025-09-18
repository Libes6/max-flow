import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, spacing, typography } from '../theme';

interface DaysOfWeekSelectorProps {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
  disabled?: boolean;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Вс', short: 'В' },
  { value: 1, label: 'Пн', short: 'П' },
  { value: 2, label: 'Вт', short: 'В' },
  { value: 3, label: 'Ср', short: 'С' },
  { value: 4, label: 'Чт', short: 'Ч' },
  { value: 5, label: 'Пт', short: 'П' },
  { value: 6, label: 'Сб', short: 'С' },
];

export const DaysOfWeekSelector: React.FC<DaysOfWeekSelectorProps> = ({
  selectedDays,
  onDaysChange,
  disabled = false,
}) => {
  const { colors } = useTheme();

  const toggleDay = (day: number) => {
    if (disabled) return;
    
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter(d => d !== day));
    } else {
      onDaysChange([...selectedDays, day].sort());
    }
  };

  const selectAll = () => {
    if (disabled) return;
    onDaysChange([0, 1, 2, 3, 4, 5, 6]);
  };

  const selectWeekdays = () => {
    if (disabled) return;
    onDaysChange([1, 2, 3, 4, 5]);
  };

  const clearAll = () => {
    if (disabled) return;
    onDaysChange([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Дни недели
        </Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            onPress={selectAll}
            disabled={disabled}
            style={[
              styles.quickButton,
              { 
                backgroundColor: disabled ? colors.surface : colors.primary + '20',
                borderColor: colors.primary,
              }
            ]}
          >
            <Text style={[styles.quickButtonText, { color: colors.primary }]}>
              Все
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={selectWeekdays}
            disabled={disabled}
            style={[
              styles.quickButton,
              { 
                backgroundColor: disabled ? colors.surface : colors.primary + '20',
                borderColor: colors.primary,
              }
            ]}
          >
            <Text style={[styles.quickButtonText, { color: colors.primary }]}>
              Будни
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={clearAll}
            disabled={disabled}
            style={[
              styles.quickButton,
              { 
                backgroundColor: disabled ? colors.surface : colors.error + '20',
                borderColor: colors.error,
              }
            ]}
          >
            <Text style={[styles.quickButtonText, { color: colors.error }]}>
              Очистить
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.daysContainer}>
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = selectedDays.includes(day.value);
          return (
            <TouchableOpacity
              key={day.value}
              onPress={() => toggleDay(day.value)}
              disabled={disabled}
              style={[
                styles.dayButton,
                {
                  backgroundColor: isSelected 
                    ? colors.primary 
                    : disabled 
                      ? colors.surface 
                      : colors.background,
                  borderColor: isSelected ? colors.primary : colors.border,
                }
              ]}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  {
                    color: isSelected 
                      ? colors.background 
                      : disabled 
                        ? colors.textSecondary 
                        : colors.text,
                  }
                ]}
              >
                {day.short}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Выбрано дней: {selectedDays.length}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.body,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  quickButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
  },
  quickButtonText: {
    ...typography.caption,
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'space-between',
  },
  dayButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonText: {
    ...typography.caption,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.caption,
    textAlign: 'center',
  },
});
