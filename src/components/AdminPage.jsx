import { useDispatch, useSelector } from "react-redux";
import { readUsers } from "../redux/userSlice";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { app } from "../FireBase";

const db = getFirestore(app);

const AdminPage = () => {
  const userList = useSelector((state) => state.user.users);

  const handleAddUsers = () => {
    addUser();
  };

  const addUser = () => {
    userList.map(async (user) => {
      try {
        const docRef = await addDoc(collection(db, "users"), {
          name: user,
          isSelected: false,
          isPlayed: false,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <>
      <div>
        <button onClick={handleAddUsers}>Add Users to Firestore</button>
      </div>
    </>
  );
};

export default AdminPage;
