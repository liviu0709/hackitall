// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaxxx", // ← înlocuiește cu datele reale din Firebase Console
    authDomain: "nume-proiect.firebaseapp.com",
    projectId: "nume-proiect",
    storageBucket: "nume-proiect.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
