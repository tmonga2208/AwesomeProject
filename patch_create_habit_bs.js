const fs = require('fs');
const filePath = 'src/components/CreateHabitBottomSheet/CreateHabitBottomSheet.tsx';
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Change radius to 32px (theme.radius.xl) as defined in "Glass Modals" spec.
  const newStyles = `const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    ...theme.shadows.glass,
  },
  indicator: {
    backgroundColor: theme.colors.outlineVariant,
    width: 48,
    height: 4,
    borderRadius: 2,
    marginTop: 12,
  },
  container: {
    flex: 1,
    padding: theme.spacing.containerPadding,
  },
  title: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
    letterSpacing: theme.typography.letterSpacings.h2,
  },
  subtitle: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.outline,
    marginBottom: theme.spacing.xl,
    letterSpacing: theme.typography.letterSpacings.bodyMd,
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.onSurfaceVariant,
  },
});`;
  content = content.replace(/const styles = StyleSheet\.create\(\{[\s\S]*\}\);/, newStyles);
  fs.writeFileSync(filePath, content);
}
