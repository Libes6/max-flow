import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HabitsStackParamList } from '../../../app/navigation/types';
import { useTheme, spacing } from '../../../shared/theme';
import { FormInput } from '../../../shared/ui/FormInput';
import { Button } from '../../../shared/ui/Button';
import { useHabitsStore } from '../model/useHabitsStore';

export const EditHabitScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { habits, updateHabit, removeHabit } = useHabitsStore();

  const habit = habits.find(h => h.id === route.params.habitId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [selectedIcon, setSelectedIcon] = useState('fitness');

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description || '');
      setCategory(habit.category || '');
      setSelectedColor(habit.color || '#3B82F6');
      setSelectedIcon(habit.icon || 'fitness');
    }
  }, [habit]);

  const handleSubmit = () => {
    if (!habit) return;

    if (!name.trim()) {
      Alert.alert(t('common.error'), t('habits.nameRequired'));
      return;
    }

    updateHabit(habit.id, {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      color: selectedColor,
      icon: selectedIcon,
    });

    navigation.goBack();
  };

  const handleDelete = () => {
    if (!habit) return;

    Alert.alert(
      t('habits.deleteConfirmTitle'),
      t('habits.deleteConfirmMessage'),
      [
        { text: t('habits.deleteConfirmCancel'), style: 'cancel' },
        {
          text: t('habits.deleteConfirmDelete'),
          style: 'destructive',
          onPress: () => {
            removeHabit(habit.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleColorIconPress = () => {
    navigation.navigate('ColorIcon', {
      selectedColor,
      selectedIcon,
      onColorChange: setSelectedColor,
      onIconChange: setSelectedIcon,
    });
  };

  if (!habit) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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

          <FormInput
            label={t('habits.habitCategory')}
            value={category}
            onChangeText={setCategory}
            placeholder={t('habits.habitCategoryPlaceholder')}
          />

          <Button
            title={t('habits.colorIconButton')}
            onPress={handleColorIconPress}
            variant="secondary"
            style={styles.colorIconButton}
          />

          <View style={styles.buttonRow}>
            <Button
              title={t('habits.delete')}
              onPress={handleDelete}
              variant="secondary"
              style={[styles.deleteButton, { backgroundColor: '#EF4444' }]}
            />
            <Button
              title={t('habits.save')}
              onPress={handleSubmit}
              style={styles.saveButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  colorIconButton: {
    marginTop: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  deleteButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
