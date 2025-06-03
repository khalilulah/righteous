// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: "store-manager-8657f.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // Get Firebase Storage instance

export { storage };
export default app;
