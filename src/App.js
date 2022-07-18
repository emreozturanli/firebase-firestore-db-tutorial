import { useEffect, useState } from "react";
import {db} from './firebase';
import {addDoc, collection,  getDocs, updateDoc, doc, deleteDoc} from 'firebase/firestore';


function App() {
  const [users,setUsers] = useState([]);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState(0);

  const usersCollectionRef = collection(db,'users')

  //CRUD-CREATE
  const createUser = async () => {
    try {
      const docRef = await addDoc(usersCollectionRef, {
        name: newName,
        age: Number(newAge)
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  //CRUD-UPDATE
  const updateUser = async (id,age) =>{
    const userDoc = doc(db, 'users', id) // which document we want to update
    const newFields = {age: age +1};  // which data we want to update
    await updateDoc(userDoc,newFields)
  }

  //CRUD- DELETE
  const deleteUser = async (id) =>{
    const userDoc = doc(db, 'users', id) // which document we want to update
    await deleteDoc(userDoc)
  }


  useEffect(()=>{
    const getUsers = async () =>{
      const data = await getDocs(usersCollectionRef)
      // console.log(data);
      // console.log(data.docs);
      // original data is so complicated. thus we write the code below
      setUsers(data.docs.map((doc)=>({...doc.data(), id : doc.id})))
      // console.log(users);
    } 

    getUsers()
  }, [usersCollectionRef]) 

  return (
    <div className="App">
      <input type="text" placeholder="name" onChange={(e)=> setNewName(e.target.value)}/>
      <input type="number" placeholder="age" onChange={(e)=> setNewAge(e.target.value)}/>
      <button onClick={createUser}>Create User</button>
      {
        users.map((user)=>{
          return <div key={user.id}>
            <h1>Name : {user.name}</h1>
            <h1>Age : {user.age}</h1>
            <button onClick={()=> updateUser(user.id,user.age)}>Increase Age</button>
            <button onClick={()=> deleteUser(user.id)}>Delete User</button>
          </div>
        })
      }
    </div>
  );
}

export default App;
