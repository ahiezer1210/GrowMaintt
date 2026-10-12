import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function getDestination(uid) {
  try {
    const snap = await getDoc(doc(db, "Users", uid));
    const data = snap.exists() ? snap.data() : {};

    if (data.termsAccepted !== true) return "/terms";
    if (data.identityVerified !== true) return "/identityverification";
    return "/(tabs)/home";
  } catch (error) {
    console.log("Error leyendo usuario:", error);
    return "/(tabs)/home";
  }
}