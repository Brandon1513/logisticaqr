import React from "react";
import { Link } from "react-router-dom";
import '../assets/styles/Header.css';
import logo from '../assets/images/DasavenaLogo.png'

function Header() {
    return (
        <nav className="header">
            <div className="logo-container">
                <img src={logo} className="logo" />
                <span className="logo-text">Dasavena</span>
            </div>
            <ul className="nav-list">
                <li>
                    <Link to="/Home">Inicio</Link>
                </li>
                <li>
                    <Link to="/qr-generator">Generador de QR</Link>
                </li>
                <li>
                    <Link to="/datatable">Consultas</Link>
                </li>
                <li>
                    <Link to="/">Salir</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Header;
