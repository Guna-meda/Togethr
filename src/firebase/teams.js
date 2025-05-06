import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firebaseConfig";


export const createTeam = async (name , bio , creatorUid) => {
  const inviteCode = uuidv4().split("-")[0] ;
  const newTeamRef= doc(collection(db , "teams"));

  const teamData = {
    name,
    bio,
    inviteCode,
    members: [creatorUid],
  };

  await setDoc(newTeamRef ,teamData);
  return {id: newTeamRef.id , ...teamData}
}

export const getTeamById = async (id) => {
  const docRef = doc(db,"teams" , id)
  const docSnap = await getDoc(docRef);
  if(!docSnap.exists()) return null;
  return {id:docSnap.id , ...docSnap.data()} 
}

export const updateForUser = async (uid , updates) => {
  const userRef = doc(db , "users" , uid)
  await updateDoc(userRef , updates);
}