import { colors } from './colors';
import { typography } from './typography';
import { spacing, radius } from './spacing';
import { shadows } from './shadows';

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
};

export type Theme = typeof theme;

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export { ThemeProvider, useTheme } from './ThemeContext';
