import { addDoc, collection, getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import { app } from "../FireBase";

const db = getFirestore(app);

const KimKimedusub = () => {
  const [open, setOpen] = useState(""); // İlk input için state
  const [gift, setGift] = useState(""); // İkinci input için state

  const submit = async (e) => {
    e.preventDefault(); // Sayfa yenilenmesini engeller
    try {
      const docRef = await addDoc(collection(db, "who"), {
        open: open,
        gift: gift,
      });
      console.log("Belge ID'si: ", docRef.id);
    } catch (error) {
      console.error("Hata: ", error.message);
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>Sen Kimsen?</label>
          <input
            type="text"
            placeholder="Sen Kimsen?"
            value={open}
            onChange={(e) => setOpen(e.target.value)} // State'i günceller
          />
        </div>
        <div>
          <label>Kime Heddiye Alacaqsan?</label>
          <input
            type="text"
            placeholder="Kime Heddiye Alacaqsan?"
            value={gift}
            onChange={(e) => setGift(e.target.value)} // State'i günceller
          />
        </div>
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
};

export default KimKimedusub;
