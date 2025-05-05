import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "../store/userStore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const authListner = () => {
  const auth = getAuth();
  const setUser = useUserStore.getState().setUser;
  const clearUser = useUserStore.getState().clearUser;
  const setAuthLoading = useUserStore.getState().setAuthLoading;

  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      clearUser();
      setAuthLoading(false);
      return;
    }
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser(docSnap.data());
    } else {
      console.warn("User logged in but no Firestore data found.");
      clearUser();
    }
    setAuthLoading(false);
  });
};
