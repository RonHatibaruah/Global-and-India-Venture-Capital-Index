import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  auth,
  googleProvider,
  loginWithGoogle,
  logoutUser,
  onAuthStateChanged,
  recordUserProfile,
  logActivity,
  isAdminUser,
  ADMIN_EMAIL
} from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState({
    title: 'Sign in with Google Required',
    message: 'Please sign in or register with Google to access direct fund links, partner contacts, and intelligence features.',
    targetUrl: null
  });
  const [pendingCallback, setPendingCallback] = useState(null);

  // Subscribe to Firebase Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await recordUserProfile(user);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openAuthModal = useCallback((options = {}) => {
    setAuthIntent({
      title: options.title || 'Google Authentication Required',
      message: options.message || 'Sign in with Google to unlock full fund profiles, official website portals, and verified investor tools.',
      targetUrl: options.targetUrl || null
    });
    if (options.onSuccess) {
      setPendingCallback(() => options.onSuccess);
    } else {
      setPendingCallback(null);
    }
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setPendingCallback(null);
  }, []);

  // Track user activity helper
  const trackActivity = useCallback(async (actionType, details = {}) => {
    if (currentUser) {
      await logActivity(currentUser, actionType, details);
    }
  }, [currentUser]);

  // Sign In with Google
  const signInGoogle = async () => {
    const { user, error } = await loginWithGoogle();
    if (user) {
      setAuthModalOpen(false);

      if (authIntent.targetUrl) {
        window.open(authIntent.targetUrl, '_blank', 'noopener,noreferrer');
      }
      if (pendingCallback) {
        pendingCallback(user);
        setPendingCallback(null);
      }
    }
    return { user, error };
  };

  // Sign Out
  const signOut = async () => {
    if (currentUser) {
      await logActivity(currentUser, 'LOGOUT', { message: 'User signed out' });
    }
    return await logoutUser();
  };

  // Helper to guard any link click or action with Google Authentication
  const requireAuth = useCallback((e, targetUrlOrAction, options = {}) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentUser) {
      if (typeof targetUrlOrAction === 'string') {
        trackActivity('EXTERNAL_LINK', { url: targetUrlOrAction, title: options.title || 'External Link' });
        window.open(targetUrlOrAction, '_blank', 'noopener,noreferrer');
      } else if (typeof targetUrlOrAction === 'function') {
        targetUrlOrAction(currentUser);
      }
      return true;
    }

    // User is not signed in: trigger auth modal
    if (typeof targetUrlOrAction === 'string') {
      openAuthModal({
        targetUrl: targetUrlOrAction,
        title: options.title || 'Sign In to Access Link',
        message: options.message || `Sign in or register with Google to access this link (${targetUrlOrAction}).`,
        onSuccess: (user) => {
          logActivity(user, 'EXTERNAL_LINK', { url: targetUrlOrAction, title: options.title || 'External Link' });
          window.open(targetUrlOrAction, '_blank', 'noopener,noreferrer');
        }
      });
    } else if (typeof targetUrlOrAction === 'function') {
      openAuthModal({
        title: options.title || 'Google Sign-In Required',
        message: options.message || 'Sign in with Google to complete this action.',
        onSuccess: targetUrlOrAction
      });
    }
    return false;
  }, [currentUser, openAuthModal, trackActivity]);

  const isAdmin = isAdminUser(currentUser);

  const value = {
    currentUser,
    isAdmin,
    adminEmail: ADMIN_EMAIL,
    loading,
    authModalOpen,
    authIntent,
    adminModalOpen,
    setAdminModalOpen,
    openAuthModal,
    closeAuthModal,
    signInGoogle,
    signOut,
    requireAuth,
    trackActivity
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
