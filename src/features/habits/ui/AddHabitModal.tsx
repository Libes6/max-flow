import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../../shared/theme';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string; category?: string }) => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ visible, onClose, onSubmit }) => {
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
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Новая привычка</Text>

          <Text style={styles.label}>Название</Text>
          <TextInput
            style={styles.input}
            placeholder="Напр. Утренняя зарядка"
            placeholderTextColor={colors.textTertiary}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Описание</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Короткое описание"
            placeholderTextColor={colors.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Категория</Text>
          <TextInput
            style={styles.input}
            placeholder="Напр. Здоровье"
            placeholderTextColor={colors.textTertiary}
            value={category}
            onChangeText={setCategory}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.buttonGhost]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.buttonTextGhost]}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleSave}>
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  buttonGhost: {
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  buttonText: {
    ...typography.bodyMedium,
    color: '#fff',
    fontWeight: '600',
  },
  buttonTextGhost: {
    color: colors.text,
  },
});
