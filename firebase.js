// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCE2gzXEWWcSfh146cUJMSvppM9ORBb2EY",
  authDomain: "shadow-app-pwa.firebaseapp.com",
  projectId: "shadow-app-pwa",
  storageBucket: "shadow-app-pwa.appspot.com",
  messagingSenderId: "446689795223",
  appId: "1:446689795223:web:6feb71d1b7b823200a9dd2",
  measurementId: "G-55P561HDB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);