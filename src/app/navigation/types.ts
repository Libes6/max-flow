// Типы для навигации

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  EditProfile: undefined;
  NotificationSettings: undefined;
  NotificationTest: undefined;
};

export type MainTabParamList = {
  Habits: undefined;
  Today: undefined;
  History: undefined;
  Statistics: undefined;
  Profile: undefined;
};

export type HabitsStackParamList = {
  HabitsList: undefined;
  HabitDetails: { habitId: string };
  CreateHabit: undefined;
  EditHabit: { habitId: string };
  ColorIcon: { 
    selectedColor: string; 
    selectedIcon: string;
    onColorChange: (color: string) => void;
    onIconChange: (icon: string) => void;
  };
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

export type ProfileStackParamList = {
  UserProfile: undefined;
  EditProfile: undefined;
  DataManagement: undefined;
  About: undefined;
  NotificationSettings: undefined;
  NotificationTest: undefined;
};
