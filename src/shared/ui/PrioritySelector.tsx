import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, spacing, typography } from '../theme';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type Priority = 'low' | 'medium' | 'high';

interface PrioritySelectorProps {
  selectedPriority: Priority;
  onPriorityChange: (priority: Priority) => void;
  disabled?: boolean;
}

const priorityConfig = {
  low: {
    label: 'priority.low',
    icon: 'chevron-down' as const,
    color: '#10b981', // green
  },
  medium: {
    label: 'priority.medium',
    icon: 'remove' as const,
    color: '#f59e0b', // amber
  },
  high: {
    label: 'priority.high',
    icon: 'chevron-up' as const,
    color: '#ef4444', // red
  },
};

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  selectedPriority,
  onPriorityChange,
  disabled = false,
}) => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();

  const priorities: Priority[] = ['low', 'medium', 'high'];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>
        {t('priority.title')}
      </Text>
      <View style={styles.selectorContainer}>
        {priorities.map((priority) => {
          const config = priorityConfig[priority];
          const isSelected = selectedPriority === priority;
          
          return (
            <TouchableOpacity
              key={priority}
              style={[
                styles.priorityButton,
                {
                  backgroundColor: isSelected ? config.color : colors.surface,
                  borderColor: isSelected ? config.color : colors.border,
                },
                disabled && styles.disabled,
              ]}
              onPress={() => !disabled && onPriorityChange(priority)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Ionicons
                name={config.icon}
                size={16}
                color={isSelected ? '#ffffff' : config.color}
              />
              <Text
                style={[
                  styles.priorityText,
                  {
                    color: isSelected ? '#ffffff' : colors.text,
                  },
                ]}
              >
                {t(config.label)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
    gap: spacing.xs,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.xs,
  },
  priorityText: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});
