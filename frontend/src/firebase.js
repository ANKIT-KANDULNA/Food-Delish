import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKaXCWQlpxgMbccnE4haPmcZptqvshqG0",
  authDomain: "fooddelish-3284a.firebaseapp.com",
  projectId: "fooddelish-3284a",
  storageBucket: "fooddelish-3284a.firebasestorage.app",
  messagingSenderId: "242244897941",
  appId: "1:242244897941:web:850dde2bf68854f1031f9c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();