import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyACOoG3GZLfURHAUkxNWDJ6UCievYAJ7L8",
  authDomain: "qohumsecretsanta.firebaseapp.com",
  projectId: "qohumsecretsanta",
  storageBucket: "qohumsecretsanta.firebasestorage.app",
  messagingSenderId: "905088105708",
  appId: "1:905088105708:web:598aa0c93b0fe2a33a79c9",
  measurementId: "G-9DSJTJFMRE",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
