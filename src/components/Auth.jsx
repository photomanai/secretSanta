import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActiveUser, readUsers } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const fullUsers = useSelector((state) => state.user.fullUsers); // fullUsers'ı alıyoruz
  const loading = useSelector((state) => state.user.loading); // Yükleniyor durumu
  const navigate = useNavigate();

  useEffect(() => {
    // Eğer fullUsers boşsa, readUsers'ı çağırıyoruz
    if (fullUsers.length === 0) {
      dispatch(readUsers());
    }
  }, [dispatch, fullUsers.length]);

  // Oynamayan kullanıcıları filtreliyoruz
  const usersToDisplay = fullUsers.filter((user) => !user.data.isPlayed);

  const handleName = (user) => {
    setName(user);
  };

  const handleSubmit = () => {
    if (!name) {
      alert("adınızı seçin");
    } else {
      dispatch(getActiveUser(name));
      navigate("/"); // Navigate to the main page
    }
  };

  if (loading) {
    return <div>Səbr gözəl şeydi...</div>; // Veriler yükleniyorsa
  }

  if (usersToDisplay.length === 0) {
    return <div>Problem varsa Adilə deyin!</div>; // Oynamayan kullanıcı yoksa
  }

  return (
    <div>
      <div className="form">
        <h1>Hörmətli Insanlar, zəhmət olmasa aşağı hissədə adınızı seçin.</h1>
        {usersToDisplay.map((user, index) => (
          <button
            onClick={() => handleName(user.data.name)} // Kullanıcıyı seç
            key={index}
          >
            {user.data.name} {/* Kullanıcının ismini göster */}
          </button>
        ))}
        <div>
          <h2>{name}</h2>
          <button onClick={handleSubmit} className="submit">
            Göndər
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
