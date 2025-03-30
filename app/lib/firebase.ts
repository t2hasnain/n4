// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For production, these should be in environment variables
const firebaseConfig = {
  apiKey: "AIzaSyCODlyZt50HuI0aATAQko3is7eGO9M9gro",
  authDomain: "fexixo-adeb6.firebaseapp.com",
  databaseURL: "https://fexixo-adeb6-default-rtdb.firebaseio.com",
  projectId: "fexixo-adeb6",
  storageBucket: "fexixo-adeb6.firebasestorage.app",
  messagingSenderId: "87713372568",
  appId: "1:87713372568:web:ba0829a0be32a3409173ed",
  measurementId: "G-N15DJVDC5R"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const realtime = getDatabase(app);

// Helper function to sign in with admin credentials
export const signInAsAdmin = async () => {
  try {
    await signInWithEmailAndPassword(auth, "hasnainff9999@gmail.com", "admin");
    return true;
  } catch (error) {
    console.error("Error signing in as admin:", error);
    return false;
  }
};

export { db, storage, auth, realtime as rtdb, firebaseConfig }; 