import { useEffect } from 'react';
import { useHabitsStore } from '../model/useHabitsStore';
import { useAuth } from '../../auth/model/useAuth';
import { generateUUID } from '../../../shared/lib/uuid';
import { colors } from '../../../shared/theme';
import type { Habit } from '../../../shared/types';

export const useHabitsSync = () => {
  const { habits, addHabit, updateHabit, removeHabit, setUserId } = useHabitsStore();
  const { user } = useAuth();

  // Установка userId при авторизации
  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user, setUserId]);

  // Функция для добавления привычки
  const addHabitWithSync = (input: {
    name: string;
    description?: string;
    category?: string;
    color?: string;
  }) => {
    console.log('Добавление новой привычки:', input);
    
    // Генерируем UUID заранее
    const newHabitId = generateUUID();
    
    // Создаем привычку с правильным ID
    const newHabit: Habit = {
      id: newHabitId,
      userId: user?.id || 'local',
      name: input.name.trim(),
      description: input.description?.trim(),
      category: input.category?.trim() || 'Общее',
      icon: 'list',
      color: input.color || colors.primary,
      frequency: 'daily',
      target: undefined,
      unit: undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Добавляем привычку напрямую в store
    const { habits: currentHabits } = useHabitsStore.getState();
    useHabitsStore.setState({ 
      habits: [...currentHabits, newHabit] 
    });
    
    console.log('Привычка добавлена с ID:', newHabitId);
  };

  // Функция для обновления привычки
  const updateHabitWithSync = (habitId: string, input: {
    name?: string;
    description?: string;
    category?: string;
    color?: string;
    isActive?: boolean;
  }) => {
    console.log('🔄 Обновление привычки:', habitId, input);
    
    // Обновляем данные привычки
    updateHabit(habitId, input);
    
    console.log('✅ Привычка обновлена');
  };

  // Функция для удаления привычки
  const removeHabitWithSync = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    
    if (!habit) {
      console.error('Привычка не найдена для удаления');
      return;
    }

    console.log('Удаление привычки:', habitId);
    
    // Удаляем локально
    removeHabit(habitId);
  };

  return {
    habits,
    addHabit: addHabitWithSync,
    updateHabit: updateHabitWithSync,
    removeHabit: removeHabitWithSync,
  };
};