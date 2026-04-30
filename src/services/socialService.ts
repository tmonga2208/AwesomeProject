import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import { FriendRequest, FeedItem } from '@/types/friend';

const friendsCollection = firestore().collection('friends');

/**
 * Generate a sorted composite key for two UIDs.
 */
const compositeKey = (uid1: string, uid2: string): string => {
  return [uid1, uid2].sort().join('_');
};

/**
 * Send a friend request.
 */
export const sendFriendRequest = async (
  fromUid: string,
  toUid: string,
) => {
  const id = compositeKey(fromUid, toUid);
  await friendsCollection.doc(id).set({
    users: [fromUid, toUid].sort(),
    status: 'pending',
    requestedBy: fromUid,
    createdAt: Date.now(),
  });
  return id;
};

/**
 * Accept a friend request.
 */
export const acceptFriendRequest = async (requestId: string) => {
  await friendsCollection.doc(requestId).update({
    status: 'accepted',
  });
};

/**
 * Reject a friend request.
 */
export const rejectFriendRequest = async (requestId: string) => {
  await friendsCollection.doc(requestId).update({
    status: 'rejected',
  });
};

/**
 * Subscribe to incoming friend requests for a user.
 */
export const subscribeFriendRequests = (
  uid: string,
  onData: (requests: FriendRequest[]) => void,
  onError?: (error: Error) => void,
) => {
  return friendsCollection
    .where('users', 'array-contains', uid)
    .onSnapshot(
      (snapshot) => {
        const requests: FriendRequest[] = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as FriendRequest))
          .filter((req) => req.status === 'pending' && req.requestedBy !== uid); // Only show incoming requests
        onData(requests);
      },
      (error) => {
        console.error('[socialService] subscribeFriendRequests error:', error);
        onError?.(error);
      },
    );
};

/**
 * Subscribe to accepted friends for a user.
 */
export const subscribeFriends = (
  uid: string,
  onData: (friends: FriendRequest[]) => void,
  onError?: (error: Error) => void,
) => {
  return friendsCollection
    .where('users', 'array-contains', uid)
    .onSnapshot(
      (snapshot) => {
        const friends: FriendRequest[] = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as FriendRequest))
          .filter((f) => f.status === 'accepted');
        onData(friends);
      },
      (error) => {
        console.error('[socialService] subscribeFriends error:', error);
        onError?.(error);
      },
    );
};

/**
 * Subscribe to social feed (Realtime Database).
 */
export const subscribeFeed = (
  uid: string,
  onData: (feed: FeedItem[]) => void,
  limit = 20,
) => {
  let rtdb;
  try {
    rtdb = database();
    if (!rtdb) throw new Error('RTDB not initialized');
  } catch (e) {
    console.warn('[socialService] Realtime Database not available:', e);
    onData([]);
    return () => {};
  }

  const feedRef = rtdb.ref(`/feed/${uid}`).orderByChild('timestamp').limitToLast(limit);

  try {
    feedRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        onData([]);
        return;
      }
      const feed: FeedItem[] = Object.entries(data)
        .map(([key, val]: [string, any]) => ({
          id: key,
          ...val,
        }))
        .sort((a, b) => b.timestamp - a.timestamp);
      onData(feed);
    });
  } catch (e) {
    console.error('[socialService] subscribeFeed error:', e);
    onData([]);
    return () => {};
  }

  // Return unsubscribe function
  return () => {
    try {
      feedRef.off('value');
    } catch (e) {
      // Ignore
    }
  };
};

/**
 * Post a completion to friends' feeds.
 */
export const postToFeed = async (
  fromUid: string,
  friendUids: string[],
  data: Omit<FeedItem, 'id'>,
) => {
  const updates: Record<string, any> = {};
  const feedItemKey = database().ref().push().key;

  for (const friendUid of friendUids) {
    updates[`/feed/${friendUid}/${feedItemKey}`] = {
      ...data,
      fromUid,
      timestamp: database.ServerValue.TIMESTAMP,
    };
  }

  await database().ref().update(updates);
};
