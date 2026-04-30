import { StateCreator } from 'zustand';
import { FriendRequest, FeedItem } from '@/types/friend';
import { Challenge } from '@/types/challenge';
import { UserProfile } from '@/types/user';
import * as socialService from '@/services/socialService';
import * as challengeService from '@/services/challengeService';
import * as userService from '@/services/userService';

export interface SocialSlice {
  friends: FriendRequest[];
  friendProfiles: UserProfile[];
  friendRequests: FriendRequest[];
  feed: FeedItem[];
  challenges: Challenge[];
  isLoadingSocial: boolean;

  _friendsUnsubscribe: (() => void) | null;
  _friendRequestsUnsubscribe: (() => void) | null;
  _feedUnsubscribe: (() => void) | null;
  _challengesUnsubscribe: (() => void) | null;

  subscribeSocial: (uid: string) => void;
  unsubscribeSocial: () => void;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  rejectFriendRequest: (requestId: string) => Promise<void>;
  sendFriendRequest: (fromUid: string, toUid: string) => Promise<string>;
  createChallenge: (data: Omit<Challenge, 'id'>) => Promise<string>;
}

export const createSocialSlice: StateCreator<SocialSlice> = (set, get) => ({
  friends: [],
  friendProfiles: [],
  friendRequests: [],
  feed: [],
  challenges: [],
  isLoadingSocial: true,

  _friendsUnsubscribe: null,
  _friendRequestsUnsubscribe: null,
  _feedUnsubscribe: null,
  _challengesUnsubscribe: null,

  subscribeSocial: (uid) => {
    // Clean up existing
    get().unsubscribeSocial();

    const friendsUnsub = socialService.subscribeFriends(uid, async (friends) => {
      set({ friends });

      // Fetch friend profiles
      const friendUids = friends.flatMap((f) =>
        f.users.filter((u) => u !== uid),
      );
      const profiles = await Promise.all(
        friendUids.map((fuid) => userService.getUserProfile(fuid)),
      );
      set({
        friendProfiles: profiles.filter(Boolean) as UserProfile[],
        isLoadingSocial: false,
      });
    });

    const requestsUnsub = socialService.subscribeFriendRequests(uid, (requests) => {
      set({ friendRequests: requests });
    });

    const feedUnsub = socialService.subscribeFeed(uid, (feed) => {
      set({ feed });
    });

    const challengesUnsub = challengeService.subscribeChallenges(uid, (challenges) => {
      set({ challenges });
    });

    set({
      _friendsUnsubscribe: friendsUnsub,
      _friendRequestsUnsubscribe: requestsUnsub,
      _feedUnsubscribe: feedUnsub,
      _challengesUnsubscribe: challengesUnsub,
      isLoadingSocial: true,
    });
  },

  unsubscribeSocial: () => {
    get()._friendsUnsubscribe?.();
    get()._friendRequestsUnsubscribe?.();
    get()._feedUnsubscribe?.();
    get()._challengesUnsubscribe?.();
    set({
      _friendsUnsubscribe: null,
      _friendRequestsUnsubscribe: null,
      _feedUnsubscribe: null,
      _challengesUnsubscribe: null,
      friends: [],
      friendProfiles: [],
      friendRequests: [],
      feed: [],
      challenges: [],
      isLoadingSocial: true,
    });
  },

  acceptFriendRequest: async (requestId) => {
    await socialService.acceptFriendRequest(requestId);
  },

  rejectFriendRequest: async (requestId) => {
    await socialService.rejectFriendRequest(requestId);
  },

  sendFriendRequest: async (fromUid, toUid) => {
    return socialService.sendFriendRequest(fromUid, toUid);
  },

  createChallenge: async (data) => {
    return challengeService.createChallenge(data);
  },
});
