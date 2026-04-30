import firestore from '@react-native-firebase/firestore';
import { Completion } from '@/types/completion';

const completionsCollection = (uid: string) =>
  firestore().collection('users').doc(uid).collection('completions');

/**
 * Subscribe to completions for a user (real-time).
 * Optionally filter by date range (startMs, endMs).
 */
export const subscribeToCompletions = (
  uid: string,
  onData: (completions: Completion[]) => void,
  options?: { startMs?: number; endMs?: number },
  onError?: (error: Error) => void,
) => {
  let query: any = completionsCollection(uid).orderBy('completedAt', 'desc');

  if (options?.startMs) {
    query = query.where('completedAt', '>=', options.startMs);
  }
  if (options?.endMs) {
    query = query.where('completedAt', '<=', options.endMs);
  }

  return query.onSnapshot(
    (snapshot: any) => {
      const completions: Completion[] = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onData(completions);
    },
    (error: Error) => {
      console.error('[completionService] subscribeToCompletions error:', error);
      onError?.(error);
    },
  );
};

/**
 * Add a completion record.
 */
export const addCompletion = async (
  uid: string,
  data: Omit<Completion, 'id'>,
): Promise<string> => {
  const docRef = await completionsCollection(uid).add({
    ...data,
    ownerId: uid,
    completedAt: data.completedAt || Date.now(),
  });
  return docRef.id;
};

/**
 * Remove a completion.
 */
export const removeCompletion = async (uid: string, completionId: string) => {
  await completionsCollection(uid).doc(completionId).delete();
};

/**
 * Get completions for a specific date (start of day to end of day).
 */
export const getCompletionsForDate = async (
  uid: string,
  date: Date,
): Promise<Completion[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const snapshot = await completionsCollection(uid)
    .where('completedAt', '>=', startOfDay.getTime())
    .where('completedAt', '<=', endOfDay.getTime())
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Completion[];
};

/**
 * Get completions for a specific habit.
 */
export const getCompletionsForHabit = async (
  uid: string,
  habitId: string,
  limit = 30,
): Promise<Completion[]> => {
  const snapshot = await completionsCollection(uid)
    .where('habitId', '==', habitId)
    .orderBy('completedAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Completion[];
};
