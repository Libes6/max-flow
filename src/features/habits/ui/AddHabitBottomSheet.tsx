import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, spacing, typography } from '../../../shared/theme';
import { FormInput } from '../../../shared/ui/FormInput';
import { Button } from '../../../shared/ui/Button';

interface AddHabitBottomSheetProps {
  onSubmit: (data: { name: string; description?: string; category?: string }) => void;
  onClose: () => void;
}

export const AddHabitBottomSheet: React.FC<AddHabitBottomSheetProps> = ({ 
  onSubmit, 
  onClose 
}) => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    onSubmit({ name, description, category });
    setName('');
    setDescription('');
    setCategory('');
    onClose();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.form}>
        <FormInput
          label="Название"
          placeholder="Напр. Утренняя зарядка"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <FormInput
          label="Описание"
          placeholder="Короткое описание"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={[styles.input, styles.multilineInput]}
        />

        <FormInput
          label="Категория"
          placeholder="Напр. Здоровье"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />
      </View>

      <View style={styles.actions}>
        <Button
          title="Отмена"
          variant="secondary"
          onPress={onClose}
          style={styles.button}
        />
        <Button
          title="Сохранить"
          onPress={handleSave}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.lg,
    flex: 1,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: spacing.lg,
    minHeight: 45,
    paddingVertical: spacing.sm,
  },
  multilineInput: {
    minHeight: 80,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
});
