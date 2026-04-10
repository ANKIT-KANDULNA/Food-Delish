import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBKaXCWQlpxgMbccnE4haPmcZptqvshqG0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fooddelish-3284a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fooddelish-3284a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fooddelish-3284a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "242244897941",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:242244897941:web:850dde2bf68854f1031f9c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();