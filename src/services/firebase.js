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
  collection,
  addDoc,
  getDocs
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

// Timeout helper to prevent Firestore SDK calls from hanging indefinitely
const withTimeout = (promise, ms = 4000) => {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
};

// Log User Activity to Firestore & Local Storage
export const logActivity = async (user, actionType, details = {}) => {
  if (!user) return;

  const nowIso = new Date().toISOString();
  const activityData = {
    uid: user.uid,
    userEmail: user.email,
    userName: user.displayName || user.email.split('@')[0],
    userPhoto: user.photoURL || '',
    actionType, // 'LOGIN' | 'FUND_VIEW' | 'EXTERNAL_LINK' | 'EXPORT_CSV' | 'EXPORT_JSON' | 'BOOKMARK' | 'COMPARE' | 'PLAYBOOK_VIEW' | 'CONTACT_SUBMIT'
    details,
    timestamp: nowIso
  };

  // 1. Local storage sync (immediate)
  try {
    const localActs = JSON.parse(localStorage.getItem('vc_admin_activities') || '[]');
    localActs.unshift({ ...activityData, id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6) });
    localStorage.setItem('vc_admin_activities', JSON.stringify(localActs.slice(0, 500)));
  } catch (e) {
    console.warn('Local activity log error:', e);
  }

  // 2. Firestore sync
  try {
    const actRef = collection(db, 'user_activities');
    await withTimeout(addDoc(actRef, activityData), 3500);
  } catch (err) {
    // Firestore rules or offline fallback
  }
};

// Record / Update User Profile on Login
export const recordUserProfile = async (user) => {
  if (!user) return;

  const nowIso = new Date().toISOString();
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    photoURL: user.photoURL || '',
    lastLoginAt: nowIso,
    provider: user.providerData?.[0]?.providerId || 'google.com'
  };

  // 1. Local storage registry sync
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
        registeredAt: nowIso,
        loginCount: 1
      });
    }
    localStorage.setItem('vc_admin_users', JSON.stringify(localUsers));
  } catch (e) {
    console.warn('Local user record error:', e);
  }

  // 2. Firestore user document update (Atomic Upsert)
  try {
    const userDocRef = doc(db, 'users', user.uid);
    await withTimeout(
      setDoc(
        userDocRef,
        {
          ...userData,
          registeredAt: userData.registeredAt || nowIso,
          updatedAt: nowIso
        },
        { merge: true }
      ),
      3500
    );
  } catch (err) {
    // Firestore rules fallback
    console.warn('Firestore setDoc notice:', err?.message || err);
  }

  // 3. Log the login activity
  await logActivity(user, 'LOGIN', { message: 'User authenticated via Google Account' });
};

// Save Imported Users (from CSV / JSON export or manual entry)
export const saveImportedUsers = async (newUsers) => {
  if (!Array.isArray(newUsers) || newUsers.length === 0) return 0;

  const nowIso = new Date().toISOString();
  let countAdded = 0;

  // 1. Save to local storage
  try {
    const localUsers = JSON.parse(localStorage.getItem('vc_admin_users') || '[]');
    newUsers.forEach((nu) => {
      const email = nu.email?.toLowerCase().trim();
      if (!email) return;

      const existingIndex = localUsers.findIndex(
        (u) => u.email?.toLowerCase() === email || (u.uid && u.uid === nu.uid)
      );

      const userRecord = {
        uid: nu.uid || 'usr_' + Math.random().toString(36).substring(2, 10),
        email: nu.email,
        displayName: nu.displayName || nu.name || email.split('@')[0],
        photoURL: nu.photoURL || '',
        registeredAt: nu.registeredAt || nu.createdAt || nowIso,
        lastLoginAt: nu.lastLoginAt || nu.lastSignIn || nowIso,
        loginCount: nu.loginCount || 1,
        provider: nu.provider || 'google.com'
      };

      if (existingIndex >= 0) {
        localUsers[existingIndex] = { ...localUsers[existingIndex], ...userRecord };
      } else {
        localUsers.push(userRecord);
        countAdded++;
      }
    });

    localStorage.setItem('vc_admin_users', JSON.stringify(localUsers));
  } catch (e) {
    console.error('Local import error:', e);
  }

  // 2. Sync to Firestore if accessible
  try {
    for (const nu of newUsers) {
      if (nu.uid) {
        const userDocRef = doc(db, 'users', nu.uid);
        await setDoc(userDocRef, nu, { merge: true });
      }
    }
  } catch (err) {
    console.warn('Firestore import sync warning:', err);
  }

  return countAdded;
};

// Fetch All Registered Users for Admin (with diagnostics & fallback)
export const getRegisteredUsers = async () => {
  let usersList = [];
  let firestoreStatus = 'connected';
  let firestoreError = null;

  // 1. Try Firestore first
  try {
    const q = collection(db, 'users');
    const snapshot = await withTimeout(getDocs(q), 4000);
    if (!snapshot.empty) {
      usersList = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          uid: data.uid || d.id,
          displayName: data.displayName || 'Google User',
          email: data.email || 'N/A',
          photoURL: data.photoURL || '',
          registeredAt: data.registeredAt || data.createdAt || new Date().toISOString(),
          lastLoginAt: data.lastLoginAt || data.updatedAt || new Date().toISOString(),
          loginCount: data.loginCount || 1,
          provider: data.provider || 'google.com'
        };
      });
    }
  } catch (e) {
    firestoreStatus = 'error';
    const isPermDenied =
      e?.code === 'permission-denied' ||
      e?.message?.includes('permission-denied') ||
      e?.message?.includes('Missing or insufficient permissions');

    firestoreError = isPermDenied
      ? 'Firestore Permission Denied (Update Firestore Security Rules)'
      : e?.message || 'Unable to reach Firestore database';
  }

  // 2. Merge local storage users
  try {
    const localUsers = JSON.parse(localStorage.getItem('vc_admin_users') || '[]');
    localUsers.forEach((lu) => {
      if (
        !usersList.some(
          (u) =>
            (u.uid && u.uid === lu.uid) ||
            (u.email && u.email.toLowerCase() === lu.email?.toLowerCase())
        )
      ) {
        usersList.push(lu);
      }
    });
  } catch (e) {
    console.warn('Local users parse error:', e);
  }

  // 3. Guarantee currently authenticated user is in the list
  if (auth.currentUser) {
    const cur = auth.currentUser;
    const curEmail = cur.email?.toLowerCase();
    const existing = usersList.find(
      (u) => (u.uid && u.uid === cur.uid) || (u.email && u.email.toLowerCase() === curEmail)
    );

    if (existing) {
      existing.displayName = cur.displayName || existing.displayName;
      existing.photoURL = cur.photoURL || existing.photoURL;
      existing.email = cur.email || existing.email;
    } else {
      usersList.unshift({
        id: cur.uid,
        uid: cur.uid,
        displayName: cur.displayName || cur.email?.split('@')[0] || 'Admin User',
        email: cur.email,
        photoURL: cur.photoURL || '',
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        loginCount: 1,
        provider: 'google.com'
      });
    }
  }

  // Sort newest first
  usersList.sort(
    (a, b) =>
      new Date(b.lastLoginAt || b.registeredAt || 0) -
      new Date(a.lastLoginAt || a.registeredAt || 0)
  );

  return {
    users: usersList,
    firestoreStatus,
    firestoreError
  };
};

// Fetch User Activities for Admin
export const getUserActivities = async () => {
  let activitiesList = [];
  let firestoreStatus = 'connected';
  let firestoreError = null;

  try {
    const q = collection(db, 'user_activities');
    const snapshot = await withTimeout(getDocs(q), 4000);
    if (!snapshot.empty) {
      activitiesList = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          timestamp: data.timestamp || data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString()
        };
      });
    }
  } catch (e) {
    firestoreStatus = 'error';
    firestoreError = e?.message || 'Firestore query error';
  }

  // Merge local activities
  try {
    const localActs = JSON.parse(localStorage.getItem('vc_admin_activities') || '[]');
    localActs.forEach((la) => {
      if (!activitiesList.some((a) => a.id === la.id)) {
        activitiesList.push(la);
      }
    });
  } catch (e) {
    console.warn('Local activities parse error:', e);
  }

  activitiesList.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

  return {
    activities: activitiesList,
    firestoreStatus,
    firestoreError
  };
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
