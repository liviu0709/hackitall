// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDtNfaZRFXQ3yLm3MojNctgeL-ScNW7wTQ",
    authDomain: "hackitall-app-mcdonalds.firebaseapp.com",
    projectId: "hackitall-app-mcdonalds",
    storageBucket: "hackitall-app-mcdonalds.firebasestorage.app",
    messagingSenderId: "997781530422",
    appId: "1:997781530422:web:5cf523b091b2abd50af597",
    measurementId: "G-9SLEYLB5EE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };