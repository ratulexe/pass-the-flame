const CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const EMULATOR_PORT = 8080;

async function connect() {
  const [{ initializeApp }, firestore] = await Promise.all([
    import('firebase/app'),
    import('firebase/firestore/lite'),
  ]);
  const db = firestore.getFirestore(initializeApp(CONFIG));
  if (import.meta.env.VITE_USE_FIRESTORE_EMULATOR === 'true') {
    firestore.connectFirestoreEmulator(db, 'localhost', EMULATOR_PORT);
  }
  return { db, ...firestore };
}

let connection = null;

/** Loads Firebase on first use, so the first screen does not wait for it. */
export function loadFirestore() {
  connection ??= connect().catch((error) => {
    connection = null;
    throw error;
  });
  return connection;
}
