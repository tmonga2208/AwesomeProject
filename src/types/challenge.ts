export interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: string[]; // UIDs
  habitType: string;
  createdBy: string; // UID
  createdAt: number; // Timestamp
  isActive: boolean;
  sharedStreak: number;
}
