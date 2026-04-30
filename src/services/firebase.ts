import { initializeApp, getApps, getApp } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import Config from 'react-native-config';

// Initialize Firebase only if it hasn't been initialized yet
const firebaseConfig = {
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  projectId: Config.FIREBASE_PROJECT_ID,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
  appId: Config.FIREBASE_APP_ID,
  measurementId: Config.FIREBASE_MEASUREMENT_ID,
  databaseURL: Config.FIREBASE_DATABASE_URL,
};

if (Config.FIREBASE_API_KEY && !getApps().length) {
  initializeApp(firebaseConfig as any);
}

// Enable offline persistence only if initialized
if (getApps().length) {
  firestore().settings({
    persistence: true,
    ignoreUndefinedProperties: true,
  });
}

export const db = getApps().length ? firestore() : null;
export const rtdb = getApps().length ? database() : null;
export const fcm = getApps().length ? messaging() : null;
export const firebaseAuth = getApps().length ? auth() : null;
