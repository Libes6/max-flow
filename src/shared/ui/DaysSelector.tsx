import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, spacing, typography } from '../theme';
import { useTranslation } from 'react-i18next';

interface DaysSelectorProps {
  selectedDays: number[]; // [1,2,3,4,5] - дни недели (1=понедельник)
  onChange: (days: number[]) => void;
  disabled?: boolean;
  label?: string;
}

export const DaysSelector: React.FC<DaysSelectorProps> = React.memo(({
  selectedDays,
  onChange,
  disabled = false,
  label,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const days = useMemo(() => [
    { key: 1, short: t('days.mon'), long: t('days.monday') },
    { key: 2, short: t('days.tue'), long: t('days.tuesday') },
    { key: 3, short: t('days.wed'), long: t('days.wednesday') },
    { key: 4, short: t('days.thu'), long: t('days.thursday') },
    { key: 5, short: t('days.fri'), long: t('days.friday') },
    { key: 6, short: t('days.sat'), long: t('days.saturday') },
    { key: 0, short: t('days.sun'), long: t('days.sunday') },
  ], [t]);

  const handleDayToggle = useCallback((dayKey: number) => {
    if (disabled) return;

    const newSelectedDays = selectedDays.includes(dayKey)
      ? selectedDays.filter(day => day !== dayKey)
      : [...selectedDays, dayKey];
    
    onChange(newSelectedDays);
  }, [disabled, selectedDays, onChange]);

  const isAllSelected = useMemo(() => selectedDays.length === 7, [selectedDays.length]);
  const isWeekdaysSelected = useMemo(() => 
    selectedDays.length === 5 && selectedDays.every(day => day >= 1 && day <= 5),
    [selectedDays]
  );

  const handleSelectAll = useCallback(() => {
    if (disabled) return;
    onChange(isAllSelected ? [] : [0, 1, 2, 3, 4, 5, 6]);
  }, [disabled, isAllSelected, onChange]);

  const handleSelectWeekdays = useCallback(() => {
    if (disabled) return;
    onChange(isWeekdaysSelected ? [] : [1, 2, 3, 4, 5]);
  }, [disabled, isWeekdaysSelected, onChange]);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}

      {/* Быстрые кнопки */}
      <View style={styles.quickButtons}>
        <TouchableOpacity
          style={[
            styles.quickButton,
            {
              backgroundColor: isAllSelected ? colors.primary : colors.surface,
              borderColor: isAllSelected ? colors.primary : colors.border,
            },
            disabled && styles.disabled,
          ]}
          onPress={handleSelectAll}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.quickButtonText,
              {
                color: isAllSelected ? '#ffffff' : colors.text,
              },
            ]}
          >
            Все дни
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.quickButton,
            {
              backgroundColor: isWeekdaysSelected ? colors.primary : colors.surface,
              borderColor: isWeekdaysSelected ? colors.primary : colors.border,
            },
            disabled && styles.disabled,
          ]}
          onPress={handleSelectWeekdays}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.quickButtonText,
              {
                color: isWeekdaysSelected ? '#ffffff' : colors.text,
              },
            ]}
          >
            Рабочие дни
          </Text>
        </TouchableOpacity>
      </View>

      {/* Дни недели */}
      <View style={styles.daysContainer}>
        {days.map((day) => {
          const isSelected = selectedDays.includes(day.key);
          
          return (
            <TouchableOpacity
              key={day.key}
              style={[
                styles.dayButton,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
                disabled && styles.disabled,
              ]}
              onPress={() => handleDayToggle(day.key)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  {
                    color: isSelected ? '#ffffff' : colors.text,
                  },
                ]}
              >
                {day.short}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Информация о выбранных днях */}
      {selectedDays.length > 0 && (
        <Text style={[styles.selectedInfo, { color: colors.textTertiary }]}>
          {selectedDays.length === 7 
            ? 'Каждый день'
            : `Выбрано дней: ${selectedDays.length}`
          }
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  label: {
    ...typography.body,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  quickButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickButtonText: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  dayButton: {
    flex: 1,
    minWidth: 40,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  selectedInfo: {
    ...typography.caption,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

DaysSelector.displayName = 'DaysSelector';
