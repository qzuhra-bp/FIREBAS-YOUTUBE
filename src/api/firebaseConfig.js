// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiPyIZyo0ecyivUrNjK__MZkypI-OyQAg",
  authDomain: "lms-platform-2753a.firebaseapp.com",
  projectId: "lms-platform-2753a",
  storageBucket: "lms-platform-2753a.firebasestorage.app",
  messagingSenderId: "824452313358",
  appId: "1:824452313358:web:a99c204f06c0b34ef9e75f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);