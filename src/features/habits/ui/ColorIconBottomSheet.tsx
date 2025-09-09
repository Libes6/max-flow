import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography } from '../../../shared/theme';

interface ColorIconBottomSheetProps {
  selectedColor: string;
  selectedIcon: string;
  onColorChange: (color: string) => void;
  onIconChange: (icon: string) => void;
  onClose: () => void;
}

const colorOptions = [
  { name: 'Синий', value: '#3B82F6' },
  { name: 'Зеленый', value: '#10B981' },
  { name: 'Желтый', value: '#F59E0B' },
  { name: 'Красный', value: '#EF4444' },
  { name: 'Фиолетовый', value: '#8B5CF6' },
  { name: 'Розовый', value: '#FF6B6B' },
  { name: 'Бирюзовый', value: '#4ECDC4' },
  { name: 'Голубой', value: '#45B7D1' },
  { name: 'Мятный', value: '#96CEB4' },
  { name: 'Оранжевый', value: '#FF8C42' },
  { name: 'Серый', value: '#6B7280' },
  { name: 'Черный', value: '#374151' },
];

const iconOptions = [
  'fitness',
  'book',
  'heart',
  'star',
  'bulb',
  'musical-notes',
  'game-controller',
  'car',
  'home',
  'briefcase',
  'school',
  'restaurant',
  'bed',
  'walk',
  'bicycle',
  'basketball',
  'football',
  'tennisball',
  'water',
  'leaf',
  'flame',
  'snow',
  'sunny',
  'moon',
  'partly-sunny',
  'thunderstorm',
  'rainy',
  'cloudy',
  'eye',
  'ear',
  'hand-left',
  'hand-right',
  'footsteps',
  'paw',
  'fish',
  'bug',
  'flower',
  'tree',
  'cafe',
  'wine',
  'pizza',
  'ice-cream',
  'gift',
  'ribbon',
  'trophy',
  'medal',
  'diamond',
  'sparkles',
  'flash',
  'thunder',
];

export const ColorIconBottomSheet: React.FC<ColorIconBottomSheetProps> = ({
  selectedColor,
  selectedIcon,
  onColorChange,
  onIconChange,
  onClose,
}) => {
  const { colors } = useTheme();

  return (
    <ScrollView 
      style={styles.scrollView} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
        {/* Цвета */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Цвет</Text>
          <View style={styles.colorGrid}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.value },
                  selectedColor === color.value && styles.selectedColor,
                ]}
                onPress={() => onColorChange(color.value)}
              >
                {selectedColor === color.value && (
                  <Ionicons name="checkmark" size={20} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Иконки */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Иконка</Text>
          <View style={styles.iconGrid}>
            {iconOptions.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: selectedIcon === icon ? selectedColor : colors.border,
                  },
                  selectedIcon === icon && styles.selectedIcon,
                ]}
                onPress={() => onIconChange(icon)}
              >
                <Ionicons 
                  name={icon as any} 
                  size={28} 
                  color={selectedIcon === icon ? selectedColor : colors.textSecondary} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    minHeight: 600,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h3,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000',
    transform: [{ scale: 1.1 }],
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  iconOption: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  selectedIcon: {
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
});
