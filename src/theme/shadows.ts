import { ViewStyle } from 'react-native';

/**
 * Aura Design System — Shadows
 *
 * Elevation is communicated through Ambient Shadows and Backdrop Blurs rather than heavy outlines.
 */
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  // Level 1 (Cards): Subtle 1px inner borders (low opacity) and a broad, soft shadow
  // (Blur: 30px, Y: 10px, Opacity: 4%) create the appearance of elements floating just above the surface.
  soft: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 2, // Minimal elevation for Android
  } as ViewStyle,

  // Buttons: Primary buttons use a subtle vertical gradient (simulated with shadow here if no gradient view)
  medium: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  } as ViewStyle,

  // Level 2 (Modals/Overlays): Glassmorphic surfaces using a `20px` backdrop filter blur and a semi-transparent fill.
  // We can't do backdrop filter in core RN easily without extra libs, but we provide the shadow here
  glass: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 8,
  } as ViewStyle,
};

export type Shadows = typeof shadows;
