import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc} from "firebase/firestore"
import { db } from "./firebaseConfig"

export const createTask = async (teamId , taskData) => {
const taskRef= collection(db, "teams" ,teamId ,  "tasks" )
const newTask= await addDoc(taskRef , {
  ...taskData ,timestamp: serverTimestamp(),
})
return newTask.id;
};

export const listenToTask = (teamId , callback) => {
  const q = query(
    collection(db , "teams" ,teamId , "tasks") , 
    orderBy("timestamp" ,"desc")
  )
  return onSnapshot(q , (snapshot)=>{
    const tasks = snapshot.docs.map((doc) => ({
      id:doc.id , 
      ...doc.data(),
    }))
    callback(tasks)
  })
} 

export const updateTask = async(teamId ,taskId ,updates) => {
  const taskRef = doc(db , "teams" , teamId , "tasks" , taskId)
  await updateDoc(taskRef , updates)
}

export const deleteTask = async (teamId , taskId) => {
  const taskRef = doc(db , "teams" , teamId , "tasks" , taskId)
  await deleteDoc(taskRef)
}

// change this bs logic if u ever had to scale . scale?lol
export const getUserByIds = async(userIds) => {
  const users =[]
  for (const uid of userIds) {
    const userRef = doc(db, "users", uid); 
    const userdoc = await getDoc(userRef);  
      if(userdoc.exists()) {
      users.push({ id: uid, ...userdoc.data() });
    }
  }
  return users
}