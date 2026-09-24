// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "arvixai-9c1ed.firebaseapp.com",
  projectId: "arvixai-9c1ed",
  storageBucket: "arvixai-9c1ed.firebasestorage.app",
  messagingSenderId: "994855894201",
  appId: "1:994855894201:web:0447999121b326949a6f68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider= new GoogleAuthProvider()
