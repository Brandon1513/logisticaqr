import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/FormUser.css";
import { API_BASE_URL } from "../config";

function FormUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rol: "",
    departamento: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("No tienes un token. Inicia sesión para continuar.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Usuario creado exitosamente");
        alert("Usuario creado exitosamente");
        navigate("/manage-users");
      } else {
        const errorData = await response.json();
        console.error("Error al crear el usuario:", errorData);
        alert(errorData.message || "Error al crear el usuario");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="create-user">
      <h2>Crear Nuevo Usuario</h2>
      <form onSubmit={handleSubmit} className="create-user-form">
        <div className="form-group">
          <label htmlFor="username">Nombre</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rol">Rol</label>
          <select
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
          >
            <option value="Empleado">Empleado</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="departamento">Departamento</label>
          <input
            type="text"
            id="departamento"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Crear Usuario
        </button>
      </form>
    </div>
  );
}

export default FormUser;
