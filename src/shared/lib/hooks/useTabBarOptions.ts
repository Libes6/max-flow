import { useMemo } from 'react';
import { useTheme } from '../../theme';
import { useTabBarStyles } from './useTabBarStyles';
import { TAB_BAR_CONSTANTS } from '../constants/tabBarConstants';

export const useTabBarOptions = () => {
  const { colors } = useTheme();
  const tabBarStyle = useTabBarStyles();

  return useMemo(() => ({
    headerShown: false,
    tabBarStyle,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarLabelStyle: {
      fontSize: TAB_BAR_CONSTANTS.LABEL_FONT_SIZE,
      fontWeight: TAB_BAR_CONSTANTS.LABEL_FONT_WEIGHT,
    },
    tabBarIconStyle: {
      marginTop: TAB_BAR_CONSTANTS.ICON_MARGIN_TOP,
    },
  }), [colors, tabBarStyle]);
};
