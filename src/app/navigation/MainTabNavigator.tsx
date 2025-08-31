import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { colors, dimensions } from '../../shared/theme';

// Импорт экранов
import { HabitsListScreen } from '../../features/habits/ui/HabitsListScreen';
import { TodayScreen } from '../../features/today/ui/TodayScreen';
import { HistoryScreen } from '../../features/history/ui/HistoryScreen';
import { StatisticsScreen } from '../../features/statistics/ui/StatisticsScreen';
import { SettingsScreen } from '../../features/settings/ui/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const tabBarStyle = {
    backgroundColor: colors.surface,
    paddingBottom: Platform.OS === 'ios' ? dimensions.tabBarPaddingBottom : dimensions.tabBarPaddingBottom,
    height: Platform.OS === 'ios' ? dimensions.tabBarHeight : dimensions.tabBarHeight + dimensions.tabBarPaddingBottom,
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
        component={HabitsListScreen}
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
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('navigation.settings'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
