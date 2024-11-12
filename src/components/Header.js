import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/Header.css";
import logo from "../assets/images/DasavenaLogo.png";
import { TiThMenu } from "react-icons/ti";

const Header = ({ rol }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Control del estado del menú móvil

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/");
    setMenuOpen(false); // Cerrar el menú después de cerrar sesión
  };

  // Función para manejar el cierre del menú al hacer clic en un enlace
  const handleMenuClick = () => {
    setMenuOpen(false); // Cierra el menú al seleccionar una opción
  };

  return (
    <nav className="header">
      <div className="logo-container">
        <img src={logo} className="logo" alt="Dasavena Logo" />
        <span className="logo-text">Dasavena</span>
      </div>
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <TiThMenu color="#2a3443" />
      </div>
      <ul className={`nav-list ${menuOpen ? "show" : ""}`}>
        <li>
          <Link to="/home" onClick={handleMenuClick}>
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/qr-generator" onClick={handleMenuClick}>
            Generador de QR
          </Link>
        </li>
        <li>
          <Link to="/datatable" onClick={handleMenuClick}>
            Consultas
          </Link>
        </li>
        <li>
          <Link to="/profile" onClick={handleMenuClick}>
            Perfil
          </Link>
        </li>
        {rol === "Administrador" && (
          <li>
            <Link to="/manage-users" onClick={handleMenuClick}>
              Gestionar Usuarios
            </Link>
          </li>
        )}
        <li>
          <Link to="/" onClick={handleLogout}>
            Salir
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
