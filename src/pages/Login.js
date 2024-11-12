import React, { useState } from "react";
import "../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

import Logo from "../assets/images/DasavenaLogo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guarda el token y el rol en el localStorage o contexto
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);

        navigate("/home");
      } else {
        // Manejar errores, como mostrar un mensaje de error
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error en la petición de login:", error);
      alert(
        "Hubo un problema al conectar con el servidor. Inténtalo más tarde."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={Logo} className="logo-user" />
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
