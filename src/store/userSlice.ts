import { StateCreator } from 'zustand';
import { UserProfile } from '@/types/user';
import * as userService from '@/services/userService';

export interface UserSlice {
  userProfile: UserProfile | null;
  isLoadingProfile: boolean;
  _profileUnsubscribe: (() => void) | null;

  setUserProfile: (profile: UserProfile | null) => void;
  subscribeProfile: (uid: string) => void;
  unsubscribeProfile: () => void;
  updateProfile: (uid: string, updates: Partial<UserProfile>) => Promise<void>;
}

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  userProfile: null,
  isLoadingProfile: true,
  _profileUnsubscribe: null,

  setUserProfile: (profile) => set({ userProfile: profile, isLoadingProfile: false }),

  subscribeProfile: (uid) => {
    get()._profileUnsubscribe?.();

    const unsubscribe = userService.subscribeToUserProfile(uid, (profile) => {
      set({ userProfile: profile, isLoadingProfile: false });
    });

    set({ _profileUnsubscribe: unsubscribe, isLoadingProfile: true });
  },

  unsubscribeProfile: () => {
    get()._profileUnsubscribe?.();
    set({ _profileUnsubscribe: null, userProfile: null, isLoadingProfile: true });
  },

  updateProfile: async (uid, updates) => {
    await userService.updateUserProfile(uid, updates);
  },
});
