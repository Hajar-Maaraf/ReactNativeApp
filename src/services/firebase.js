// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKDpj5Bxgy9u951hdHnZfOfPUtfRIDcj8",
  authDomain: "sweetbloom-6d485.firebaseapp.com",
  projectId: "sweetbloom-6d485",
  storageBucket: "sweetbloom-6d485.firebasestorage.app",
  messagingSenderId: "403575595136",
  appId: "1:403575595136:web:3b677bd4012b6f4e0c8665"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication based on platform
let auth;
if (Platform.OS === 'web') {
  // For web, use getAuth without persistence
  auth = getAuth(app);
} else {
  // For native (Android/iOS), use AsyncStorage persistence
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialize Firestore
const db = getFirestore(app);

export { auth, db, app };