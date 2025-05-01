import { deleteUser, getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth"
import { doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// login 
export const loginLogic = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  signInWithRedirect(auth , provider);
}

//logout 
export const logout = async () => {
  const auth = getAuth();
  await signOut(auth);
}

//delete
export const deleteAcc = async (uid) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if(user) {
    await deleteUser(user) ;
    await deleteDoc(doc(db , "users" , uid))
  }
}