import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { colors } from '../../../shared/theme';
import type { Habit } from '../../../shared/types';
import { mmkvStorageAdapter } from '../../../shared/lib/mmkv';

export interface HabitsState {
    habits: Habit[];
    addHabit: (input: {
        name: string;
        description?: string;
        category?: string;
        color?: string;
    }) => void;
    updateHabit: (habitId: string, input: {
        name?: string;
        description?: string;
        category?: string;
        color?: string;
        isActive?: boolean;
    }) => void;
    removeHabit: (habitId: string) => void;
    clearHabits: () => void;
}

export const useHabitsStore = create<HabitsState>()(
    persist(
        (set, get) => ({
            habits: [
                {
                    id: '1',
                    userId: 'local',
                    name: 'Утренняя зарядка',
                    description: '15 минут упражнений',
                    category: 'Здоровье',
                    icon: 'list',
                    color: colors.primary,
                    frequency: 'daily',
                    target: undefined,
                    unit: undefined,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: '2',
                    userId: 'local',
                    name: 'Чтение',
                    description: '30 минут в день',
                    category: 'Обучение',
                    icon: 'book',
                    color: colors.success,
                    frequency: 'daily',
                    target: undefined,
                    unit: undefined,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            addHabit: ({ name, description, category, color }) => {
                const newHabit: Habit = {
                    id: Date.now().toString(),
                    userId: 'local',
                    name: name.trim(),
                    description: description?.trim(),
                    category: category?.trim() || 'Общее',
                    icon: 'list',
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
                updatedHabits[habitIndex] = {
                    ...updatedHabits[habitIndex],
                    ...input,
                    updatedAt: new Date(),
                };

                set({ habits: updatedHabits });
            },
            removeHabit: (habitId: string) => {
                set({ habits: get().habits.filter((h) => h.id !== habitId) });
            },
            clearHabits: () => {
                set({ habits: [] });
            },
        }),
        {
            name: 'habits-store',
            storage: createJSONStorage(() => mmkvStorageAdapter),
            partialize: (state) => ({ habits: state.habits }),
        }
    )
);
