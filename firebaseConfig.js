import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAd-YVlRDhh93tYKnoiMOltmCG8qQzutr8",
  authDomain: "growmaint.firebaseapp.com",
  projectId: "growmaint",
  storageBucket: "growmaint.firebasestorage.app",
  messagingSenderId: "725262386313",
  appId: "1:725262386313:web:bb422b9c710ae369447258",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

<<<<<<< HEAD
export { auth, db };
=======
export { auth, db };   
>>>>>>> 3f124ad4a202b9e60c4c014a9809279a9b2ece95
