import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

const rawApiKey = (import.meta.env.VITE_FIREBASE_API_KEY || '').trim();
const rawProjectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID || '').trim();

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    rawApiKey &&
    rawApiKey !== 'your_api_key' &&
    rawApiKey.length > 10 &&
    rawProjectId &&
    rawProjectId !== 'your_project_id'
  );
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured()) {
  try {
    const firebaseConfig = {
      apiKey: rawApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${rawProjectId}.firebaseapp.com`,
      projectId: rawProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${rawProjectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (e) {
    console.warn('Firebase initialization error:', e);
  }
}

export { app, auth };

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
