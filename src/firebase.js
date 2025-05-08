// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAOyXtCcIRtGRiv_xKhNnSEExlbi2ToMy4",
  authDomain: "meet-over-weekend.firebaseapp.com",
  projectId: "meet-over-weekend",
  storageBucket: "meet-over-weekend.firebasestorage.app",
  messagingSenderId: "646488031525",
  appId: "1:646488031525:web:3e3a7fba0b7d214f4c1acc",
  measurementId: "G-0LKJBZGM1G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db , auth};