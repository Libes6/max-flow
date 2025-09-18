import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabNavigator } from './MainTabNavigator';
import { SplashScreen, AuthChoiceScreen, LoginScreen, RegisterScreen } from '../../features';
import { EditProfileScreen } from '../../features/profile/ui/EditProfileScreen';
import { NotificationSettingsScreen, NotificationTestScreen } from '../../features/settings';
import { colors } from '../../shared/theme';
import { useAuth } from '../../features/auth/model/useAuth';
import { useNavigationContext } from '../providers/NavigationProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { user, isLoading } = useAuth();
  const { isGuestMode, setGuestMode } = useNavigationContext();

  // Сбрасываем гостевой режим при успешной авторизации
  React.useEffect(() => {
    if (user && isGuestMode) {
      setGuestMode(false);
    }
  }, [user, isGuestMode, setGuestMode]);

  const handleSplashFinish = () => {
    setIsSplashVisible(false);
  };

  if (isSplashVisible) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Показываем загрузку пока проверяем авторизацию
  if (isLoading) {
    return <SplashScreen onFinish={() => {}} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {user ? (
          // Пользователь авторизован - показываем основные экраны
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
            <Stack.Screen name="NotificationTest" component={NotificationTestScreen} />
          </>
        ) : isGuestMode ? (
          // Гостевой режим - показываем основные экраны без авторизации
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
            <Stack.Screen name="NotificationTest" component={NotificationTestScreen} />
          </>
        ) : (
          // Пользователь не авторизован - показываем экраны авторизации
          <>
            <Stack.Screen name="Auth" component={AuthChoiceScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
