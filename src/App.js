import { useEffect, useState } from "react";
import "./App.css";
import { db } from "./firebase-config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { async } from "@firebase/util";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  // firestore collection reference
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    };

    getUsers();
  });

  const createUser = async () => {
    await addDoc(usersCollectionRef, { name: name, age: age });
  };

  const updateUser = async (id, prevAge) => {
    // getting specific user document with user ID
    const userDoc = doc(db, "users", id);
    prevAge = parseInt(prevAge);
    const newFields = {
      age: prevAge + 1,
    };
    await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    deleteDoc(userDoc);
  };

  return (
    <div className="App">
      <input
        placeholder="name"
        type="text"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="age"
        type="number"
        onChange={(e) => setAge(e.target.value)}
      />
      <button onClick={createUser}>create user</button>
      {users.map((user) => {
        return (
          <div>
            <h1>Name: {user.name}</h1> <h1>Age:{user.age}</h1>
            <button
              onClick={() => {
                updateUser(user.id, user.age);
              }}
            >
              Increase Age
            </button>
            <button
              onClick={() => {
                deleteUser(user.id);
              }}
            >
              Delete user
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
