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

/**
 * Aura Design System — Dark Color Palette
 *
 * Carefully mapped dark equivalents that preserve the sage/organic identity
 * while providing comfortable contrast in low-light conditions.
 */
export const darkColors: typeof colors = {
  // ── Core ──────────────────────────────────────────────────
  primary: '#8BAF8C',           // Brighter sage for dark backgrounds
  primaryContainer: '#3A5A3B',
  onPrimary: '#1A2E1B',
  onPrimaryContainer: '#C8E6C9',
  inversePrimary: '#4d614e',

  secondary: '#9AADDC',
  secondaryContainer: '#384868',
  onSecondary: '#1E2A45',
  onSecondaryContainer: '#C6D4FD',

  tertiary: '#C4949D',
  tertiaryContainer: '#5A3640',
  onTertiary: '#2D1520',
  onTertiaryContainer: '#FFD9DF',

  // ── Surfaces ─────────────────────────────────────────────
  background: '#121212',        // True dark
  onBackground: '#E4E2DF',     // Light text

  surface: '#1E1E1E',           // Cards
  surfaceDim: '#121212',
  surfaceBright: '#3A3A3A',
  surfaceVariant: '#2A2A2A',
  surfaceContainerLowest: '#0E0E0E',
  surfaceContainerLow: '#1A1A1A',
  surfaceContainer: '#1E1E1E',
  surfaceContainerHigh: '#282828',
  surfaceContainerHighest: '#333333',

  onSurface: '#E4E2DF',        // Primary text
  onSurfaceVariant: '#B0B0B0', // Muted text
  inverseSurface: '#E4E2DF',
  inverseOnSurface: '#30312F',

  surfaceTint: '#8BAF8C',

  // ── Outlines ─────────────────────────────────────────────
  outline: '#8C918B',
  outlineVariant: '#444844',

  // ── Error ────────────────────────────────────────────────
  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFB4AB',

  // ── Custom habit colors (brightened for dark backgrounds) ─
  habits: {
    health: '#C4949D',
    fitness: '#9AADDC',
    mindfulness: '#A4BFA4',
    productivity: '#C4949D',
    creative: '#C4A882',
  }
};

export type Colors = typeof colors;
