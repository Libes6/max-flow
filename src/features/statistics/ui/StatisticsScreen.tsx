import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography, dimensions } from '../../../shared/theme';
import { useHabitsStore } from '../../habits/model/useHabitsStore';
import { useStatisticsStore } from '../model/useStatisticsStore';

const StatCard: React.FC<{
  number: string | number;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}> = ({ number, label, icon, color = colors.primary }) => (
  <View style={styles.statCard}>
    {icon && (
      <Ionicons 
        name={icon} 
        size={24} 
        color={color} 
        style={styles.statIcon}
      />
    )}
    <Text style={[styles.statNumber, { color }]}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const HabitStatCard: React.FC<{
  habit: any;
  stats: {
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
  };
}> = ({ habit, stats }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.habitStatCard}>
      <View style={styles.habitStatHeader}>
        <View style={[styles.habitStatIcon, { backgroundColor: habit.color }]}>
          <Text style={styles.habitStatIconText}>
            {habit.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.habitStatInfo}>
          <Text style={styles.habitStatName}>{habit.name}</Text>
          <Text style={styles.habitStatCategory}>{habit.category}</Text>
        </View>
      </View>
      
      <View style={styles.habitStatMetrics}>
        <View style={styles.habitStatMetric}>
          <Text style={styles.habitStatMetricNumber}>🔥 {stats.currentStreak}</Text>
          <Text style={styles.habitStatMetricLabel}>{t('statistics.streak')}</Text>
        </View>
        
        <View style={styles.habitStatMetric}>
          <Text style={styles.habitStatMetricNumber}>🏆 {stats.longestStreak}</Text>
          <Text style={styles.habitStatMetricLabel}>{t('statistics.streak')}</Text>
        </View>
        
        <View style={styles.habitStatMetric}>
          <Text style={styles.habitStatMetricNumber}>{Math.round(stats.completionRate)}%</Text>
          <Text style={styles.habitStatMetricLabel}>{t('statistics.completionRate')}</Text>
        </View>
      </View>
    </View>
  );
};

export const StatisticsScreen: React.FC = () => {
  const { t } = useTranslation();
  const habits = useHabitsStore((s) => s.habits);
  const { getOverallStats, getHabitStats, addTestData } = useStatisticsStore();
  
  const overallStats = getOverallStats();
  const habitStats = habits.map(habit => ({
    habit,
    stats: getHabitStats(habit.id),
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('statistics.title')}</Text>
        <Text style={styles.subtitle}>{t('statistics.overview')}</Text>
        <TouchableOpacity 
          style={styles.testDataButton}
          onPress={addTestData}
        >
          <Text style={styles.testDataButtonText}>Добавить тестовые данные</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={habitStats}
        keyExtractor={(item) => item.habit.id}
        renderItem={({ item }) => (
          <HabitStatCard
            habit={item.habit}
            stats={item.stats}
          />
        )}
        ListHeaderComponent={() => (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Общая статистика</Text>
              
              <View style={styles.statsGrid}>
                <StatCard
                  number={overallStats.activeHabits}
                  label="Активные привычки"
                  icon="list-outline"
                  color={colors.primary}
                />
                
                <StatCard
                  number={overallStats.currentStreak}
                  label="Дней подряд"
                  icon="flame-outline"
                  color={colors.warning}
                />
                
                <StatCard
                  number={`${Math.round(overallStats.averageCompletionRate)}%`}
                  label="Выполнение"
                  icon="checkmark-circle-outline"
                  color={colors.success}
                />
                
                <StatCard
                  number={overallStats.totalCompletions}
                  label="Всего выполнено"
                  icon="trophy-outline"
                  color={colors.info}
                />
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Статистика привычек</Text>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons 
              name="bar-chart-outline" 
              size={64} 
              color={colors.textTertiary} 
            />
            <Text style={styles.emptyStateText}>
              Данные появятся после добавления привычек
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Отмечайте выполнение привычек, чтобы видеть статистику
            </Text>
          </View>
        )}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.content}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.xl + dimensions.androidBottomPadding,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    marginBottom: spacing.sm,
  },
  statNumber: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  habitStatCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  habitStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  habitStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  habitStatIconText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  habitStatInfo: {
    flex: 1,
  },
  habitStatName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  habitStatCategory: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  habitStatMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitStatMetric: {
    alignItems: 'center',
    flex: 1,
  },
  habitStatMetricNumber: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  habitStatMetricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    ...typography.h3,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  testDataButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  testDataButtonText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '500',
  },
});
