import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "coder-backend-course.firebaseapp.com",
  projectId: "coder-backend-course",
  storageBucket: "coder-backend-course.appspot.com",
  messagingSenderId: "403134413482",
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
