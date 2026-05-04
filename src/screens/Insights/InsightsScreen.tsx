import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { theme, useTheme } from '@/theme';
import CalendarGrid from '@/components/CalendarGrid/CalendarGrid';
import HeatmapRow from '@/components/HeatmapRow/HeatmapRow';
import DayDetailSheet from '@/components/DayDetailSheet/DayDetailSheet';
import { format, subDays } from 'date-fns';
import { useStore } from '@/store';

const InsightsScreen = () => {
  const { colors, isDark } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { completions, habits } = useStore();

  // Build calendar habit data from real completions (last 90 days)
  const calendarHabitData = useMemo(() => {
    const dateMap: Record<string, Set<string>> = {};
    completions.forEach((c) => {
      const dateStr = format(new Date(c.completedAt), 'yyyy-MM-dd');
      if (!dateMap[dateStr]) dateMap[dateStr] = new Set();
      dateMap[dateStr].add(c.habitId);
    });

    // Map habit IDs to their colors
    const habitColorMap: Record<string, string> = {};
    habits.forEach((h) => {
      habitColorMap[h.id] = h.color || colors.primary;
    });

    return Object.entries(dateMap).map(([date, habitIds]) => ({
      date,
      colors: Array.from(habitIds).map((id) => habitColorMap[id] || colors.primary),
    }));
  }, [completions, habits, colors.primary]);

  // Build heatmap data from real completions (last 365 days)
  const heatmapData = useMemo(() => {
    const dateMap: Record<string, number> = {};
    completions.forEach((c) => {
      const dateStr = format(new Date(c.completedAt), 'yyyy-MM-dd');
      dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
    });

    return Array.from({ length: 365 }).map((_, i) => ({
      date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
      count: dateMap[format(subDays(new Date(), i), 'yyyy-MM-dd')] || 0,
    }));
  }, [completions]);

    return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.onSurface }]}>Insights</Text>
        </View>

        <View style={styles.section}>
          <View style={[styles.aiCard, { backgroundColor: colors.surface, borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }]}>
            <View style={styles.aiHeader}>
              <Text style={[styles.aiTitle, { color: colors.primary }]}>AI Insights</Text>
              <Text style={[styles.aiBadge, { color: colors.primary, backgroundColor: colors.primaryContainer }]}>✨ Serene AI</Text>
            </View>
            <Text style={[styles.aiBody, { color: colors.onSurfaceVariant }]}>
              You're building incredible momentum. Your "Morning Meditation" habit is your most consistent anchor, completed 14 days in a row. Consider pairing it with "Journaling" to stack these positive behaviors.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Monthly Consistency</Text>
          <CalendarGrid onDayPress={setSelectedDate} habitData={calendarHabitData} />
          {selectedDate && (
            <Text style={[styles.selectedDateText, { color: colors.onSurfaceVariant }]}>
              Selected: {format(selectedDate, 'MMM do, yyyy')}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Year in Review</Text>
          <View style={[styles.heatmapCard, { backgroundColor: colors.surface, borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)' }]}>
            <HeatmapRow data={heatmapData} weeks={52} baseColor={colors.primary} />
          </View>
        </View>
      </ScrollView>

      <DayDetailSheet date={selectedDate} onClose={() => setSelectedDate(null)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.containerPadding,
    paddingBottom: 40,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fonts.primary,
    letterSpacing: theme.typography.letterSpacings.h1,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: theme.spacing.md,
    letterSpacing: theme.typography.letterSpacings.h2,
  },
  aiCard: {
    borderRadius: theme.radius.xl,
    padding: 24,
    borderWidth: 1,
    ...theme.shadows.soft,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fonts.primary,
  },
  aiBadge: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.bold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  aiBody: {
    fontSize: theme.typography.sizes.bodyMd,
    lineHeight: theme.typography.lineHeights.bodyLg,
    fontFamily: theme.typography.fonts.primary,
  },
  heatmapCard: {
    borderRadius: theme.radius.xl,
    padding: 24,
    borderWidth: 1,
    ...theme.shadows.soft,
  },
  selectedDateText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.bodyMd,
    fontFamily: theme.typography.fonts.primary,
    textAlign: 'center',
  },
});

export default InsightsScreen;
