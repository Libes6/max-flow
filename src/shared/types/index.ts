// Базовые типы для приложения

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  createdAt: Date;
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: 'ru' | 'en' | 'uk' | 'kk';
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target?: number;
  unit?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Entry {
  id: string;
  habitId: string;
  userId: string;
  date: Date;
  value?: number;
  notes?: string;
  mood?: 1 | 2 | 3 | 4 | 5;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  sortOrder: number;
}

export interface Reminder {
  id: string;
  habitId: string;
  userId: string;
  time: string; // HH:mm
  days: number[]; // 0-6 (воскресенье-суббота)
  isActive: boolean;
  message: string;
}

export interface Streak {
  id: string;
  habitId: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: Date;
  updatedAt: Date;
}
