import { Platform } from 'react-native';

/**
 * Aura Design System — Shadows & Depth
 *
 * Elevation through broad, low-opacity shadows (blur: 30px, y: 10px).
 * Glassmorphism for modals and nav bars.
 */
export const shadows = {
  soft: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.04,
      shadowRadius: 30,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 15 },
      shadowOpacity: 0.08,
      shadowRadius: 40,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),
  glass: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(251, 249, 246, 0.85)',
  },
};

export type Shadows = typeof shadows;
