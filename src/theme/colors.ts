/**
 * Aura Design System — Color Palette
 *
 * Dominated by soft neutrals and muted tones, punctuated by a
 * signature sage green that symbolizes growth and tranquility.
 */
export const colors = {
  // ── Core ──────────────────────────────────────────────────
  primary: '#4d614e',           // Sage — actions, completion, progress
  primaryContainer: '#657a66',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#f7fff3',
  inversePrimary: '#b6ccb5',

  secondary: '#505e81',
  secondaryContainer: '#c6d4fd',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#4d5b7e',

  tertiary: '#74535b',
  tertiaryContainer: '#8e6b73',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#fffbff',

  // ── Surfaces ─────────────────────────────────────────────
  background: '#fbf9f6',       // Bone
  onBackground: '#1b1c1a',    // Stone

  surface: '#fbf9f6',          // Cards
  surfaceDim: '#dbdad7',
  surfaceBright: '#fbf9f6',
  surfaceVariant: '#e4e2df',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f5f3f0',
  surfaceContainer: '#efeeea',
  surfaceContainerHigh: '#e9e8e5',
  surfaceContainerHighest: '#e4e2df',

  onSurface: '#1b1c1a',       // Stone
  onSurfaceVariant: '#434842', // Muted text
  inverseSurface: '#30312f',
  inverseOnSurface: '#f2f0ed',

  surfaceTint: '#4f6350',

  // ── Outlines ─────────────────────────────────────────────
  outline: '#737872',
  outlineVariant: '#c3c8c0',

  // ── Error ────────────────────────────────────────────────
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // ── Custom habit colors (desaturated semantic tones) ─────
  habits: {
    health: '#8e6b73',
    fitness: '#505e81',
    mindfulness: '#7d927d',
    productivity: '#74535b',
    creative: '#8c7051',
  }
};

export type Colors = typeof colors;
