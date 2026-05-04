import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { colors, darkColors, Colors } from './colors';
import { typography } from './typography';
import { spacing, radius } from './spacing';
import { shadows } from './shadows';
import { useStore } from '@/store';

export interface ThemeContextType {
  colors: Colors;
  isDark: boolean;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
}

const ThemeContext = createContext<ThemeContextType>({
  colors,
  isDark: false,
  typography,
  spacing,
  radius,
  shadows,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeMode = useStore((s) => s.themeMode);
  const systemScheme = useColorScheme();

  const value = useMemo<ThemeContextType>(() => {
    let isDark: boolean;

    if (themeMode === 'system') {
      isDark = systemScheme === 'dark';
    } else {
      isDark = themeMode === 'dark';
    }

    return {
      colors: isDark ? darkColors : colors,
      isDark,
      typography,
      spacing,
      radius,
      shadows,
    };
  }, [themeMode, systemScheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access the current theme (colors, isDark, typography, etc.)
 * Colors will automatically update when the theme mode changes.
 */
export const useTheme = (): ThemeContextType => {
  return useContext(ThemeContext);
};
