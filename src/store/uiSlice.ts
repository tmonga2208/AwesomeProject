import { StateCreator } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UISlice {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isCreateModalOpen: boolean;
  setCreateModalOpen: (isOpen: boolean) => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  themeMode: 'system',
  setThemeMode: (mode) => set({ themeMode: mode }),
  isCreateModalOpen: false,
  setCreateModalOpen: (isOpen) => set({ isCreateModalOpen: isOpen }),
});
