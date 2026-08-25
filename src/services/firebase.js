import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCXqGC30QiEnjAZnO5rTEwRmNzDg99DOxg",
  authDomain: "global-and-indiavc.firebaseapp.com",
  projectId: "global-and-indiavc",
  storageBucket: "global-and-indiavc.firebasestorage.app",
  messagingSenderId: "242428250584",
  appId: "1:242428250584:web:d79cc13e867b6d02a0caad",
  measurementId: "G-5KEHS8KX4C"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return { user: null, error };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign-Out Error:', error);
    return { error };
  }
};

export { onAuthStateChanged };
