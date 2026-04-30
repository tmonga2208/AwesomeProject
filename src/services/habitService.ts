import firestore from '@react-native-firebase/firestore';
import { Habit } from '@/types/habit';

const habitsCollection = (uid: string) =>
  firestore().collection('users').doc(uid).collection('habits');

/**
 * Subscribe to all habits for a user (real-time listener).
 * Returns an unsubscribe function.
 */
export const subscribeToHabits = (
  uid: string,
  onData: (habits: Habit[]) => void,
  onError?: (error: Error) => void,
) => {
  return habitsCollection(uid)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      (snapshot) => {
        const habits: Habit[] = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Habit))
          .filter((h) => h.archivedAt === null);
        onData(habits);
      },
      (error) => {
        console.error('[habitService] subscribeToHabits error:', error);
        onError?.(error);
      },
    );
};

/**
 * Create a new habit in Firestore.
 */
export const createHabit = async (
  uid: string,
  habitData: Omit<Habit, 'id'>,
): Promise<string> => {
  const docRef = await habitsCollection(uid).add({
    ...habitData,
    ownerId: uid,
    createdAt: firestore.FieldValue.serverTimestamp(),
    archivedAt: null,
  });
  return docRef.id;
};

/**
 * Update an existing habit.
 */
export const updateHabit = async (
  uid: string,
  habitId: string,
  updates: Partial<Habit>,
) => {
  await habitsCollection(uid).doc(habitId).update(updates);
};

/**
 * Soft-delete a habit by setting archivedAt.
 */
export const deleteHabit = async (uid: string, habitId: string) => {
  await habitsCollection(uid).doc(habitId).update({
    archivedAt: firestore.FieldValue.serverTimestamp(),
  });
};

/**
 * Hard-delete a habit document.
 */
export const permanentlyDeleteHabit = async (uid: string, habitId: string) => {
  await habitsCollection(uid).doc(habitId).delete();
};
