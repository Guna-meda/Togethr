import { createUserWithEmailAndPassword, deleteUser, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect, signOut } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

//signup
export const signUpWithEmail = async (email , password , name) => {
  const auth = getAuth();

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    const userData = {
      uid: user.uid,
      email: user.email,
      name: name,
      bio: " ",
      profession: "",
      photoURL: "",
    };

    await setDoc(doc(db, "users", user.uid), userData);
    return userData;
  } catch (err) {
    console.error("Sign up error:", err.message);
    throw err;
  }
}


//signin
export const loginWithEmail = async (email , password) => {
  const auth = getAuth();

  try {
    const result = await signInWithEmailAndPassword(auth , email , password);
    const user = result.user;
    const docRef = doc(db , "users" , user.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err) {
    console.error("Login error:", err.message);
    throw err;
  }
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

//! login with redirect
//export const loginLogic = () => {
//  sessionStorage.setItem("justRedirected", "true");
//  const provider = new GoogleAuthProvider();
//  const auth = getAuth();
//  signInWithRedirect(auth , provider);
//}
