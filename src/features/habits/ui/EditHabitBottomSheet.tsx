import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography } from '../../../shared/theme';
import { FormInput } from '../../../shared/ui/FormInput';
import { Button } from '../../../shared/ui/Button';
import { ColorIconBottomSheet } from './ColorIconBottomSheet';
import { useLocalBottomSheet } from '../../../shared/lib';
import { BottomSheet } from '../../../shared/ui';
import { Habit } from '../../../shared/types';

interface EditHabitBottomSheetProps {
  habit: Habit | null;
  onSubmit: (data: {
    name: string;
    description?: string;
    category?: string;
    color?: string;
    icon?: string;
  }) => void;
  onDelete: () => void;
  onClose: () => void;
}


export const EditHabitBottomSheet: React.FC<EditHabitBottomSheetProps> = ({
  habit,
  onSubmit,
  onDelete,
  onClose,
}) => {
  const { colors } = useTheme();
  const {
    isVisible,
    title,
    content,
    bottomSheetRef,
    openBottomSheet,
    closeBottomSheet,
    handleClose,
  } = useLocalBottomSheet();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [selectedIcon, setSelectedIcon] = useState('fitness');
  const [showColorIconPicker, setShowColorIconPicker] = useState(false);

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
    if (!name.trim()) return;
    
    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      color: selectedColor,
      icon: selectedIcon,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const handleColorIconPress = () => {
    setShowColorIconPicker(true);
  };

  const handleBackToEdit = () => {
    setShowColorIconPicker(false);
  };

  if (showColorIconPicker) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToEdit} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Цвет и иконка</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.pickerContainer}>
          <ColorIconBottomSheet
            selectedColor={selectedColor}
            selectedIcon={selectedIcon}
            onColorChange={setSelectedColor}
            onIconChange={setSelectedIcon}
            onClose={handleBackToEdit}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.form}>
        <FormInput
          label="Название"
          placeholder="Название привычки"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <FormInput
          label="Описание"
          placeholder="Краткое описание"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={[styles.input, styles.multilineInput]}
        />

        <FormInput
          label="Категория"
          placeholder="Например: Здоровье, Обучение"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.colorIconButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={handleColorIconPress}
        >
          <View style={styles.colorIconPreview}>
            <View style={[styles.iconPreview, { backgroundColor: selectedColor }]}>
              <Ionicons name={selectedIcon as any} size={20} color="white" />
            </View>
            <View style={styles.colorIconInfo}>
              <Text style={[styles.colorIconTitle, { color: colors.text }]}>Цвет и иконка</Text>
              <Text style={[styles.colorIconSubtitle, { color: colors.textSecondary }]}>
                Настроить внешний вид
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <Button
          title="Удалить"
          onPress={handleDelete}
          style={styles.button}
        />
        <Button
          title="Сохранить"
          onPress={handleSubmit}
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
    paddingBottom: spacing.sm,
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
  colorIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  colorIconPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  colorIconInfo: {
    flex: 1,
  },
  colorIconTitle: {
    ...typography.body,
    fontWeight: '500',
    marginBottom: 2,
  },
  colorIconSubtitle: {
    ...typography.caption,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...typography.h3,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  pickerContainer: {
    flex: 1,
  },
});
