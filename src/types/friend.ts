export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface FriendRequest {
  id: string;
  users: [string, string]; // sorted UIDs
  status: FriendRequestStatus;
  requestedBy: string; // UID of the requester
  createdAt: number; // Timestamp
}

export interface FeedItem {
  id: string;
  fromUid: string;
  fromName: string;
  fromAvatar: string;
  habitName: string;
  habitIcon: string;
  streak: number;
  timestamp: number;
}
