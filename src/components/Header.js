import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/Header.css";
import logo from "../assets/images/DasavenaLogo.png";

const Header = ({ rol }) => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("rol"); 
    navigate("/"); 
  };

  return (
    <nav className="header">
      <div className="logo-container">
        <img src={logo} className="logo" alt="Dasavena Logo" />
        <span className="logo-text">Dasavena</span>
      </div>
      <ul className="nav-list">
        <li>
          <Link to="/home">Inicio</Link>
        </li>
        <li>
          <Link to="/qr-generator">Generador de QR</Link>
        </li>
        <li>
          <Link to="/datatable">Consultas</Link>
        </li>
        <li>
          <Link to="/profile" onPre>Perfil</Link>
        </li>
        {rol === "Administrador" && (
          <li>
            <Link to="/manage-users">Gestionar Usuarios</Link>
          </li>
        )}
        
        <li>
          <Link to="/" onClick={handleLogout}>Salir</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
