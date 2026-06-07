import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQ6aY2xWuUZ0SkLIMkhLhNYTzVWlTTtL8",
  authDomain: "nirvaha-auth.firebaseapp.com",
  projectId: "nirvaha-auth",
  storageBucket: "nirvaha-auth.firebasestorage.app",
  messagingSenderId: "295907364116",
  appId: "1:295907364116:web:8d1e42f58891238298c601",
  measurementId: "G-QGMVEDC627",
};

// Initialize Firebase
const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];

// Analytics
export const analytics = getAnalytics(app);

// Authentication
export const auth = getAuth(app);

// Google Provider
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});
export const githubProvider = new GithubAuthProvider();

export default app;