import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

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

// Initialize Firestore Database
export const db = getFirestore(app);

// Admin Configuration
export const ADMIN_EMAIL = 'kalyanjit@gmail.com';

export const isAdminUser = (user) => {
  if (!user || !user.email) return false;
  return user.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
};

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Log User Activity to Firestore & Local Storage
export const logActivity = async (user, actionType, details = {}) => {
  if (!user) return;

  const activityData = {
    uid: user.uid,
    userEmail: user.email,
    userName: user.displayName || user.email.split('@')[0],
    userPhoto: user.photoURL || '',
    actionType, // 'LOGIN' | 'FUND_VIEW' | 'EXTERNAL_LINK' | 'EXPORT_CSV' | 'EXPORT_JSON' | 'BOOKMARK' | 'COMPARE' | 'CONTACT_SUBMIT'
    details,
    timestamp: new Date().toISOString()
  };

  // Local sync
  try {
    const localActs = JSON.parse(localStorage.getItem('vc_admin_activities') || '[]');
    localActs.unshift({ ...activityData, id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4) });
    localStorage.setItem('vc_admin_activities', JSON.stringify(localActs.slice(0, 500)));
  } catch (e) {
    console.error('Local activity log error:', e);
  }

  // Firestore sync
  try {
    const actRef = collection(db, 'user_activities');
    await addDoc(actRef, {
      ...activityData,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    // Graceful fallback to local tracking if firestore rules are locked
  }
};

// Record / Update User Profile on Login
export const recordUserProfile = async (user) => {
  if (!user) return;

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    photoURL: user.photoURL || '',
    lastLoginAt: new Date().toISOString(),
    provider: user.providerData?.[0]?.providerId || 'google.com'
  };

  // Local storage registry sync
  try {
    const localUsers = JSON.parse(localStorage.getItem('vc_admin_users') || '[]');
    const existingIndex = localUsers.findIndex(u => u.uid === user.uid || u.email === user.email);
    if (existingIndex >= 0) {
      localUsers[existingIndex] = {
        ...localUsers[existingIndex],
        ...userData,
        loginCount: (localUsers[existingIndex].loginCount || 1) + 1
      };
    } else {
      localUsers.unshift({
        ...userData,
        registeredAt: new Date().toISOString(),
        loginCount: 1
      });
    }
    localStorage.setItem('vc_admin_users', JSON.stringify(localUsers));
  } catch (e) {
    console.error('Local user record error:', e);
  }

  // Firestore user document update
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      await setDoc(userDocRef, {
        ...userData,
        registeredAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        loginCount: 1
      });
    } else {
      await setDoc(userDocRef, {
        ...userData,
        lastLoginAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (err) {
    // Firestore rules fallback
  }

  // Log the login activity
  await logActivity(user, 'LOGIN', { message: 'User logged in via Google Authentication' });
};

// Fetch All Registered Users for Admin
export const getRegisteredUsers = async () => {
  let usersList = [];

  // Try Firestore first
  try {
    const q = query(collection(db, 'users'), limit(200));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      usersList = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        registeredAt: d.data().registeredAt?.toDate?.()?.toISOString?.() || d.data().registeredAt || new Date().toISOString(),
        lastLoginAt: d.data().lastLoginAt?.toDate?.()?.toISOString?.() || d.data().lastLoginAt || new Date().toISOString()
      }));
    }
  } catch (e) {
    // fallback to local storage
  }

  // Fallback / merge local users
  try {
    const localUsers = JSON.parse(localStorage.getItem('vc_admin_users') || '[]');
    localUsers.forEach(lu => {
      if (!usersList.some(u => u.uid === lu.uid || u.email === lu.email)) {
        usersList.push(lu);
      }
    });
  } catch (e) {}

  return usersList.sort((a, b) => new Date(b.lastLoginAt || 0) - new Date(a.lastLoginAt || 0));
};

// Fetch User Activities for Admin
export const getUserActivities = async () => {
  let activitiesList = [];

  try {
    const q = query(collection(db, 'user_activities'), orderBy('createdAt', 'desc'), limit(300));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      activitiesList = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        timestamp: d.data().createdAt?.toDate?.()?.toISOString?.() || d.data().timestamp || new Date().toISOString()
      }));
    }
  } catch (e) {
    // fallback to local storage
  }

  try {
    const localActs = JSON.parse(localStorage.getItem('vc_admin_activities') || '[]');
    localActs.forEach(la => {
      if (!activitiesList.some(a => a.id === la.id)) {
        activitiesList.push(la);
      }
    });
  } catch (e) {}

  return activitiesList.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await recordUserProfile(result.user);
    }
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
