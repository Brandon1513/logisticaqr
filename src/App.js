import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import QRGenerator from "./pages/QRGenerator";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ManageUsers from "./pages/ManageUsers";
import FormUser from "./pages/FormUser";

function App() {
  const location = useLocation();
  const [rol, setRole] = useState(null);

  useEffect(() => {
    const currentState = location.state;
    if (currentState && currentState.rol) {
      setRole(currentState.rol);
    } else {
      // También puedes cargar el rol de localStorage si no está en el estado
      const storedRole = localStorage.getItem('rol');
      setRole(storedRole);
    }
  }, [location]);

  return (
    <div className="App">
      {location.pathname !== "/login" && <Header rol={rol} />} {/* Pasa el rol aquí */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/qr-generator" element={<QRGenerator />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/profile" element={<Profile />} />
        {rol === "Administrador" && (
          <Route path="/manage-users" element={<ManageUsers />} />
        )}
        <Route path="/create-user" element={<FormUser />} />
      </Routes>
    </div>
  );
}


function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
