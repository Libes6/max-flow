import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useTheme, spacing, typography } from '../theme';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface TimePickerProps {
  value: string; // "09:00" формат
  onChange: (time: string) => void;
  disabled?: boolean;
  label?: string;
}

export const TimePicker: React.FC<TimePickerProps> = React.memo(({
  value,
  onChange,
  disabled = false,
  label,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [tempTime, setTempTime] = useState(value);

  const [hours, minutes] = useMemo(() => value.split(':').map(Number), [value]);

  // Синхронизируем tempTime с value при изменении value, но только если модальное окно закрыто
  useEffect(() => {
    console.log('TimePicker: value changed to', value, 'showModal:', showModal);
    if (!showModal) {
      setTempTime(value);
      console.log('TimePicker: tempTime updated to', value);
    }
  }, [value, showModal]);

  const handleConfirm = useCallback(() => {
    console.log('TimePicker: Confirming time change from', value, 'to', tempTime);
    onChange(tempTime);
    setShowModal(false);
  }, [onChange, tempTime, value]);

  const handleCancel = useCallback(() => {
    setTempTime(value);
    setShowModal(false);
  }, [value]);

  const formatTime = useCallback((h: number, m: number) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }, []);

  const generateHours = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => i);
  }, []);

  const generateMinutes = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => i);
  }, []);

  const updateTime = useCallback((newHours: number, newMinutes: number) => {
    setTempTime(formatTime(newHours, newMinutes));
  }, [formatTime]);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.timeButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          disabled && styles.disabled,
        ]}
        onPress={() => {
          if (!disabled) {
            setTempTime(value);
            setShowModal(true);
          }
        }}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Ionicons name="time-outline" size={20} color={colors.primary} />
        <Text style={[styles.timeText, { color: colors.text }]}>
          {value}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textTertiary} />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={[styles.cancelButton, { color: colors.textTertiary }]}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('common.select')}
              </Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={[styles.confirmButton, { color: colors.primary }]}>
                  {t('common.confirm')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timePickerContainer}>
              <View style={styles.pickerColumn}>
                <Text style={[styles.pickerLabel, { color: colors.textTertiary }]}>
                  Часы
                </Text>
                <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                  {generateHours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.pickerItem,
                        {
                          backgroundColor: parseInt(tempTime.split(':')[0]) === hour 
                            ? colors.primary 
                            : 'transparent',
                        },
                      ]}
                      onPress={() => updateTime(hour, parseInt(tempTime.split(':')[1]))}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color: parseInt(tempTime.split(':')[0]) === hour
                              ? '#ffffff'
                              : colors.text,
                          },
                        ]}
                      >
                        {hour.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.pickerColumn}>
                <Text style={[styles.pickerLabel, { color: colors.textTertiary }]}>
                  Минуты
                </Text>
                <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                  {generateMinutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.pickerItem,
                        {
                          backgroundColor: parseInt(tempTime.split(':')[1]) === minute
                            ? colors.primary
                            : 'transparent',
                        },
                      ]}
                      onPress={() => updateTime(parseInt(tempTime.split(':')[0]), minute)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color: parseInt(tempTime.split(':')[1]) === minute
                              ? '#ffffff'
                              : colors.text,
                          },
                        ]}
                      >
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.sm,
  },
  timeText: {
    ...typography.body,
    fontWeight: '500',
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    ...typography.h3,
    fontWeight: '600',
  },
  cancelButton: {
    ...typography.body,
    fontWeight: '500',
  },
  confirmButton: {
    ...typography.body,
    fontWeight: '600',
  },
  timePickerContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.xl,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    ...typography.caption,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  picker: {
    maxHeight: 200,
    width: '100%',
  },
  pickerItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginVertical: 2,
    alignItems: 'center',
  },
  pickerItemText: {
    ...typography.body,
    fontWeight: '500',
  },
});

TimePicker.displayName = 'TimePicker';
