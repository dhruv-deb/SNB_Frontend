
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALq6Y6DMCgXG3qk1RnYWuU8QDliYBoJTQ",
  authDomain: "snb25-8a890.firebaseapp.com",
  projectId: "snb25-8a890",
  storageBucket: "snb25-8a890.firebasestorage.app",
  messagingSenderId: "890008685290",
  appId: "1:890008685290:web:c7728f84ea13ad17316593",
  measurementId: "G-HV3EB0M1LS"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Failed to set persistence:", error);
});


export {app, auth}