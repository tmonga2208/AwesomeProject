import firestore from '@react-native-firebase/firestore';
import { UserProfile } from '@/types/user';

const usersCollection = firestore().collection('users');

/**
 * Create a user profile doc on first sign-up.
 */
export const createUserProfile = async (
  uid: string,
  data: Omit<UserProfile, 'uid' | 'streak' | 'totalXP' | 'createdAt'>,
) => {
  await usersCollection.doc(uid).set({
    uid,
    ...data,
    streak: 0,
    totalXP: 0,
    createdAt: Date.now(),
  });
};

/**
 * Subscribe to user profile changes (real-time).
 */
export const subscribeToUserProfile = (
  uid: string,
  onData: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void,
) => {
  return usersCollection.doc(uid).onSnapshot(
    (doc) => {
      if ((doc as any).exists) {
        onData({ uid: doc.id, ...doc.data() } as UserProfile);
      } else {
        onData(null);
      }
    },
    (error) => {
      console.error('[userService] subscribeToUserProfile error:', error);
      onError?.(error);
    },
  );
};

/**
 * Get a user profile by UID (one-time read).
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const doc = await usersCollection.doc(uid).get();
  if (!(doc as any).exists) return null;
  return { uid: doc.id, ...doc.data() } as UserProfile;
};

/**
 * Update user profile fields.
 */
export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>,
) => {
  await usersCollection.doc(uid).set(updates, { merge: true });
};

/**
 * Search users by displayName prefix (for Add Friend).
 */
export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase();
  const endQuery = normalizedQuery + '\uf8ff';

  const snapshot = await usersCollection
    .where('displayName', '>=', normalizedQuery)
    .where('displayName', '<=', endQuery)
    .limit(10)
    .get();

  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  })) as UserProfile[];
};

/**
 * Increment a user's streak.
 */
export const incrementStreak = async (uid: string) => {
  await usersCollection.doc(uid).update({
    streak: firestore.FieldValue.increment(1),
  });
};

/**
 * Reset a user's streak to 0.
 */
export const resetStreak = async (uid: string) => {
  await usersCollection.doc(uid).update({ streak: 0 });
};

/**
 * Add XP to a user's total.
 */
export const addXP = async (uid: string, amount: number) => {
  await usersCollection.doc(uid).update({
    totalXP: firestore.FieldValue.increment(amount),
  });
};
