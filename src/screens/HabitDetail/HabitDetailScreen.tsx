import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '@/theme';
import HeatmapRow from '@/components/HeatmapRow/HeatmapRow';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';
import * as completionService from '@/services/completionService';
import { Completion } from '@/types/completion';
import { format, subDays } from 'date-fns';

const HabitDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { habitId } = (route.params as any) || { habitId: 'unknown' };
  const { habits } = useStore();
  const { user } = useAuthStore();

  const [habitCompletions, setHabitCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);

  const habit = habits.find((h) => h.id === habitId);

  // Fetch completions for this habit
  useEffect(() => {
    if (!user?.uid || !habitId) return;
    const fetchCompletions = async () => {
      try {
        const data = await completionService.getCompletionsForHabit(user.uid, habitId, 365);
        setHabitCompletions(data);
      } catch (error) {
        console.error('[HabitDetail] fetch completions error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletions();
  }, [user?.uid, habitId]);

  // Build heatmap data from completions
  const heatmapData = useMemo(() => {
    const dateMap: Record<string, number> = {};
    habitCompletions.forEach((c) => {
      const dateStr = format(new Date(c.completedAt), 'yyyy-MM-dd');
      dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
    });

    return Array.from({ length: 90 }).map((_, i) => ({
      date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
      count: dateMap[format(subDays(new Date(), i), 'yyyy-MM-dd')] || 0,
    }));
  }, [habitCompletions]);

  // Compute streak
  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const dateStr = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const hasCompletion = habitCompletions.some(
        (c) => format(new Date(c.completedAt), 'yyyy-MM-dd') === dateStr,
      );
      if (hasCompletion) {
        streak++;
      } else if (i > 0) {
        // Skip today if not completed yet
        break;
      }
    }
    return streak;
  }, [habitCompletions]);

  // Recent completions for the list
  const recentCompletions = habitCompletions.slice(0, 5);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Habit Detail</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.habitInfoCard}>
          <MaterialCommunityIcons 
            name={habit?.iconName || habit?.icon || 'star-outline'} 
            size={48} 
            color={theme.colors.primary} 
          />
          <Text style={styles.habitName}>{habit?.name || 'Unknown Habit'}</Text>
          <Text style={styles.habitStreak}>
            {currentStreak > 0 ? `Current Streak: ${currentStreak} Days 🔥` : 'No streak yet'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Completion History</Text>
        <View style={styles.chartContainer}>
          <HeatmapRow data={heatmapData} weeks={12} baseColor={theme.colors.primary} />
        </View>

        <Text style={styles.sectionTitle}>Recent Completions</Text>
        <View style={styles.completionList}>
          {recentCompletions.length > 0 ? (
            recentCompletions.map((c) => (
              <View key={c.id} style={styles.completionItem}>
                <Text style={styles.completionDate}>
                  {format(new Date(c.completedAt), 'MMM d, h:mm a')}
                </Text>
                {c.memo ? (
                  <Text style={styles.completionMemo}>"{c.memo}"</Text>
                ) : c.value ? (
                  <Text style={styles.completionMemo}>
                    {c.value} {habit?.targetUnit || 'completed'}
                  </Text>
                ) : null}
              </View>
            ))
          ) : (
            <View style={styles.completionItem}>
              <Text style={styles.completionDate}>No completions yet</Text>
              <Text style={styles.completionMemo}>Complete this habit to see your history!</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onBackground,
  },
  content: {
    flex: 1,
    padding: theme.spacing.containerPadding,
  },
  habitInfoCard: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  habitName: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  habitStreak: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.onSurfaceVariant,
  },
  sectionTitle: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  completionList: {
    flex: 1,
  },
  completionItem: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  completionDate: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  completionMemo: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.onSurface,
    fontStyle: 'italic',
  },
});

export default HabitDetailScreen;
