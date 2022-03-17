// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK5s6n2-yFsywPziC0Cl0rIYmd0g0Zksw",
  authDomain: "proyecto-final-comercio.firebaseapp.com",
  projectId: "proyecto-final-comercio",
  storageBucket: "proyecto-final-comercio.appspot.com",
  messagingSenderId: "244376373179",
  appId: "1:244376373179:web:6bf1a3cc16c0bb84fda69e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);
