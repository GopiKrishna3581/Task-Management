// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDV33-s15uvQtwCHCdKfuiqCPoDbIZfYho",
  authDomain: "task-manager-1dba3.firebaseapp.com",
  projectId: "task-manager-1dba3",
  storageBucket: "task-manager-1dba3.appspot.com",
  messagingSenderId: "89234577375",
  appId: "1:89234577375:web:6744fbd428227756d2d66a",
  measurementId: "G-F56X8H5JR0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
