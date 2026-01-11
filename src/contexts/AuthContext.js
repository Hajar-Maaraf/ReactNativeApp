// AuthContext pour l'application SweetBloom.
// Objectif : gérer l'utilisateur connecté avec Firebase Authentication (email/password).
// Implémente :
// - const AuthContext = createContext()
// - fonction AuthProvider({ children }) qui :
//   - garde dans un state : user, loading
//   - écoute onAuthStateChanged(auth, ...) pour mettre à jour user
//   - expose les fonctions : login(email, password), register(email, password), logout()
//   - fournit { user, loading, login, register, logout } via AuthContext.Provider
// Utilise les fonctions de Firebase Auth : signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut.

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../services/firebase';

export const AuthContext = createContext();

// Mode démo - définir à true pour contourner l'authentification Firebase pour les tests
// Mettez DEMO_MODE = true si Firebase n'est pas configuré
const DEMO_MODE = false;
const DEMO_USER = { email: 'demo@sweetbloom.com', uid: 'demo-user-123' };

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) {
      console.log('Demo mode active - Firebase auth bypassed');
      setLoading(false);
      return;
    }

    console.log('Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser ? currentUser.email : 'No user');
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (DEMO_MODE) {
      console.log('Demo login:', email);
      setUser({ ...DEMO_USER, email });
      return { user: { ...DEMO_USER, email } };
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password) => {
    if (DEMO_MODE) {
      console.log('Demo register:', email);
      setUser({ ...DEMO_USER, email });
      return { user: { ...DEMO_USER, email } };
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (DEMO_MODE) {
      console.log('Demo logout');
      setUser(null);
      return;
    }
    try {
      console.log('Firebase logout called');
      await signOut(auth);
      console.log('signOut completed - waiting for auth state change');
      // Le listener onAuthStateChanged mettra user à null automatiquement
    } catch (error) {
      console.error('Error during signOut:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    signOut: logout, // Alias pour compatibilité avec ProfileScreen
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};