import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme, useTheme } from '@/theme';
import HeatmapRow from '@/components/HeatmapRow/HeatmapRow';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';
import * as completionService from '@/services/completionService';
import { Completion } from '@/types/completion';
import { format, subDays } from 'date-fns';

const HabitDetailScreen = () => {
  const { colors } = useTheme();
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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.outlineVariant }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.onBackground }]}>Habit Detail</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.habitInfoCard, { backgroundColor: colors.surfaceVariant }]}>
          <MaterialCommunityIcons 
            name={habit?.iconName || habit?.icon || 'star-outline'} 
            size={48} 
            color={colors.primary} 
          />
          <Text style={[styles.habitName, { color: colors.onSurface }]}>{habit?.name || 'Unknown Habit'}</Text>
          <Text style={[styles.habitStreak, { color: colors.onSurfaceVariant }]}>
            {currentStreak > 0 ? `Current Streak: ${currentStreak} Days 🔥` : 'No streak yet'}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Completion History</Text>
        <View style={[styles.chartContainer, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
          <HeatmapRow data={heatmapData} weeks={12} baseColor={colors.primary} />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Recent Completions</Text>
        <View style={styles.completionList}>
          {recentCompletions.length > 0 ? (
            recentCompletions.map((c) => (
              <View key={c.id} style={[styles.completionItem, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
                <Text style={[styles.completionDate, { color: colors.onSurfaceVariant }]}>
                  {format(new Date(c.completedAt), 'MMM d, h:mm a')}
                </Text>
                {c.memo ? (
                  <Text style={[styles.completionMemo, { color: colors.onSurface }]}>"{c.memo}"</Text>
                ) : c.value ? (
                  <Text style={[styles.completionMemo, { color: colors.onSurface }]}>
                    {c.value} {habit?.targetUnit || 'completed'}
                  </Text>
                ) : null}
              </View>
            ))
          ) : (
            <View style={[styles.completionItem, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
              <Text style={[styles.completionDate, { color: colors.onSurfaceVariant }]}>No completions yet</Text>
              <Text style={[styles.completionMemo, { color: colors.onSurface }]}>Complete this habit to see your history!</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
  },
  content: {
    flex: 1,
    padding: theme.spacing.containerPadding,
  },
  habitInfoCard: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  habitName: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.semibold,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  habitStreak: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodyMd,
  },
  sectionTitle: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingLeft: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  completionList: {
    flex: 1,
  },
  completionItem: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
  },
  completionDate: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodySm,
    marginBottom: 2,
  },
  completionMemo: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodyMd,
    fontStyle: 'italic',
  },
});

export default HabitDetailScreen;
