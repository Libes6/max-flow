import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HabitsStackParamList } from '../../../app/navigation/types';
import { useTheme, spacing } from '../../../shared/theme';
import { FormInput } from '../../../shared/ui/FormInput';
import { Button } from '../../../shared/ui/Button';
import { useHabitsStore } from '../model/useHabitsStore';

export const AddHabitScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { addHabit } = useHabitsStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [selectedIcon, setSelectedIcon] = useState('fitness');

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('habits.nameRequired'));
      return;
    }

    addHabit({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      color: selectedColor,
      icon: selectedIcon,
    });

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
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
