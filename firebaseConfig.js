import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDKp7DZW019MZZfDs7FtbiZGJIjXMoOXXw",
  authDomain: "servi-570bc.firebaseapp.com",
  projectId: "servi-570bc",
  storageBucket: "servi-570bc.firebasestorage.app",
  messagingSenderId: "526914149130",
  appId: "1:526914149130:web:955825e8634c773ff2f8f3"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore (app);

export { db };