/**
 * Aura Design System — Spacing & Radius
 *
 * Consistent 32px for large cards, 16px for smaller elements.
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
  sm: 8,
  default: 12,
  md: 16,       // Small elements, buttons, inputs
  lg: 24,       // Medium cards
  xl: 32,       // Large cards, modals
  full: 9999,
};

export type Spacing = typeof spacing;
export type Radius = typeof radius;
