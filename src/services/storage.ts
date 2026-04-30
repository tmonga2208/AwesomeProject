import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'habitforge-storage',
});

// Storage Keys
export const STORAGE_KEYS = {
  ONBOARDING_DONE: 'onboarding_done',
  THEME: 'theme_preference',
};
