// using redirect info 

import { useEffect } from "react";
import { useUserStore } from "../store/userStore";
import { getRedirectResult } from "firebase/auth";
import { setDoc } from "firebase/firestore";

const authRedirect = () => {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const handleRedirect = async () => {
      const auth = getAuth();

      try {
        const result = await getRedirectResult(auth);
        if(!result) return;

        const firebaseUser = result.user;
        const uid = firebaseUser.uid;
        const email = firebaseUser.email;
        const displayName = firebaseUser.displayName;
        const photoURL = firebaseUser.photoURL;

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        let finalUser;

        if(userSnap.exists()) {
          finalUser = userSnap.data();
        } else {
          finalUser ={
            uid,
            email,
            name: displayName,
            photoURL,
            bio: "",
            profession: "",
          }
          await setDoc(userRef , finalUser)
        }
        setUser(finalUser);
 
      } catch (error) {
        console.error("Redirect problem" , error)
      }
      
    }

    handleRedirect();
  } ,[setUser] )
  return null;
}

export default authRedirect;