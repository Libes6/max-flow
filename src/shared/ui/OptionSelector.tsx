import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { spacing, typography } from '../theme';
import { useLocalBottomSheet } from '../lib';
import { BottomSheet } from './index';

export interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

interface OptionSelectorProps {
  title: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  trigger: React.ReactNode;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
  trigger,
}) => {
  const { colors } = useTheme();
  const {
    isVisible,
    title: bottomSheetTitle,
    content,
    bottomSheetRef,
    openBottomSheet,
    closeBottomSheet,
    handleClose,
  } = useLocalBottomSheet();

  const handleSelect = (value: string) => {
    console.log('OptionSelector: handleSelect called with value:', value);
    
    // Сначала вызываем onSelect, потом закрываем BottomSheet
    try {
      onSelect(value);
    } catch (error) {
      console.error('OptionSelector: error in onSelect:', error);
    }
    
    // Закрываем глобальный BottomSheet
    closeBottomSheet();
  };

  const selectedOption = options.find(option => option.value === selectedValue);

  const renderOption = ({ item }: { item: Option }) => (
    <Pressable
      style={[
        styles.optionItem,
        { backgroundColor: colors.surface },
        item.value === selectedValue && {
          borderColor: colors.primary,
          borderWidth: 2,
        },
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <View style={styles.optionContent}>
        {item.icon && (
          <View style={styles.optionIcon}>
            <Ionicons
              name={item.icon as any}
              size={24}
              color={item.value === selectedValue ? colors.primary : colors.textSecondary}
            />
          </View>
        )}
        <View style={styles.optionText}>
          <Text style={[styles.optionLabel, { color: colors.text }]}>
            {item.label}
          </Text>
          {item.description && (
            <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
              {item.description}
            </Text>
          )}
        </View>
      </View>

      {item.value === selectedValue && (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={colors.primary}
        />
      )}
    </Pressable>
  );

  const openSelector = () => {
    console.log('OptionSelector: openSelector called');
    
    const content = (
      <FlatList
        data={options}
        renderItem={renderOption}
        keyExtractor={(item) => item.value}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.optionsList}
      />
    );
    
    console.log('OptionSelector: calling openBottomSheet with title:', title);
    openBottomSheet(title, content);
  };

  return (
    <>
    {isVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          title={bottomSheetTitle}
          height="auto"
          onClose={handleClose}
        >
          {content}
        </BottomSheet>
      )}
      <TouchableOpacity
        style={styles.trigger}
        onPress={openSelector}
      >
        {trigger}
      </TouchableOpacity>

      
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flex: 1,
  },
  optionsList: {
    paddingBottom: spacing.lg,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  optionDescription: {
    ...typography.caption,
  },
});
