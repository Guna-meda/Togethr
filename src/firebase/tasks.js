import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc} from "firebase/firestore"
import { db } from "./firebaseConfig"

export const createTask = async (teamId , taskData) => {
const taskRef= collection(db, "teams" ,teamId ,  "tasks" )
const newTask= await addDoc(taskRef , {
  ...taskData , timestamp : Date.now()
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