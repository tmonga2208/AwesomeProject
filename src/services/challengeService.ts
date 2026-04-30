import firestore from '@react-native-firebase/firestore';
import { Challenge } from '@/types/challenge';

const challengesCollection = firestore().collection('challenges');

/**
 * Create a new challenge.
 */
export const createChallenge = async (
  data: Omit<Challenge, 'id'>,
): Promise<string> => {
  const docRef = await challengesCollection.add({
    ...data,
    createdAt: Date.now(),
    isActive: true,
    sharedStreak: 0,
  });
  return docRef.id;
};

/**
 * Subscribe to challenges where user is a participant.
 */
export const subscribeChallenges = (
  uid: string,
  onData: (challenges: Challenge[]) => void,
  onError?: (error: Error) => void,
) => {
  return challengesCollection
    .where('participants', 'array-contains', uid)
    .where('isActive', '==', true)
    .onSnapshot(
      (snapshot) => {
        const challenges: Challenge[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Challenge[];
        onData(challenges);
      },
      (error) => {
        console.error('[challengeService] subscribeChallenges error:', error);
        onError?.(error);
      },
    );
};

/**
 * Update a challenge.
 */
export const updateChallenge = async (
  challengeId: string,
  updates: Partial<Challenge>,
) => {
  await challengesCollection.doc(challengeId).update(updates);
};

/**
 * End a challenge.
 */
export const endChallenge = async (challengeId: string) => {
  await challengesCollection.doc(challengeId).update({
    isActive: false,
  });
};
