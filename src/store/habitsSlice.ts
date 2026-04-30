import { StateCreator } from 'zustand';
import { Habit } from '@/types/habit';
import * as habitService from '@/services/habitService';

export interface HabitsSlice {
  habits: Habit[];
  isLoadingHabits: boolean;
  _habitsUnsubscribe: (() => void) | null;

  setHabits: (habits: Habit[]) => void;
  addHabit: (uid: string, habitData: Omit<Habit, 'id'>) => Promise<string>;
  updateHabit: (uid: string, habitId: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (uid: string, habitId: string) => Promise<void>;
  subscribeHabits: (uid: string) => void;
  unsubscribeHabits: () => void;
}

export const createHabitsSlice: StateCreator<HabitsSlice> = (set, get) => ({
  habits: [],
  isLoadingHabits: true,
  _habitsUnsubscribe: null,

  setHabits: (habits) => set({ habits, isLoadingHabits: false }),

  addHabit: async (uid, habitData) => {
    const id = await habitService.createHabit(uid, habitData);
    return id;
    // No need to manually update state — onSnapshot will fire
  },

  updateHabit: async (uid, habitId, updates) => {
    await habitService.updateHabit(uid, habitId, updates);
  },

  deleteHabit: async (uid, habitId) => {
    await habitService.deleteHabit(uid, habitId);
  },

  subscribeHabits: (uid) => {
    // Clean up any existing subscription
    get()._habitsUnsubscribe?.();

    const unsubscribe = habitService.subscribeToHabits(uid, (habits) => {
      set({ habits, isLoadingHabits: false });
    });

    set({ _habitsUnsubscribe: unsubscribe, isLoadingHabits: true });
  },

  unsubscribeHabits: () => {
    get()._habitsUnsubscribe?.();
    set({ _habitsUnsubscribe: null, habits: [], isLoadingHabits: true });
  },
});
