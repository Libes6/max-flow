import { useMemo } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useNavigationType = () => {
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const isGestureNavigation = Platform.OS === 'android' && insets.bottom === 0;
    const isButtonNavigation = Platform.OS === 'android' && insets.bottom > 0;
    const isIOS = Platform.OS === 'ios';

    return {
      isGestureNavigation,
      isButtonNavigation,
      isIOS,
      bottomInset: insets.bottom,
    };
  }, [insets.bottom]);
};
