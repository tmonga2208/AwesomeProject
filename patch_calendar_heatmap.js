const fs = require('fs');

// Patch CalendarGrid.tsx
const calendarPath = 'src/components/CalendarGrid/CalendarGrid.tsx';
let calContent = fs.readFileSync(calendarPath, 'utf8');

const calStyles = `const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...theme.shadows.soft,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  monthText: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
    letterSpacing: theme.typography.letterSpacings.h2,
  },
  iconButton: {
    padding: 8,
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  dayOfWeekText: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.outline,
    fontFamily: theme.typography.fonts.primary,
    width: '14%',
    textAlign: 'center',
    letterSpacing: theme.typography.letterSpacings.labelCaps,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  cell: {
    width: '14%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  todayContainer: {
    backgroundColor: theme.colors.primaryContainer,
  },
  disabledContainer: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  todayText: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  disabledText: {
    color: theme.colors.outline,
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 4,
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});`;
calContent = calContent.replace(/const styles = StyleSheet\.create\(\{[\s\S]*\}\);/, calStyles);
fs.writeFileSync(calendarPath, calContent);

// Patch HeatmapRow.tsx
const heatmapPath = 'src/components/HeatmapRow/HeatmapRow.tsx';
let heatmapContent = fs.readFileSync(heatmapPath, 'utf8');

// Also replace standard `rx={3}` with `rx={theme.radius.sm}` in SVG
heatmapContent = heatmapContent.replace(/rx=\{3\}/g, `rx={4}`);

const heatmapStyles = `const styles = StyleSheet.create({
  scrollContainer: {
    paddingRight: 16,
  },
});`;
heatmapContent = heatmapContent.replace(/const styles = StyleSheet\.create\(\{[\s\S]*\}\);/, heatmapStyles);
fs.writeFileSync(heatmapPath, heatmapContent);
