import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, googleProvider, loginWithGoogle, logoutUser, onAuthStateChanged } from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState({
    title: 'Sign in with Google Required',
    message: 'Please sign in or register with Google to access direct fund links, partner contacts, and intelligence features.',
    targetUrl: null
  });
  const [pendingCallback, setPendingCallback] = useState(null);

  // Subscribe to Firebase Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
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

  // Sign In with Google
  const signInGoogle = async () => {
    const { user, error } = await loginWithGoogle();
    if (user) {
      setAuthModalOpen(false);

      // If there was a targetUrl or pending callback, execute it immediately
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
    return await logoutUser();
  };

  // Helper to guard any link click or action
  const requireAuth = useCallback((e, targetUrlOrAction, options = {}) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentUser) {
      if (typeof targetUrlOrAction === 'string') {
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
        onSuccess: () => window.open(targetUrlOrAction, '_blank', 'noopener,noreferrer')
      });
    } else if (typeof targetUrlOrAction === 'function') {
      openAuthModal({
        title: options.title || 'Google Sign-In Required',
        message: options.message || 'Sign in with Google to complete this action.',
        onSuccess: targetUrlOrAction
      });
    }
    return false;
  }, [currentUser, openAuthModal]);

  const value = {
    currentUser,
    loading,
    authModalOpen,
    authIntent,
    openAuthModal,
    closeAuthModal,
    signInGoogle,
    signOut,
    requireAuth
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
