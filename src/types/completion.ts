export type Mood = 1 | 2 | 3 | 4 | 5;

export interface Completion {
  id: string;
  habitId: string;
  ownerId: string;
  completedAt: number; // Timestamp
  value?: number; // e.g., 5000 (steps), 15 (minutes)
  memo?: string; // max 280 chars
  mood?: Mood;
}
