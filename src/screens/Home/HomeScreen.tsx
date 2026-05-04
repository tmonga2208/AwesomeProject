import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';
import { theme, useTheme } from '@/theme';
import ActivityRing from '@/components/ActivityRing/ActivityRing';
import HabitCard from '@/components/HabitCard/HabitCard';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const { colors, isDark } = useTheme();
  const { habits, completions, isLoadingHabits, userProfile, addCompletion } = useStore();
  const { user } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  // Compute today's completions
  const todayStart = startOfDay(new Date()).getTime();
  const todayEnd = endOfDay(new Date()).getTime();

  const todayCompletions = useMemo(
    () => completions.filter((c) => c.completedAt >= todayStart && c.completedAt <= todayEnd),
    [completions, todayStart, todayEnd],
  );

  // Compute progress — what % of habits are done today
  const completedHabitIds = new Set(todayCompletions.map((c) => c.habitId));
  const dailyHabits = habits.filter((h) => h.frequency === 'daily');
  const progress = dailyHabits.length > 0 ? completedHabitIds.size / dailyHabits.length : 0;
  const progressPercent = Math.round(progress * 100);

  // Compute weekly bar chart data (last 7 days)
  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const day = subDays(new Date(), 6 - i);
      const dayStart = startOfDay(day).getTime();
      const dayEnd = endOfDay(day).getTime();
      const dayCompletions = completions.filter(
        (c) => c.completedAt >= dayStart && c.completedAt <= dayEnd,
      );
      const dayUniqueHabits = new Set(dayCompletions.map((c) => c.habitId)).size;
      return dailyHabits.length > 0 ? dayUniqueHabits / dailyHabits.length : 0;
    });
  }, [completions, dailyHabits.length]);

  // Find most consistent habit this week
  const mostConsistentHabit = useMemo(() => {
    if (habits.length === 0) return null;
    const weekStart = subDays(new Date(), 7).getTime();
    const weekCompletions = completions.filter((c) => c.completedAt >= weekStart);
    const habitCounts: Record<string, number> = {};
    weekCompletions.forEach((c) => {
      habitCounts[c.habitId] = (habitCounts[c.habitId] || 0) + 1;
    });
    const topHabitId = Object.entries(habitCounts).sort(([, a], [, b]) => b - a)[0]?.[0];
    return habits.find((h) => h.id === topHabitId) || null;
  }, [habits, completions]);

  const handleComplete = async (habitId: string) => {
    if (!user?.uid) return;
    // Check if already completed today
    if (completedHabitIds.has(habitId)) return;

    await addCompletion(user.uid, {
      habitId,
      ownerId: user.uid,
      completedAt: Date.now(),
    });
  };

  const handleCreateHabitPress = () => {
    navigation.navigate('CreateHabit');
  };

  const streak = userProfile?.streak || 0;
  const xp = userProfile?.totalXP || 0;
  const displayName = userProfile?.displayName || user?.displayName || 'there';
  const firstName = displayName.split(' ')[0];
 

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (isLoadingHabits) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.levelText, { backgroundColor: colors.primaryContainer, color: colors.onPrimaryContainer }]}>1</Text>
          <TouchableOpacity>
            <Feather name="bell" size={20} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        <View style={styles.greetingSection}>
          <Text style={[styles.dateText, { color: colors.onSurfaceVariant }]}>{format(new Date(), 'EEEE, MMMM d').toUpperCase()}</Text>
          <Text style={[styles.greetingText, { color: colors.onSurface }]}>{greeting}, {firstName}</Text>
          <Text style={[styles.subtitleText, { color: colors.outline }]}>
            {streak > 0
              ? `You're on a ${streak}-day streak. Keep the\nmomentum.`
              : 'Start building your daily rituals today.'}
          </Text>
        </View>

        {/* Progress Ring */}
        <View style={styles.progressSection}>
          <View style={styles.ringWrapper}>
            <ActivityRing 
              progress={progress} 
              size={220} 
              strokeWidth={16} 
              color={colors.primary} 
              backgroundColor={colors.surfaceVariant} 
            />
            <View style={styles.ringCenterText}>
              <Text style={[styles.percentageText, { color: colors.onSurface }]}>{progressPercent}<Text style={[styles.percentageSymbol, { color: colors.outline }]}>%</Text></Text>
              <Text style={[styles.ringLabel, { color: colors.onSurfaceVariant }]}>TODAY'S FLOW</Text>
            </View>
          </View>
          
          {/* Pills */}
          <View style={styles.pillsRow}>
            <View style={[styles.pill, { backgroundColor: colors.surfaceVariant }]}>
              <MaterialCommunityIcons name="lightning-bolt" size={12} color={colors.primary} />
              <Text style={[styles.pillText, { color: colors.onSurface }]}>{streak} DAY STREAK</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: colors.surfaceVariant }]}>
              <MaterialCommunityIcons name="star-four-points-outline" size={12} color={colors.tertiary} />
              <Text style={[styles.pillText, { color: colors.onSurface }]}>{xp} XP</Text>
            </View>
          </View>
        </View>

        {/* Daily Habits */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Daily Habits</Text>
          <TouchableOpacity>
            <Text style={[styles.editAllText, { color: colors.primary }]}>EDIT ALL</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.habitsList}>
          {habits.length > 0 ? (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={completedHabitIds.has(habit.id)}
                onComplete={handleComplete}
              />
            ))
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }]}>
              <Text style={[styles.emptyText, { color: colors.outline }]}>No habits yet. Tap + to add one!</Text>
            </View>
          )}
        </View>

        {/* Weekly Overview */}
        <Text style={[styles.sectionTitle, { color: colors.onSurface, marginTop: 16, marginBottom: 16 }]}>Weekly Overview</Text>
        <View style={[styles.weeklyCard, { backgroundColor: colors.surface, borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }]}>
          <View style={styles.weeklyHeader}>
            <View>
              <Text style={[styles.weeklySubtitle, { color: colors.outline }]}>MOST CONSISTENT</Text>
              <Text style={[styles.weeklyTitle, { color: colors.onSurface }]}>
                {mostConsistentHabit?.name || 'No data yet'}
              </Text>
            </View>
            <View style={[styles.weeklyIconBadge, { backgroundColor: colors.primaryContainer }]}>
              <MaterialCommunityIcons 
                name={mostConsistentHabit?.iconName || mostConsistentHabit?.icon || 'star-outline'} 
                size={16} 
                color={colors.primary} 
              />
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            {weeklyData.map((val, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.bar, 
                  { height: Math.max(4, 60 * val), backgroundColor: colors.surfaceVariant }, 
                  idx === 6 && { backgroundColor: colors.primary },
                ]} 
              />
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]} onPress={handleCreateHabitPress} activeOpacity={0.8}>
        <Feather name="plus" size={24} color={colors.onPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: theme.spacing.containerPadding, paddingTop: 16, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xl },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  appTitle: { fontSize: 22, fontWeight: theme.typography.weights.semibold, fontFamily: theme.typography.fonts.primary },
  greetingSection: { marginBottom: theme.spacing.xxl },
  dateText: { fontSize: theme.typography.sizes.labelCaps, fontWeight: theme.typography.weights.bold, fontFamily: theme.typography.fonts.primary, letterSpacing: theme.typography.letterSpacings.labelCaps, marginBottom: 8 },
  greetingText: { fontSize: theme.typography.sizes.h1, fontWeight: theme.typography.weights.semibold, fontFamily: theme.typography.fonts.primary, marginBottom: 12, letterSpacing: theme.typography.letterSpacings.h1, lineHeight: theme.typography.lineHeights.h1 },
  subtitleText: { fontSize: theme.typography.sizes.bodyMd, fontFamily: theme.typography.fonts.primary, lineHeight: theme.typography.lineHeights.bodyMd },
  progressSection: { alignItems: 'center', marginBottom: theme.spacing.sectionGap },
  ringWrapper: { alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.lg },
  ringCenterText: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  percentageText: { fontSize: 48, fontWeight: theme.typography.weights.semibold, fontFamily: theme.typography.fonts.primary, letterSpacing: -1 },
  percentageSymbol: { fontSize: 24 },
  ringLabel: { fontSize: theme.typography.sizes.labelCaps, fontWeight: theme.typography.weights.bold, fontFamily: theme.typography.fonts.primary, letterSpacing: theme.typography.letterSpacings.labelCaps, marginTop: 4 },
  pillsRow: { flexDirection: 'row', gap: 12 },
  pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: theme.radius.full, gap: 6 },
  pillText: { fontSize: 12, fontWeight: theme.typography.weights.semibold, fontFamily: theme.typography.fonts.primary, letterSpacing: 0.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  sectionTitle: { fontSize: theme.typography.sizes.h2, fontWeight: theme.typography.weights.semibold, fontFamily: theme.typography.fonts.primary, letterSpacing: theme.typography.letterSpacings.h2 },
  editAllText: { fontSize: theme.typography.sizes.labelCaps, fontWeight: theme.typography.weights.bold, fontFamily: theme.typography.fonts.primary, letterSpacing: theme.typography.letterSpacings.labelCaps },
  habitsList: { marginBottom: theme.spacing.sectionGap },
  emptyContainer: { padding: 32, alignItems: 'center', borderRadius: theme.radius.xl, ...theme.shadows.soft, borderWidth: 1 },
  emptyText: { fontFamily: theme.typography.fonts.primary, fontSize: theme.typography.sizes.bodyMd },
  weeklyCard: { borderRadius: theme.radius.xl, padding: 24, ...theme.shadows.soft, borderWidth: 1 },
  weeklyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  weeklySubtitle: { fontSize: theme.typography.sizes.labelCaps, fontWeight: theme.typography.weights.semibold, fontFamily: theme.typography.fonts.primary, letterSpacing: theme.typography.letterSpacings.labelCaps, marginBottom: 4 },
  weeklyTitle: { fontSize: theme.typography.sizes.bodyLg, fontWeight: theme.typography.weights.semibold, fontFamily: theme.typography.fonts.primary },
  weeklyIconBadge: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 80, paddingHorizontal: 8 },
  bar: { width: 32, borderRadius: theme.radius.full },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 64, height: 64, borderRadius: theme.radius.full, justifyContent: 'center', alignItems: 'center', ...theme.shadows.medium },
  levelText: {
    width: 48,
    height: 48,
    borderRadius: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 48,
    fontSize: theme.typography.sizes.bodyLg,
    fontWeight: theme.typography.weights.bold,
    elevation: 10
  }
});

export default HomeScreen;
