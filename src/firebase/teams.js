import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where,arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firebaseConfig";
import toast from "react-hot-toast";

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

export const joinTeam = async(inviteCode , userId) => {
  console.log("Firebase 1")
  const thing = query(collection(db , "teams") , where("inviteCode" , "==" , inviteCode))
  console.log("Firebase 2")

  const querySnapshort = await getDocs(thing);
  console.log("Firebase 3")


  if (querySnapshort.empty) {
    toast.error("Team not found");
    return;
  }
  console.log("Firebase 4")

  const teamDoc = querySnapshort.docs[0]
  const teamId = teamDoc.id
  console.log("Firebase 5")

//  const userRef = doc(db, "users", userId);
//  const userSnap = await userRef.get();
//  const userData = userSnap.data();
//  const updatedTeamIds = [...(userData.teamIds || []), teamId];
//
//  await updateDoc(userRef, { teamIds: updatedTeamIds });


//* thhis updateForUser is defined before this func.

await updateForUser(userId, {
  teamIds: arrayUnion(teamId),
});
console.log("Firebase 6")


await updateDoc(doc(db, "teams", teamId), {
  memberIds: arrayUnion(userId),
});
console.log("Firebase 7")

return getTeamById(teamId);

}