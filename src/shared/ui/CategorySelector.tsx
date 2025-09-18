import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useTheme, spacing, typography } from '../theme';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useHabitsStore } from '../../features/habits/model/useHabitsStore';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  disabled?: boolean;
}

// Предустановленные категории
const predefinedCategories = [
  { key: 'health', icon: 'heart', color: '#ef4444' },
  { key: 'fitness', icon: 'fitness', color: '#f59e0b' },
  { key: 'learning', icon: 'book', color: '#3b82f6' },
  { key: 'work', icon: 'briefcase', color: '#8b5cf6' },
  { key: 'personal', icon: 'person', color: '#10b981' },
  { key: 'social', icon: 'people', color: '#ec4899' },
  { key: 'hobby', icon: 'musical-notes', color: '#06b6d4' },
  { key: 'general', icon: 'list', color: '#6b7280' },
];

// Доступные иконки для пользовательских категорий
const customCategoryIcons = [
  'star', 'diamond', 'flash', 'leaf', 'flower', 'sunny', 'moon', 'cloud',
  'snow', 'rainy', 'thunderstorm', 'partly-sunny', 'umbrella', 'beach',
  'bicycle', 'car', 'airplane', 'train', 'boat', 'rocket', 'home',
  'restaurant', 'cafe', 'wine', 'pizza', 'ice-cream', 'gift', 'balloon',
  'trophy', 'medal', 'ribbon', 'flag', 'paw', 'fish', 'bug', 'leaf-outline',
  'flower-outline', 'heart-outline', 'happy', 'sad', 'thumbs-up', 'thumbs-down'
];

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
  disabled = false,
}) => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const { addCustomCategory, getAvailableCategories } = useHabitsStore();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  
  const availableCategories = getAvailableCategories();

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setShowCustomInput(false);
    setCustomCategory('');
  };

  const handleAddCustomCategory = () => {
    if (!customCategory.trim()) {
      Alert.alert(t('common.error'), t('categories.nameRequired'));
      return;
    }

    const trimmedCategory = customCategory.trim();
    addCustomCategory(trimmedCategory);
    onCategoryChange(trimmedCategory);
    setShowCustomInput(false);
    setCustomCategory('');
  };

  const handleCustomInputPress = () => {
    setShowCustomInput(true);
    setCustomCategory(selectedCategory);
  };

  const getCategoryIcon = (category: string) => {
    const predefined = predefinedCategories.find(cat => cat.key === category);
    if (predefined) return predefined.icon;
    
    // Для пользовательских категорий используем детерминированную случайную иконку
    // основанную на названии категории для консистентности
    const hash = category.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % customCategoryIcons.length;
    return customCategoryIcons[index];
  };

  const getCategoryColor = (category: string) => {
    const predefined = predefinedCategories.find(cat => cat.key === category);
    if (predefined) return predefined.color;
    
    // Для пользовательских категорий используем детерминированный случайный цвет
    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ec4899', '#06b6d4', '#6b7280'];
    const hash = category.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const isPredefined = predefinedCategories.some(cat => cat.key === selectedCategory);
  const isCustom = availableCategories.includes(selectedCategory) && !isPredefined;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        {t('categories.title')}
      </Text>
      
      {!showCustomInput ? (
        <View style={styles.selectorContainer}>
          {/* Предустановленные категории */}
          {predefinedCategories.map((category) => {
            const isSelected = selectedCategory === category.key;
            
            return (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: isSelected ? category.color : colors.surface,
                    borderColor: isSelected ? category.color : colors.border,
                  },
                  disabled && styles.disabled,
                ]}
                onPress={() => !disabled && handleCategorySelect(category.key)}
                disabled={disabled}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={category.icon as any}
                  size={16}
                  color={isSelected ? '#ffffff' : category.color}
                />
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: isSelected ? '#ffffff' : colors.text,
                    },
                  ]}
                >
                  {t(`categories.${category.key}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
          
          {/* Пользовательские категории */}
          {availableCategories
            .filter(cat => !predefinedCategories.some(pre => pre.key === cat))
            .map((category) => {
              const isSelected = selectedCategory === category;
              const categoryIcon = getCategoryIcon(category);
              const categoryColor = getCategoryColor(category);
              
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: isSelected ? categoryColor : colors.surface,
                      borderColor: isSelected ? categoryColor : colors.border,
                    },
                    disabled && styles.disabled,
                  ]}
                  onPress={() => !disabled && handleCategorySelect(category)}
                  disabled={disabled}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={categoryIcon as any}
                    size={16}
                    color={isSelected ? '#ffffff' : categoryColor}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color: isSelected ? '#ffffff' : colors.text,
                      },
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          
          {/* Кнопка добавления своей категории */}
          <TouchableOpacity
            style={[
              styles.addButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              disabled && styles.disabled,
            ]}
            onPress={() => !disabled && handleCustomInputPress()}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Ionicons
              name="add"
              size={16}
              color={colors.primary}
            />
            <Text
              style={[
                styles.addButtonText,
                { color: colors.primary },
              ]}
            >
              {t('categories.addCustom')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.customInputContainer}>
          <View style={styles.customInputRow}>
            <TextInput
              style={[
                styles.customInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={customCategory}
              onChangeText={setCustomCategory}
              placeholder={t('categories.customPlaceholder')}
              placeholderTextColor={colors.textTertiary}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: colors.primary }]}
              onPress={handleAddCustomCategory}
            >
              <Ionicons name="checkmark" size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => {
                setShowCustomInput(false);
                setCustomCategory('');
              }}
            >
              <Ionicons name="close" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  label: {
    ...typography.body,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  categoryText: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  addButtonText: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
  customInputContainer: {
    marginTop: spacing.xs,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  customInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    height: 48, // Фиксированная высота
    ...typography.body,
  },
  confirmButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    height: 48, // Соответствует высоте TextInput
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    height: 48, // Соответствует высоте TextInput
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
