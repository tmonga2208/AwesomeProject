/**
 * Aura Design System — Spacing & Radius
 *
 * The layout follows a Fluid Grid with fixed outer margins. The 8px linear scale ensures consistent rhythm across all components.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,

  // Semantic spacing
  unit: 8,
  containerPadding: 24,
  stackGap: 16,
  sectionGap: 40,
};

export const radius = {
  sm: 4,        // 0.25rem
  default: 8,   // 0.5rem
  md: 12,       // 0.75rem
  lg: 16,       // 1rem
  xl: 24,       // 1.5rem
  full: 9999,   // Buttons & Chips
};

export type Spacing = typeof spacing;
export type Radius = typeof radius;
