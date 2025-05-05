import { collection, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

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