import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { colors } from '../../../shared/theme';
import type { Habit } from '../../../shared/types';
import { mmkvStorageAdapter } from '../../../shared/lib/mmkv';
import { generateUUID } from '../../../shared/lib/uuid';

export interface HabitsState {
    habits: Habit[];
    currentUserId: string;
    setUserId: (userId: string) => void;
    addHabit: (input: {
        name: string;
        description?: string;
        category?: string;
        color?: string;
        icon?: string;
    }) => void;
    updateHabit: (habitId: string, input: {
        name?: string;
        description?: string;
        category?: string;
        color?: string;
        icon?: string;
        isActive?: boolean;
    }) => void;
    removeHabit: (habitId: string) => void;
    clearHabits: () => void;
}

export const useHabitsStore = create<HabitsState>()(
    persist(
        (set, get) => ({
            habits: [],
            currentUserId: 'local',
            setUserId: (userId: string) => {
                set({ currentUserId: userId });
            },
            addHabit: ({ name, description, category, color, icon }) => {
                const { currentUserId } = get();
                const newHabit: Habit = {
                    id: generateUUID(),
                    userId: currentUserId,
                    name: name.trim(),
                    description: description?.trim(),
                    category: category?.trim() || 'Общее',
                    icon: icon || 'list',
                    color: color || colors.primary,
                    frequency: 'daily',
                    target: undefined,
                    unit: undefined,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                set({ habits: [newHabit, ...get().habits] });
            },
            updateHabit: (habitId: string, input) => {
                const { habits } = get();
                const habitIndex = habits.findIndex(h => h.id === habitId);

                if (habitIndex === -1) return;

                const updatedHabits = [...habits];
                const currentHabit = updatedHabits[habitIndex];
                updatedHabits[habitIndex] = {
                    ...currentHabit,
                    ...input,
                    updatedAt: new Date(),
                };

                set({ habits: updatedHabits });
            },
            removeHabit: (habitId: string) => {
                const { habits } = get();
                const habitToRemove = habits.find(h => h.id === habitId);
                
                if (habitToRemove) {
                    // Добавляем операцию удаления в очередь синхронизации
                    // TODO: Интегрировать с useSync
                }
                
                set({ habits: habits.filter((h) => h.id !== habitId) });
            },
            clearHabits: () => {
                set({ habits: [] });
            },
        }),
        {
            name: 'habits-store',
            storage: createJSONStorage(() => mmkvStorageAdapter),
            partialize: (state) => ({ 
                habits: state.habits,
                currentUserId: state.currentUserId 
            }),
        }
    )
);
