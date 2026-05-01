import { Platform } from 'react-native';

/**
 * Aura Design System — Typography
 *
 * Uses Manrope, a modern geometric sans-serif that balances
 * functional clarity with a friendly, organic personality.
 */
export const typography = {
  fonts: {
    primary: Platform.select({
      ios: 'Manrope',
      android: 'Manrope',
      default: 'Manrope',
    }),
    display: Platform.select({
      ios: 'Manrope',
      android: 'Manrope',
      default: 'Manrope',
    }),
    secondary: Platform.select({
      ios: 'Manrope',
      android: 'Manrope',
      default: 'Manrope',
    }),
  },
  sizes: {
    h1: 32,       // Page titles, large numbers
    h2: 24,       // Section headings
    h3: 18,       // Sub-section headings
    bodyLg: 18,   // Large body
    bodyMd: 16,   // Default body
    bodySm: 14,   // Small body / descriptions
    caption: 12,  // Captions, metadata
    labelCaps: 12, // All-caps labels, section headers
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    h1: 40,
    h2: 32,
    h3: 26,
    bodyLg: 28,
    bodyMd: 24,
    bodySm: 20,
    caption: 18,
    labelCaps: 16,
  },
  letterSpacings: {
    h1: -0.64,      // -0.02em = 32 * -0.02
    h2: -0.24,      // -0.01em = 24 * -0.01
    bodyLg: 0.18,   // 0.01em = 18 * 0.01
    bodyMd: 0.16,   // 0.01em = 16 * 0.01
    labelCaps: 0.96, // 0.08em = 12 * 0.08
  }
};

export type Typography = typeof typography;
