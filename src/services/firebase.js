// Importer les fonctions nécessaires depuis les SDKs
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// Configuration Firebase de votre application web
const firebaseConfig = {
  apiKey: "AIzaSyBKDpj5Bxgy9u951hdHnZfOfPUtfRIDcj8",
  authDomain: "sweetbloom-6d485.firebaseapp.com",
  projectId: "sweetbloom-6d485",
  storageBucket: "sweetbloom-6d485.firebasestorage.app",
  messagingSenderId: "403575595136",
  appId: "1:403575595136:web:3b677bd4012b6f4e0c8665"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser l'authentification Firebase selon la plateforme
let auth;
if (Platform.OS === 'web') {
  // Pour le web, utiliser getAuth sans persistance
  auth = getAuth(app);
} else {
  // Pour natif (Android/iOS), utiliser la persistance AsyncStorage
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialiser Firestore
const db = getFirestore(app);

export { auth, db, app };