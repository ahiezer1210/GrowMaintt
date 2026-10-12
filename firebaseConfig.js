import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAd-YVlRDhh93tYKnoiMOltmCG8qQzutr8",
  authDomain: "growmaint.firebaseapp.com",
  projectId: "growmaint",
  storageBucket: "growmaint.firebasestorage.app",
  messagingSenderId: "725262386313",
  appId: "1:725262386313:web:bb422b9c710ae369447258",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
