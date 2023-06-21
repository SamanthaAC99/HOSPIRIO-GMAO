// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCscs3BArDRNj2UKv5RfkwzpWXv7htUjps",
  authDomain: "software-hospirio.firebaseapp.com",
  projectId: "software-hospirio",
  storageBucket: "software-hospirio.appspot.com",
  messagingSenderId: "177583488246",
  appId: "1:177583488246:web:b587c6bd1b35c2222e80d7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);
export{app, auth, db, storage}