const fs = require('fs');
const filePath = 'src/screens/Home/HomeScreen.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const newStyles = `const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { paddingHorizontal: theme.spacing.containerPadding, paddingTop: 16, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.xl },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  appTitle: { fontSize: 22, fontWeight: theme.typography.weights.semibold, color: theme.colors.primary, fontFamily: theme.typography.fonts.primary },
  greetingSection: { marginBottom: theme.spacing.xxl },
  dateText: { fontSize: theme.typography.sizes.labelCaps, fontWeight: theme.typography.weights.bold, color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.fonts.primary, letterSpacing: theme.typography.letterSpacings.labelCaps, marginBottom: 8 },
  greetingText: { fontSize: theme.typography.sizes.h1, fontWeight: theme.typography.weights.semibold, color: theme.colors.onSurface, fontFamily: theme.typography.fonts.primary, marginBottom: 12, letterSpacing: theme.typography.letterSpacings.h1, lineHeight: theme.typography.lineHeights.h1 },
  subtitleText: { fontSize: theme.typography.sizes.bodyMd, color: theme.colors.outline, fontFamily: theme.typography.fonts.primary, lineHeight: theme.typography.lineHeights.bodyMd },
  progressSection: { alignItems: 'center', marginBottom: theme.spacing.sectionGap },
  ringWrapper: { alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.lg },
  ringCenterText: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  percentageText: { fontSize: 48, fontWeight: theme.typography.weights.semibold, color: theme.colors.onSurface, fontFamily: theme.typography.fonts.primary, letterSpacing: -1 },
  percentageSymbol: { fontSize: 24, color: theme.colors.outline },
  ringLabel: { fontSize: theme.typography.sizes.labelCaps, fontWeight: theme.typography.weights.bold, color: theme.colors.onSurfaceVariant, fontFamily: theme.typography.fonts.primary, letterSpacing: theme.typography.letterSpacings.labelCaps, marginTop: 4 },
  pillsRow: { flexDirection: 'row', gap: 12 },
  pill: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceVariant, paddingHorizontal: 16, paddingVertical: 10, borderRadius: theme.radius.full, gap: 6 },
  pillText: { fontSize: 12, fontWeight: theme.typography.weights.semibold, color: theme.colors.onSurface, fontFamily: theme.typography.fonts.primary, letterSpacing: 0.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg },
  sectionTitle: { fontSize: theme.typography.sizes.h2, fontWeight: theme.typography.weights.semibold, color: theme.colors.onSurface, fontFamily: theme.typography.fonts.primary, letterSpacing: theme.typography.letterSpacings.h2 },
  editAllText: { fontSize: theme.typography.sizes.labelCaps, fontWeight: theme.typography.weights.bold, color: theme.colors.primary, fontFamily: theme.typography.fonts.primary, letterSpacing: theme.typography.letterSpacings.labelCaps },
  habitsList: { marginBottom: theme.spacing.sectionGap },
  emptyContainer: { padding: 32, alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl, ...theme.shadows.soft, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' },
  emptyText: { fontFamily: theme.typography.fonts.primary, fontSize: theme.typography.sizes.bodyMd, color: theme.colors.outline },
  weeklyCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl, padding: 24, ...theme.shadows.soft, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' },
  weeklyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  weeklySubtitle: { fontSize: theme.typography.sizes.labelCaps, fontWeight: theme.typography.weights.semibold, color: theme.colors.outline, fontFamily: theme.typography.fonts.primary, letterSpacing: theme.typography.letterSpacings.labelCaps, marginBottom: 4 },
  weeklyTitle: { fontSize: theme.typography.sizes.bodyLg, fontWeight: theme.typography.weights.semibold, color: theme.colors.onSurface, fontFamily: theme.typography.fonts.primary },
  weeklyIconBadge: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.primaryContainer, justifyContent: 'center', alignItems: 'center' },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 80, paddingHorizontal: 8 },
  bar: { width: 32, backgroundColor: theme.colors.surfaceVariant, borderRadius: theme.radius.full },
  activeBar: { backgroundColor: theme.colors.primary },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 64, height: 64, borderRadius: theme.radius.full, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', ...theme.shadows.medium },
});`;

content = content.replace(/const styles = StyleSheet\.create\(\{[\s\S]*\}\);/, newStyles);
fs.writeFileSync(filePath, content);
