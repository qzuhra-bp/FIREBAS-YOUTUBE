// src/api/firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "ТВОЙ_API_KEY",
  authDomain: "ТВОЙ_AUTH_DOMAIN",
  projectId: "ТВОЙ_PROJECT_ID",
  storageBucket: "ТВОЙ_STORAGE_BUCKET",
  messagingSenderId: "ТВОЙ_MESSAGING_SENDER_ID",
  appId: "ТВОЙ_APP_ID"
};

export const app = initializeApp(firebaseConfig);