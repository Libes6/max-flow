import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { HabitsStackParamList } from './types';
import { useTheme } from '../../shared/theme';

// Импорт экранов привычек
import { HabitsListScreen } from '../../features/habits/ui/HabitsListScreen';
import { AddHabitScreen } from '../../features/habits/ui/AddHabitScreen';
import { EditHabitScreen } from '../../features/habits/ui/EditHabitScreen';
import { ColorIconScreen } from '../../features/habits/ui/ColorIconScreen';

const Stack = createStackNavigator<HabitsStackParamList>();

export const HabitsStackNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="HabitsList"
        component={HabitsListScreen}
        options={{
          title: t('navigation.habits'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateHabit"
        component={AddHabitScreen}
        options={{
          title: t('habits.createHabit'),
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="EditHabit"
        component={EditHabitScreen}
        options={{
          title: t('habits.editHabit'),
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="ColorIcon"
        component={ColorIconScreen}
        options={{
          title: t('habits.colorAndIcon'),
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
