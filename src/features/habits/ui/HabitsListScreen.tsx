import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, spacing, typography, dimensions } from '../../../shared/theme';
import { Button } from '../../../shared/ui';
import { HabitCard } from './HabitCard';
import { useHabitsStore } from '../model/useHabitsStore';
import { AddHabitModal } from './AddHabitModal';
import { EditHabitModal } from './EditHabitModal';
import { Habit } from '../../../shared/types';

type HabitListItem = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  color: string;
};

export const HabitsListScreen: React.FC = () => {
  const { colors } = useTheme();
  const habits = useHabitsStore((s) => s.habits);
  const addHabit = useHabitsStore((s) => s.addHabit);
  const updateHabit = useHabitsStore((s) => s.updateHabit);
  const removeHabit = useHabitsStore((s) => s.removeHabit);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsEditOpen(true);
  };

  const handleDeleteHabit = (habitId: string) => {
    // Удаляем привычку без подтверждения
    removeHabit(habitId);
  };

  const handleUpdateHabit = (data: {
    name: string;
    description?: string;
    category?: string;
    color?: string;
  }) => {
    if (selectedHabit) {
      updateHabit(selectedHabit.id, data);
    }
  };

  const handleDeleteFromModal = () => {
    if (selectedHabit) {
      removeHabit(selectedHabit.id);
      setIsEditOpen(false);
      setSelectedHabit(null);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Мои привычки</Text>
        <Button
          title="Добавить"
          onPress={() => setIsAddOpen(true)}
          size="small"
        />
      </View>

      <FlatList
        data={habits as unknown as HabitListItem[]}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onEdit={() => handleEditHabit(item as Habit)}
            onDelete={() => handleDeleteHabit(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
      />

      <AddHabitModal
        visible={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(data) => addHabit(data)}
      />

      <EditHabitModal
        visible={isEditOpen}
        habit={selectedHabit}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedHabit(null);
        }}
        onSubmit={handleUpdateHabit}
        onDelete={handleDeleteFromModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
  },
  listContainer: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.xl + dimensions.androidBottomPadding,
  },
  flatList: {
    flexGrow: 1,
  },
});
