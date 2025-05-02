import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "../store/userStore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const authListner = () => {
  const auth = getAuth();
  const setUser = useUserStore.getState().setUser;
  const clearUser = useUserStore.getState().clearUser;

  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    console.log("👀 AUTH STATE CHANGED:", firebaseUser);

    if (firebaseUser) {
      const docRef = doc(db, "users", firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        const newUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          bio: "",
          profession: "",
        };
        await setDoc(docRef, newUser);
        setUser(newUser);
      } else {
        setUser(docSnap.data());
      }
    } else {
      clearUser();
    }
  });

  return unsubscribe;
};
