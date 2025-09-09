import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { useTheme, dimensions } from '../../shared/theme';

// Импорт экранов из фич
import {
  TodayScreen,
  HistoryScreen,
  StatisticsScreen,
  ProfileScreen,
} from '../../features';

// Импорт стеков навигации
import { HabitsStackNavigator } from './HabitsStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Определяем тип навигации на Android
  const isGestureNavigation = Platform.OS === 'android' && insets.bottom === 0;
  const isButtonNavigation = Platform.OS === 'android' && insets.bottom > 0;

  const tabBarStyle = {
    backgroundColor: colors.surface,
    paddingBottom: Platform.OS === 'ios' 
      ? insets.bottom 
      : isGestureNavigation 
        ? 0 
        : insets.bottom,
    height: Platform.OS === 'ios' 
      ? dimensions.tabBarHeight + insets.bottom
      : isGestureNavigation 
        ? dimensions.tabBarHeight
        : dimensions.tabBarHeight + insets.bottom,
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Habits"
        component={HabitsStackNavigator}
        options={{
          tabBarLabel: t('navigation.habits'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarLabel: t('navigation.today'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: t('navigation.history'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarLabel: t('navigation.statistics'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t('navigation.profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
