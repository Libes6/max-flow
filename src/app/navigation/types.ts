// Типы для навигации

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  Habits: undefined;
  Today: undefined;
  History: undefined;
  Statistics: undefined;
  Settings: undefined;
};

export type HabitsStackParamList = {
  HabitsList: undefined;
  HabitDetails: { habitId: string };
  CreateHabit: undefined;
  EditHabit: { habitId: string };
};

export type TodayStackParamList = {
  TodayHabits: undefined;
  QuickEntry: { habitId: string };
};

export type StatisticsStackParamList = {
  StatisticsOverview: undefined;
  HabitStatistics: { habitId: string };
  Achievements: undefined;
};

export type SettingsStackParamList = {
  UserProfile: undefined;
  Notifications: undefined;
  DataManagement: undefined;
  About: undefined;
};
