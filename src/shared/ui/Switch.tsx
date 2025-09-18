import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, spacing, typography } from '../theme';

interface SwitchProps {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  subtitle,
  value,
  onValueChange,
  disabled = false,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            {label}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
        
        <TouchableOpacity
          onPress={() => !disabled && onValueChange(!value)}
          disabled={disabled}
          style={[
            styles.switch,
            {
              backgroundColor: value ? colors.primary : colors.border,
              opacity: disabled ? 0.5 : 1,
            }
          ]}
        >
          <View
            style={[
              styles.thumb,
              {
                backgroundColor: colors.background,
                transform: [{ translateX: value ? 20 : 2 }],
              }
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    ...typography.body,
    fontWeight: '500',
  },
  subtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
});
