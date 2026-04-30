import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';
import ActivityRing from '@/components/ActivityRing/ActivityRing';
import HabitCard from '@/components/HabitCard/HabitCard';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/types';

const HomeScreen = () => {
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
  const avatarUrl = userProfile?.avatarUrl || user?.photoURL || 'https://i.pravatar.cc/100?img=5';

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (isLoadingHabits) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <Text style={styles.appTitle}>Ethos</Text>
          <TouchableOpacity>
            <Feather name="bell" size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.dateText}>{format(new Date(), 'EEEE, MMMM d').toUpperCase()}</Text>
          <Text style={styles.greetingText}>{greeting}, {firstName}</Text>
          <Text style={styles.subtitleText}>
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
              color={theme.colors.primary} 
              backgroundColor={theme.colors.surfaceVariant} 
            />
            <View style={styles.ringCenterText}>
              <Text style={styles.percentageText}>{progressPercent}<Text style={styles.percentageSymbol}>%</Text></Text>
              <Text style={styles.ringLabel}>TODAY'S FLOW</Text>
            </View>
          </View>
          
          {/* Pills */}
          <View style={styles.pillsRow}>
            <View style={styles.pill}>
              <MaterialCommunityIcons name="lightning-bolt" size={12} color={theme.colors.primary} />
              <Text style={styles.pillText}>{streak} DAY STREAK</Text>
            </View>
            <View style={styles.pill}>
              <MaterialCommunityIcons name="star-four-points-outline" size={12} color={theme.colors.tertiary} />
              <Text style={styles.pillText}>{xp} XP</Text>
            </View>
          </View>
        </View>

        {/* Daily Habits */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Habits</Text>
          <TouchableOpacity>
            <Text style={styles.editAllText}>EDIT ALL</Text>
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
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No habits yet. Tap + to add one!</Text>
            </View>
          )}
        </View>

        {/* Weekly Overview */}
        <Text style={[styles.sectionTitle, { marginTop: 16, marginBottom: 16 }]}>Weekly Overview</Text>
        <View style={styles.weeklyCard}>
          <View style={styles.weeklyHeader}>
            <View>
              <Text style={styles.weeklySubtitle}>MOST CONSISTENT</Text>
              <Text style={styles.weeklyTitle}>
                {mostConsistentHabit?.name || 'No data yet'}
              </Text>
            </View>
            <View style={styles.weeklyIconBadge}>
              <MaterialCommunityIcons 
                name={mostConsistentHabit?.iconName || mostConsistentHabit?.icon || 'star-outline'} 
                size={16} 
                color={theme.colors.primary} 
              />
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            {weeklyData.map((val, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.bar, 
                  { height: Math.max(4, 60 * val) }, 
                  idx === 6 && styles.activeBar
                ]} 
              />
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreateHabitPress} activeOpacity={0.8}>
        <Feather name="plus" size={24} color={theme.colors.onPrimary} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingHorizontal: theme.spacing.containerPadding, paddingTop: 16, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  appTitle: { fontSize: 20, fontWeight: theme.typography.weights.semibold, color: theme.colors.primary, fontFamily: theme.typography.fonts.primary },
  greetingSection: { marginBottom: 32 },
  dateText: { fontSize: theme.typography.sizes.labelCaps, fontWeight: theme.typography.weights.bold, color: theme.colors.onSurface, fontFamily: theme.typography.fonts.primary, letterSpacing: theme.typography.letterSpacings.labelCaps, marginBottom: 8 },
  greetingText: { fontSize: 28, fontWeight: theme.typography.weights.medium, color: theme.colors.onSurface, fontFamily: theme.typography.fonts.primary, marginBottom: 8, letterSpacing: theme.typography.letterSpacings.h1 },
  subtitleText: { fontSize: theme.typography.sizes.bodySm, color: theme.colors.outline, fontFamily: theme.typography.fonts.primary, lineHeight: theme.typography.lineHeights.bodySm },
  progressSection: { alignItems: 'center', marginBottom: 40 },
  ringWrapper: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  ringCenterText: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  percentageText: { fontSize: 48, fontWeight: theme.typography.weights.semibold, color: theme.colors.onSurface, fontFamily: theme.typography.fonts.primary, letterSpacing: -1 },
  percentageSymbol: { fontSize: 24, color: theme.colors.outline },
  ringLabel: { fontSize: theme.typography.sizes.labelCaps, fontWeight: theme.typography.weights.bold, color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.fonts.primary, letterSpacing: theme.typography.letterSpacings.labelCaps, marginTop: 4 },
  pillsRow: { flexDirection: 'row', gap: 12 },
  pill: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceVariant, paddingHorizontal: 12, paddingVertical: 8, borderRadius: theme.radius.md, gap: 6 },
  pillText: { fontSize: 10, fontWeight: theme.typography.weights.semibold, color: theme.colors.onSurface, fontFamily: theme.typography.fonts.primary, letterSpacing: 0.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: theme.typography.weights.medium, color: theme.colors.onSurface, fontFamily: theme.typography.fonts.primary },
  editAllText: { fontSize: theme.typography.sizes.labelCaps, fontWeight: theme.typography.weights.bold, color: theme.colors.primary, fontFamily: theme.typography.fonts.primary, letterSpacing: theme.typography.letterSpacings.labelCaps },
  habitsList: { marginBottom: 16 },
  emptyContainer: { padding: 24, alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, ...theme.shadows.soft },
  emptyText: { fontFamily: theme.typography.fonts.primary, fontSize: theme.typography.sizes.bodySm, color: theme.colors.outline },
  weeklyCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: 20, ...theme.shadows.soft },
  weeklyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  weeklySubtitle: { fontSize: theme.typography.sizes.labelCaps, fontWeight: theme.typography.weights.semibold, color: theme.colors.outline, fontFamily: theme.typography.fonts.primary, letterSpacing: 0.5, marginBottom: 4 },
  weeklyTitle: { fontSize: theme.typography.sizes.bodyMd, fontWeight: theme.typography.weights.semibold, color: theme.colors.onSurface, fontFamily: theme.typography.fonts.primary },
  weeklyIconBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.primaryContainer, justifyContent: 'center', alignItems: 'center' },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 60, paddingHorizontal: 8 },
  bar: { width: 32, backgroundColor: theme.colors.surfaceVariant, borderRadius: 6 },
  activeBar: { backgroundColor: theme.colors.primary },
  fab: { position: 'absolute', bottom: 16, right: 20, width: 64, height: 64, borderRadius: theme.radius.lg, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', ...theme.shadows.medium },
});

export default HomeScreen;
