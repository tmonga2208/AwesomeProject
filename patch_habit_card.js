const fs = require('fs');
const filePath = 'src/components/HabitCard/HabitCard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The design says:
// 1. Primary Cards: Use a 24px radius (`rounded-xl` in this system).
// 2. Backgrounds should be a solid surface with a very faint tint of the habit’s semantic color
// 3. Subtle 1px inner borders (low opacity) and a broad, soft shadow
// 4. Buttons & Chips: Use a full pill shape (999px)

// Let's replace the styles
const newStyles = `const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.soft,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)', // subtle inner border
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodyMd,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    marginBottom: 4,
    letterSpacing: theme.typography.letterSpacings.bodyMd,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  completedButton: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
});`;

content = content.replace(/const styles = StyleSheet\.create\(\{[\s\S]*\}\);/, newStyles);
fs.writeFileSync(filePath, content);
