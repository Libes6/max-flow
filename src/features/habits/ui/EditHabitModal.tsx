import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../../../shared/theme';
import { Button } from '../../../shared/ui';
import { Habit } from '../../../shared/types';

interface EditHabitModalProps {
  visible: boolean;
  habit: Habit | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    category?: string;
    color?: string;
  }) => void;
  onDelete: () => void;
}

const colorOptions = [
  colors.primary,
  colors.success,
  colors.warning,
  colors.error,
  colors.info,
  '#FF6B6B', // красный
  '#4ECDC4', // бирюзовый
  '#45B7D1', // голубой
  '#96CEB4', // мятный
  '#FFEAA7', // желтый
];

export const EditHabitModal: React.FC<EditHabitModalProps> = ({
  visible,
  habit,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors.primary);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description || '');
      setCategory(habit.category);
      setSelectedColor(habit.color);
    }
  }, [habit]);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Ошибка', 'Название привычки обязательно');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      color: selectedColor,
    });

    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Удалить привычку',
      'Вы уверены, что хотите удалить эту привычку? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Редактировать привычку</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Название</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Название привычки"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Описание (необязательно)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Краткое описание"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Категория</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Например: Здоровье, Обучение"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Цвет</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Сохранить"
            onPress={handleSubmit}
            size="large"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  deleteButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: colors.text,
  },
  footer: {
    marginTop:spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopColor: colors.border,
  },
  footerDivider: {
    height: 3,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
});
