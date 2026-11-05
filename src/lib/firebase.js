const CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const EMULATOR_PORT = 8080;

/** Runs `connect` once on first use, and again if the last attempt failed. */
export function once(connect) {
  let connection = null;
  return () => {
    connection ??= connect().catch((error) => {
      connection = null;
      throw error;
    });
    return connection;
  };
}

/** Firebase loads on first use, so the first screen does not wait for it. */
export const loadFirebaseApp = once(async () => {
  const { initializeApp } = await import('firebase/app');
  return initializeApp(CONFIG);
});

export const loadFirestore = once(async () => {
  const [app, firestore] = await Promise.all([
    loadFirebaseApp(),
    import('firebase/firestore/lite'),
  ]);
  const db = firestore.getFirestore(app);
  if (import.meta.env.VITE_USE_FIRESTORE_EMULATOR === 'true') {
    firestore.connectFirestoreEmulator(db, 'localhost', EMULATOR_PORT);
  }
  return { db, ...firestore };
});
