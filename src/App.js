import React, { useState } from "react";
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
  const [role, setRole] = useState("admin"); // o "employee", dependiendo de la lógica de autenticación

  return (
    <div className="App">
      {location.pathname !== "/login" && <Header role={role} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/qr-generator" element={<QRGenerator />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/profile" element={<Profile />} />
        {role === "admin" && (
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
