export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  streak: number;
  totalXP: number;
  createdAt: number; // Timestamp
}
