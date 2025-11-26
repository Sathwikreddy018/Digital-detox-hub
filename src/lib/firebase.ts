// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// If you really want analytics, you can import this too,
// but it's optional and NOT required for login/signup.
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB-L3gDgQJyM0LDZvwaib4D1MXDILm8Tv8",
  authDomain: "digital-detox-d8a86.firebaseapp.com",
  projectId: "digital-detox-d8a86",
  storageBucket: "digital-detox-d8a86.firebasestorage.app",
  messagingSenderId: "509414623140",
  appId: "1:509414623140:web:e672d8f17737805434e331",
  measurementId: "G-C44VP4R63J"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export the Auth instance so AuthContext can use it
export const auth = getAuth(app);

// Analytics (optional)
export const analytics = getAnalytics(app);
