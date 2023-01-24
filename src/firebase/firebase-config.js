// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLHzVHC7pYn3oe_vTKAi9H1AJ_zgJ71PE",
  authDomain: "app-mantenimiento-91156.firebaseapp.com",
  projectId: "app-mantenimiento-91156",
  storageBucket: "app-mantenimiento-91156.appspot.com",
  messagingSenderId: "1093685550719",
  appId: "1:1093685550719:web:386bf2c7fdd00a599e694a",
  measurementId: "G-HES8CYTB0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);
export{app, auth, db, storage}