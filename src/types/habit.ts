export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Habit {
  id: string;
  ownerId: string;
  name: string;
  icon: string;
  iconName?: string; // Material Community Icons name
  color: string;
  category: string;
  frequency: HabitFrequency;
  targetCount: number; // e.g., 3 times a week
  targetValue?: number; // e.g., 10000
  targetUnit?: string; // e.g., 'steps'
  isQuitHabit: boolean;
  reminderTime?: string; // HH:mm
  ringtone?: string;
  createdAt: number; // Timestamp
  archivedAt: number | null;
}
