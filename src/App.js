import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import QRGenerator from "./pages/QRGenerator";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ManageUsers from "./pages/ManageUsers";
import FormUser from "./pages/FormUser";
import ConsultaActivos from "./pages/ConsultaActivo";
import EditQR from "./pages/EditQR";
function App() {
  const location = useLocation();
  const [rol, setRole] = useState(null);
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    const currentState = location.state;
    if (currentState && currentState.rol) {
      setRole(currentState.rol);
    } else {
      const storedRole = localStorage.getItem("rol");
      setRole(storedRole);
    }
  }, [location]);

  return (
    <div className="App">
      {location.pathname !== "/" && <Header rol={rol} />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/" replace />}
        />
        <Route
          path="/qr-generator"
          element={token ? <QRGenerator /> : <Navigate to="/" replace />}
        />
        <Route
          path="/editProfile"
          element={token ? <EditProfile /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/" replace />}
        />
        {rol === "Administrador" && (
          <Route
            path="/manage-users"
            element={token ? <ManageUsers /> : <Navigate to="/" replace />}
          />
        )}
        <Route
          path="/edit-qr/:id"
          element={token ? <EditQR /> : <Navigate to="/" />}
        />
        <Route
          path="/create-user"
          element={token ? <FormUser /> : <Navigate to="/" replace />}
        />
        <Route
          path="/datatable"
          element={token ? <ConsultaActivos /> : <Navigate to="/" replace />}
        />
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
