const fs = require('fs');
const filePath = 'src/screens/Insights/InsightsScreen.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the render to include AI insights
const newRender = `  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Insights</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiTitle}>AI Insights</Text>
              <Text style={styles.aiBadge}>✨ Serene AI</Text>
            </View>
            <Text style={styles.aiBody}>
              You're building incredible momentum. Your "Morning Meditation" habit is your most consistent anchor, completed 14 days in a row. Consider pairing it with "Journaling" to stack these positive behaviors.
            </Text>
          </View>
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
  );`;

content = content.replace(/return \([\s\S]*?\);\n};/, newRender + '\n};');

// Replace the styles
const newStyles = `const styles = StyleSheet.create({
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
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: theme.spacing.md,
    letterSpacing: theme.typography.letterSpacings.h2,
  },
  aiCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
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
    color: theme.colors.primary,
    fontFamily: theme.typography.fonts.primary,
  },
  aiBadge: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  aiBody: {
    fontSize: theme.typography.sizes.bodyMd,
    lineHeight: theme.typography.lineHeights.bodyLg,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.primary,
  },
  heatmapCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...theme.shadows.soft,
  },
  selectedDateText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.primary,
    textAlign: 'center',
  },
});`;

content = content.replace(/const styles = StyleSheet\.create\(\{[\s\S]*\}\);/, newStyles);
fs.writeFileSync(filePath, content);
