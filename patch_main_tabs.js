const fs = require('fs');
const filePath = 'src/navigation/MainTabs.tsx';
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  const newStyles = `const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
    ...theme.shadows.glass,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.radius.full,
    gap: 4,
  },
  tabContentActive: {
    backgroundColor: theme.colors.primaryContainer,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fonts.primary,
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: theme.colors.onPrimaryContainer,
  },
});`;
  content = content.replace(/const styles = StyleSheet\.create\(\{[\s\S]*\}\);/, newStyles);
  fs.writeFileSync(filePath, content);
}
