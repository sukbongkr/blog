// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClXJ9gAS603aM-LqmMNHCrlVeSiatcBso",
  authDomain: "sns-project-35fdc.firebaseapp.com",
  projectId: "sns-project-35fdc",
  storageBucket: "sns-project-35fdc.appspot.com",
  messagingSenderId: "228822965708",
  appId: "1:228822965708:web:405ab475a2d776d7405169",
  measurementId: "G-2RYQ83N8RS"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
//const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

