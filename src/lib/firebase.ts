import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Default config fallback in case firebase-applet-config.json is absent in clone
const DEFAULT_CONFIG = {
  projectId: "binriazgrill-8d55f",
  appId: "1:550006410236:web:df26e2228981e4150f4079",
  apiKey: "AIzaSyDC_q3bBANSuWnFfNdoKMmLRzMYb38nJJ0",
  authDomain: "binriazgrill-8d55f.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-6ec3e205-32b5-4bb2-af99-a3adabc67703",
  storageBucket: "binriazgrill-8d55f.firebasestorage.app",
  messagingSenderId: "550006410236",
  measurementId: "",
  oAuthClientId: "550006410236-en23rt2m5uhc0lrqgo4d7l4oou1gptsi.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

let loadedConfig = DEFAULT_CONFIG;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const externalConfig = await import('../../firebase-applet-config.json').then(m => m.default).catch(() => null);
  if (externalConfig) {
    loadedConfig = { ...DEFAULT_CONFIG, ...externalConfig };
  }
} catch {
  // Graceful fallback to default config
}

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  app = getApps().length === 0 ? initializeApp(loadedConfig) : getApps()[0];
  db = loadedConfig.firestoreDatabaseId
    ? getFirestore(app, loadedConfig.firestoreDatabaseId)
    : getFirestore(app);
  auth = getAuth(app);
} catch (err) {
  console.warn('Firebase primary initialization warning:', err);
  app = getApps().length === 0 ? initializeApp(DEFAULT_CONFIG) : getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth };
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
