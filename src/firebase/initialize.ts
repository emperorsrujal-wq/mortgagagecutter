
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Initializes and returns the Firebase app, auth, and firestore instances.
 * This function is designed to be idempotent, meaning it can be called multiple
 * times without re-initializing the app, which is crucial in a Next.js environment
 * with Fast Refresh.
 *
 * @returns An object containing the initialized FirebaseApp, Auth, and Firestore instances.
 */
export function initializeFirebase(): { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore } {
  // Check if any Firebase apps have been initialized. If not, initialize one.
  // If apps already exist, get the default app. This prevents re-initialization errors.
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  
  return { firebaseApp: app, auth, firestore };
}
