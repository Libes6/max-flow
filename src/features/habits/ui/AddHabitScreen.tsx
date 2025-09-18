import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HabitsStackParamList } from '../../../app/navigation/types';
import { useTheme, spacing } from '../../../shared/theme';
import { FormInput } from '../../../shared/ui/FormInput';
import { Button } from '../../../shared/ui/Button';
import { PrioritySelector, type Priority, CategorySelector, TimePicker, Switch } from '../../../shared/ui';
import { useHabitsStore } from '../model/useHabitsStore';
import { useHabitNotifications } from '../hooks/useHabitNotifications';

export const AddHabitScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { addHabit } = useHabitsStore();
  const { scheduleHabitReminders, permissions } = useHabitNotifications();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [selectedIcon, setSelectedIcon] = useState('fitness');
  const [priority, setPriority] = useState<Priority>('medium');
  const [reminderTime, setReminderTime] = useState<string | undefined>(undefined);
  const [enableReminder, setEnableReminder] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('habits.nameRequired'));
      return;
    }

    const habitData = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      color: selectedColor,
      icon: selectedIcon,
      priority,
    };

    // Создаем привычку
    addHabit(habitData);

    // Получаем созданную привычку из store
    const { habits } = useHabitsStore.getState();
    const createdHabit = habits.find(h => h.name === habitData.name && h.description === habitData.description);

    // Планируем напоминание если включено
    if (enableReminder && reminderTime && permissions && createdHabit) {
      try {
        console.log('🔔 AddHabitScreen: Scheduling reminder for habit:', createdHabit.name);
        const [hours, minutes] = reminderTime.split(':').map(Number);
        const reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0, 0);
        
        // Если время уже прошло сегодня, планируем на завтра
        if (reminderDate <= new Date()) {
          reminderDate.setDate(reminderDate.getDate() + 1);
        }

        console.log('🔔 AddHabitScreen: Reminder date:', reminderDate);
        await scheduleHabitReminders(createdHabit.id, reminderDate);
        console.log('🔔 AddHabitScreen: Reminder scheduled successfully');
      } catch (error) {
        console.error('🔔 AddHabitScreen: Failed to schedule reminder:', error);
        Alert.alert(t('common.error'), t('habits.reminderError'));
      }
    }

    navigation.goBack();
  };

  const handleColorIconPress = () => {
    navigation.navigate('ColorIcon', {
      selectedColor,
      selectedIcon,
      onColorChange: setSelectedColor,
      onIconChange: setSelectedIcon,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <FormInput
            label={t('habits.habitName')}
            value={name}
            onChangeText={setName}
            placeholder={t('habits.habitNamePlaceholder')}
            required
          />

          <FormInput
            label={t('habits.habitDescription')}
            value={description}
            onChangeText={setDescription}
            placeholder={t('habits.habitDescriptionPlaceholder')}
            multiline
            numberOfLines={3}
          />

          <CategorySelector
            selectedCategory={category}
            onCategoryChange={setCategory}
          />

          <PrioritySelector
            selectedPriority={priority}
            onPriorityChange={setPriority}
          />

          <Button
            title={t('habits.colorIconButton')}
            onPress={handleColorIconPress}
            variant="secondary"
            style={styles.colorIconButton}
          />

          {permissions && (
            <View style={styles.reminderSection}>
              <Switch
                label={t('habits.enableReminder')}
                subtitle={t('habits.reminderTimeSubtitle')}
                value={enableReminder}
                onValueChange={setEnableReminder}
              />
              
              {enableReminder && (
                <TimePicker
                  label={t('habits.reminderTime')}
                  value={reminderTime || '09:00'}
                  onChange={setReminderTime}
                />
              )}
            </View>
          )}

          <View style={styles.buttonRow}>
            <Button
              title={t('habits.cancel')}
              onPress={() => navigation.goBack()}
              variant="secondary"
              style={styles.cancelButton}
            />
            <Button
              title={t('habits.save')}
              onPress={handleSubmit}
              style={styles.saveButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2, // Увеличиваем отступ снизу
  },
  form: {
    gap: spacing.md,
  },
  colorIconButton: {
    marginTop: spacing.xs,
  },
  reminderSection: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg, // Увеличиваем отступ сверху
    marginBottom: spacing.lg, // Добавляем отступ снизу
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
