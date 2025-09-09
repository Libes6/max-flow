import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, spacing, typography } from '../theme';

interface SettingActionItemProps {
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  rightComponent?: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
}

export const SettingActionItem: React.FC<SettingActionItemProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  disabled = false,
  loading = false,
  rightComponent,
  badge,
  badgeColor,
}) => {
  const { colors } = useTheme();

  const getRightComponent = () => {
    if (rightComponent) {
      return rightComponent;
    }

    if (loading) {
      return (
        <Ionicons 
          name="sync" 
          size={20} 
          color={colors.primary} 
          style={styles.loadingIcon}
        />
      );
    }

    if (badge) {
      return (
        <View style={[
          styles.badge,
          { backgroundColor: badgeColor || colors.primary }
        ]}>
          <Text style={[styles.badgeText, { color: colors.surface }]}>
            {badge}
          </Text>
        </View>
      );
    }

    return (
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={colors.textTertiary} 
      />
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        { 
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          opacity: disabled ? 0.6 : 1,
        }
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <View style={styles.settingIcon}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={disabled ? colors.textTertiary : colors.textSecondary} 
        />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingTitle,
          { color: disabled ? colors.textTertiary : colors.text }
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[
            styles.settingSubtitle,
            { color: colors.textSecondary }
          ]}>
            {subtitle}
          </Text>
        )}
      </View>

      {getRightComponent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    ...typography.caption,
  },
  loadingIcon: {
    // Анимация вращения будет добавлена позже
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
});
