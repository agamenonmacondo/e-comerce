
// src/lib/firebase/firebaseConfig.ts
// IMPORTANT: Replace with your actual Firebase project configuration values.
// You can find these in your Firebase project console:
// Project settings > General > Your apps > SDK setup and configuration (Config option)

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  "projectId": "icommerce-ya7tu",
  "appId": "1:930956898744:web:2191c784ca4948bc09df4d",
  "storageBucket": "icommerce-ya7tu.appspot.com",
  "apiKey": "AIzaSyBow19I7eMfTCBqDdfWoOA975_OeyNdMLw",
  "authDomain": "icommerce-ya7tu.firebaseapp.com",
  "messagingSenderId": "930956898744"
};

let app: FirebaseApp;

// Initialize Firebase only if it hasn't been initialized yet
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); // Use the existing app if already initialized
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
