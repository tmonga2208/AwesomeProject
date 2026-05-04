import { StateCreator } from 'zustand';
import { storage, STORAGE_KEYS } from '@/services/storage';

export type ThemeMode = 'light' | 'dark' | 'system';

// Read persisted theme on initialization
const getPersistedTheme = (): ThemeMode => {
  try {
    const stored = storage.getString(STORAGE_KEYS.THEME);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // Storage not ready yet, fall back to default
  }
  return 'system';
};

export interface UISlice {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isCreateModalOpen: boolean;
  setCreateModalOpen: (isOpen: boolean) => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  themeMode: getPersistedTheme(),
  setThemeMode: (mode) => {
    storage.set(STORAGE_KEYS.THEME, mode);
    set({ themeMode: mode });
  },
  isCreateModalOpen: false,
  setCreateModalOpen: (isOpen) => set({ isCreateModalOpen: isOpen }),
});
