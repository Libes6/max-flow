import { useMemo } from 'react';
import { useTheme, dimensions } from '../../theme';
import { useNavigationType } from './useNavigationType';
import { TAB_BAR_CONSTANTS } from '../constants/tabBarConstants';

export const useTabBarStyles = () => {
  const { colors } = useTheme();
  const { isGestureNavigation, isIOS, bottomInset } = useNavigationType();

  const tabBarStyles = useMemo(() => {
    // Вычисляем отступы и высоту
    const getPaddingBottom = () => {
      if (isIOS) {
        return bottomInset;
      }
      return isGestureNavigation ? 5 : bottomInset + 5;
    };

    const getHeight = () => {
      if (isIOS) {
        return dimensions.tabBarHeight + bottomInset;
      }
      return isGestureNavigation 
        ? dimensions.tabBarHeight 
        : dimensions.tabBarHeight + bottomInset;
    };

    return {
      backgroundColor: colors.surface,
      paddingBottom: getPaddingBottom(),
      height: getHeight(),
      borderTopWidth: TAB_BAR_CONSTANTS.BORDER_TOP_WIDTH,
      elevation: TAB_BAR_CONSTANTS.ELEVATION,
      shadowColor: colors.primary,
      shadowOffset: TAB_BAR_CONSTANTS.SHADOW_OFFSET,
      shadowOpacity: TAB_BAR_CONSTANTS.SHADOW_OPACITY,
      shadowRadius: TAB_BAR_CONSTANTS.SHADOW_RADIUS,
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }, [colors, isGestureNavigation, isIOS, bottomInset]);

  return tabBarStyles;
};
