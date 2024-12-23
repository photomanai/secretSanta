import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSelectedUsers,
  userIsPlayed,
  userIsSelected,
} from "../redux/userSlice";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { app } from "../FireBase";

const db = getFirestore(app);

const SecretSantaPage = () => {
  const [isActive, setIsActive] = useState(true);
  const [selectedUser, setSelectedUser] = useState("");
  const dispatch = useDispatch();
  const { activeUser, selectedUsers, loading } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getSelectedUsers());
  }, [dispatch]);

  const handleActive = () => {
    getRandomUser();
    setIsActive(!isActive);
  };

  const getRandomUser = () => {
    // Kendini seçmeyi engellemek için activeUser'ı dışarıda tutuyoruz
    const filteredUsers = selectedUsers.filter(
      (user) => user.data.name !== activeUser
    );

    // Filtrelenmiş kullanıcılar arasından rastgele seçim yapıyoruz
    const randomIndex = Math.floor(Math.random() * filteredUsers.length);
    const randomUser = filteredUsers[randomIndex];
    setSelectedUser(randomUser.data.name);

    // Seçilen kullanıcıyı güncelle
    gift(randomUser.data.name);
    dispatch(userIsSelected(randomUser.data.name));
    dispatch(userIsPlayed(activeUser));
  };
  const gift = (name) => {
    const user_info = { open: activeUser, gift: name };

    const addUser = async () => {
      try {
        const docRef = await addDoc(collection(db, "gifts"), {
          open: user_info.open,
          gift: user_info.gift,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error(e.message);
      }
    };

    // addUser fonksiyonunu çağırın
    addUser();
  };

  if (loading) {
    return <div>Səbr gözəl şeydi...</div>;
  }

  return (
    <>
      <div className="main">
        <button onClick={handleActive}>Oyuna Başla</button>
      </div>
      <div className={`popup ${isActive ? "deActive" : "active"}`}>
        <h1>Size Çıxan İnsan</h1>
        <h1>{selectedUser}</h1>
        {/* {selectedUser != "Adil" && (
          <p>
            bunu Adil duzeltdiyinə görə əlavə hədiyyədə ala bilərsən{" "}
            {activeUser} :)
          </p>
        )} */}
      </div>
    </>
  );
};

export default SecretSantaPage;
