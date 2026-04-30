import { create } from 'zustand';
import { createHabitsSlice, HabitsSlice } from './habitsSlice';
import { createCompletionsSlice, CompletionsSlice } from './completionsSlice';
import { createUISlice, UISlice } from './uiSlice';
import { createUserSlice, UserSlice } from './userSlice';
import { createSocialSlice, SocialSlice } from './socialSlice';

export type StoreState = HabitsSlice & CompletionsSlice & UISlice & UserSlice & SocialSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createHabitsSlice(...a),
  ...createCompletionsSlice(...a),
  ...createUISlice(...a),
  ...createUserSlice(...a),
  ...createSocialSlice(...a),
}));
