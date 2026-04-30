/**
 * Aura Design System — Color Palette
 *
 * Dominated by soft neutrals and muted tones, punctuated by a
 * signature sage green that symbolizes growth and tranquility.
 */
export const colors = {
  // ── Core ──────────────────────────────────────────────────
  primary: '#7D927D',           // Sage — actions, completion, progress
  primaryContainer: '#D5EDD0',  // Soft sage tint for icon badges
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#2D4A32',

  secondary: '#505E81',
  secondaryContainer: '#C6D4FD',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#4D5B7E',

  tertiary: '#74535B',
  tertiaryContainer: '#8E6B73',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#FFFBFF',

  // ── Surfaces ─────────────────────────────────────────────
  background: '#FBF9F6',       // Bone
  onBackground: '#2D2D2D',    // Stone

  surface: '#FFFFFF',          // Cards
  surfaceDim: '#DBDAD7',
  surfaceBright: '#FBF9F6',
  surfaceVariant: '#EFECEA',   // Sand — secondary buttons, containers
  onSurface: '#2D2D2D',       // Stone
  onSurfaceVariant: '#6B6B6B', // Muted text

  // ── Outlines ─────────────────────────────────────────────
  outline: '#9B9B9B',
  outlineVariant: '#E0DDD9',

  // ── Error ────────────────────────────────────────────────
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#93000A',

  // ── Custom habit colors (desaturated semantic tones) ─────
  habits: {
    health: '#8E6B73',
    fitness: '#505E81',
    mindfulness: '#7D927D',
    productivity: '#74535B',
    creative: '#8C7051',
  }
};

export type Colors = typeof colors;
