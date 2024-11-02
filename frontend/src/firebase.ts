// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_kEY,
  authDomain: "mern-realtour.firebaseapp.com",
  projectId: "mern-realtour",
  storageBucket: "mern-realtour.appspot.com",
  messagingSenderId: "192940665611",
  appId: "1:192940665611:web:ac64c382b3322d1a3c500e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
