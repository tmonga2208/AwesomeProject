import { StateCreator } from 'zustand';
import { Completion } from '@/types/completion';
import * as completionService from '@/services/completionService';

export interface CompletionsSlice {
  completions: Completion[];
  isLoadingCompletions: boolean;
  _completionsUnsubscribe: (() => void) | null;

  setCompletions: (completions: Completion[]) => void;
  addCompletion: (uid: string, data: Omit<Completion, 'id'>) => Promise<string>;
  removeCompletion: (uid: string, completionId: string) => Promise<void>;
  subscribeCompletions: (uid: string) => void;
  unsubscribeCompletions: () => void;
}

export const createCompletionsSlice: StateCreator<CompletionsSlice> = (set, get) => ({
  completions: [],
  isLoadingCompletions: true,
  _completionsUnsubscribe: null,

  setCompletions: (completions) => set({ completions, isLoadingCompletions: false }),

  addCompletion: async (uid, data) => {
    const id = await completionService.addCompletion(uid, data);
    return id;
  },

  removeCompletion: async (uid, completionId) => {
    await completionService.removeCompletion(uid, completionId);
  },

  subscribeCompletions: (uid) => {
    get()._completionsUnsubscribe?.();

    // Subscribe to completions from the last 90 days for insights
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;

    const unsubscribe = completionService.subscribeToCompletions(
      uid,
      (completions) => {
        set({ completions, isLoadingCompletions: false });
      },
      { startMs: ninetyDaysAgo },
    );

    set({ _completionsUnsubscribe: unsubscribe, isLoadingCompletions: true });
  },

  unsubscribeCompletions: () => {
    get()._completionsUnsubscribe?.();
    set({ _completionsUnsubscribe: null, completions: [], isLoadingCompletions: true });
  },
});
