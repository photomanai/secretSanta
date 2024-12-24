import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Auth from "./components/Auth";
import SecretSantaPage from "./components/SecretSantaPage";
import AdminPage from "./components/AdminPage";
import { useEffect } from "react";
import KimKimedusub from "./components/KimKimedusub";

function App() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   navigate("/auth");
  // }, []);

  return (
    <div>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<SecretSantaPage />} />
        <Route path="/who" element={<KimKimedusub />} />
      </Routes>
    </div>
  );
}

export default App;
