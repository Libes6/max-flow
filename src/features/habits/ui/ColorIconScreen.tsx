import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { HabitsStackParamList } from '../../../app/navigation/types';
import { useTheme, spacing, typography } from '../../../shared/theme';
import { Button } from '../../../shared/ui/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  'fitness', 'book', 'heart', 'star', 'bulb', 'musical-notes',
  'game-controller', 'car', 'home', 'briefcase', 'school', 'restaurant',
  'bed', 'walk', 'bicycle', 'basketball', 'football', 'tennisball',
  'water', 'leaf', 'flame', 'snow', 'sunny', 'moon', 'partly-sunny',
  'thunderstorm', 'rainy', 'cloudy', 'eye', 'ear', 'hand-left', 'hand-right',
  'footsteps', 'paw', 'fish', 'bug', 'flower', 'tree', 'cafe', 'wine',
  'pizza', 'ice-cream', 'gift', 'ribbon', 'trophy', 'medal', 'diamond',
  'sparkles', 'flash', 'thunder',
];

export const ColorIconScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [selectedColor, setSelectedColor] = useState(route.params.selectedColor);
  const [selectedIcon, setSelectedIcon] = useState(route.params.selectedIcon);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    route.params.onColorChange(color);
  };

  const handleIconChange = (icon: string) => {
    setSelectedIcon(icon);
    route.params.onIconChange(icon);
  };

  const handleDone = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Цвета */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('habits.color')}</Text>
          <View style={styles.colorGrid}>
            {colorOptions.map((color) => (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.value },
                  selectedColor === color.value && styles.selectedColor,
                ]}
                onPress={() => handleColorChange(color.value)}
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('habits.icon')}</Text>
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
                onPress={() => handleIconChange(icon)}
              >
                <Ionicons 
                  name={icon as any} 
                  size={24} 
                  color={selectedIcon === icon ? selectedColor : colors.textSecondary} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={[styles.footer]}>
         <Button
          title={t('habits.done')}
          onPress={handleDone}
          style={styles.doneButton}
        />
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
    paddingBottom: spacing.xl,
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
    gap: 14,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  selectedIcon: {
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginBottom: spacing.xxl * 2,
  },
  doneButton: {
    width: '100%',
  },
});
