import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorageAdapter } from '../../../shared/lib/mmkv';
import { useHabitsStore } from '../../habits/model/useHabitsStore';

export interface StatisticsState {
  // Данные о выполнении привычек
  habitCompletions: Record<string, {
    habitId: string;
    date: string; // YYYY-MM-DD
    completed: boolean;
  }[]>;
  
  // Методы
  markHabitCompleted: (habitId: string, date: string) => void;
  markHabitIncomplete: (habitId: string, date: string) => void;
  addTestData: () => void; // Новая функция для тестовых данных
  getHabitStats: (habitId: string) => {
    totalDays: number;
    completedDays: number;
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
  };
  getOverallStats: () => {
    totalHabits: number;
    activeHabits: number;
    totalCompletions: number;
    averageCompletionRate: number;
    currentStreak: number;
    longestStreak: number;
  };
}

export const useStatisticsStore = create<StatisticsState>()(
  persist(
    (set, get) => ({
      habitCompletions: {},
      
      markHabitCompleted: (habitId: string, date: string) => {
        const { habitCompletions } = get();
        const habitData = habitCompletions[habitId] || [];
        
        // Проверяем, есть ли уже запись на эту дату
        const existingIndex = habitData.findIndex(entry => entry.date === date);
        
        if (existingIndex >= 0) {
          // Обновляем существующую запись
          habitData[existingIndex].completed = true;
        } else {
          // Добавляем новую запись
          habitData.push({ habitId, date, completed: true });
        }
        
        set({
          habitCompletions: {
            ...habitCompletions,
            [habitId]: habitData,
          },
        });
      },
      
      markHabitIncomplete: (habitId: string, date: string) => {
        const { habitCompletions } = get();
        const habitData = habitCompletions[habitId] || [];
        
        const existingIndex = habitData.findIndex(entry => entry.date === date);
        
        if (existingIndex >= 0) {
          habitData[existingIndex].completed = false;
        } else {
          habitData.push({ habitId, date, completed: false });
        }
        
        set({
          habitCompletions: {
            ...habitCompletions,
            [habitId]: habitData,
          },
        });
      },
      
      addTestData: () => {
        const { habitCompletions } = get();
        const habits = useHabitsStore.getState().habits;
        
        if (habits.length === 0) return;
        
        const testData: Record<string, {
          habitId: string;
          date: string;
          completed: boolean;
        }[]> = {};
        
        // Генерируем данные за последние 30 дней
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          habits.forEach(habit => {
            if (!testData[habit.id]) {
              testData[habit.id] = [];
            }
            
            // Случайно определяем, выполнена ли привычка (80% вероятность)
            const completed = Math.random() > 0.2;
            
            testData[habit.id].push({
              habitId: habit.id,
              date: dateStr,
              completed,
            });
          });
        }
        
        set({ habitCompletions: testData });
      },
      
      getHabitStats: (habitId: string) => {
        const { habitCompletions } = get();
        const habitData = habitCompletions[habitId] || [];
        
        const totalDays = habitData.length;
        const completedDays = habitData.filter(entry => entry.completed).length;
        const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
        
        // Вычисляем текущую серию
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        
        // Сортируем по дате (новые сначала)
        const sortedData = [...habitData].sort((a, b) => b.date.localeCompare(a.date));
        
        for (const entry of sortedData) {
          if (entry.completed) {
            tempStreak++;
            if (currentStreak === 0) {
              currentStreak = tempStreak;
            }
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 0;
          }
        }
        
        return {
          totalDays,
          completedDays,
          currentStreak,
          longestStreak,
          completionRate,
        };
      },
      
      getOverallStats: () => {
        const habits = useHabitsStore.getState().habits;
        const { habitCompletions } = get();
        
        const activeHabits = habits.filter(habit => habit.isActive).length;
        const totalHabits = habits.length;
        
        let totalCompletions = 0;
        let totalDays = 0;
        let overallCurrentStreak = 0;
        let overallLongestStreak = 0;
        
        // Собираем все даты выполнения
        const allDates = new Set<string>();
        Object.values(habitCompletions).forEach(habitData => {
          habitData.forEach(entry => {
            allDates.add(entry.date);
            if (entry.completed) {
              totalCompletions++;
            }
            totalDays++;
          });
        });
        
        // Вычисляем общую статистику по дням
        const sortedDates = Array.from(allDates).sort().reverse();
        let tempStreak = 0;
        
        for (const date of sortedDates) {
          const dayCompletions = Object.values(habitCompletions)
            .flatMap(habitData => habitData.filter(entry => entry.date === date))
            .filter(entry => entry.completed);
          
          if (dayCompletions.length > 0) {
            tempStreak++;
            if (overallCurrentStreak === 0) {
              overallCurrentStreak = tempStreak;
            }
            overallLongestStreak = Math.max(overallLongestStreak, tempStreak);
          } else {
            tempStreak = 0;
          }
        }
        
        const averageCompletionRate = totalDays > 0 ? (totalCompletions / totalDays) * 100 : 0;
        
        return {
          totalHabits,
          activeHabits,
          totalCompletions,
          averageCompletionRate,
          currentStreak: overallCurrentStreak,
          longestStreak: overallLongestStreak,
        };
      },
    }),
    {
      name: 'statistics-store',
      storage: createJSONStorage(() => mmkvStorageAdapter),
      partialize: (state) => ({ habitCompletions: state.habitCompletions }),
    }
  )
);
