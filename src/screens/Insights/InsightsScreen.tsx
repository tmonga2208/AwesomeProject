import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { theme } from '@/theme';
import CalendarGrid from '@/components/CalendarGrid/CalendarGrid';
import HeatmapRow from '@/components/HeatmapRow/HeatmapRow';
import DayDetailSheet from '@/components/DayDetailSheet/DayDetailSheet';
import { format, subDays } from 'date-fns';
import { useStore } from '@/store';

const InsightsScreen = () => {
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
      habitColorMap[h.id] = h.color || theme.colors.primary;
    });

    return Object.entries(dateMap).map(([date, habitIds]) => ({
      date,
      colors: Array.from(habitIds).map((id) => habitColorMap[id] || theme.colors.primary),
    }));
  }, [completions, habits]);

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Insights</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Consistency</Text>
          <CalendarGrid onDayPress={setSelectedDate} habitData={calendarHabitData} />
          {selectedDate && (
            <Text style={styles.selectedDateText}>
              Selected: {format(selectedDate, 'MMM do, yyyy')}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Year in Review</Text>
          <View style={styles.heatmapCard}>
            <HeatmapRow data={heatmapData} weeks={52} baseColor={theme.colors.primary} />
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
    backgroundColor: theme.colors.background,
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
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
    letterSpacing: theme.typography.letterSpacings.h1,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: theme.spacing.md,
  },
  heatmapCard: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    ...theme.shadows.soft,
  },
  selectedDateText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.primary,
    textAlign: 'center',
  },
});

export default InsightsScreen;
