import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "../assets/styles/editProfile.css";

function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state;

  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    password: "",
    rol: user.rol,
    departamento: user.departamento,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const token = localStorage.getItem("token");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/user/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Usuario actualizado exitosamente");
        alert("Usuario actualizado exitosamente");
        navigate("/manage-users");
      } else {
        const errorData = await response.json();
        console.error("Error al actualizar el usuario:", errorData);
        alert(errorData.message || "Error al actualizar el usuario");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="edit-user">
      <h2>Editar Perfil de {user.username}</h2>
      <form onSubmit={handleUpdateProfile} className="edit-user-form">
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
          <label htmlFor="email">Correo Electrónico *Opcional</label>
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

        <button
          type="submit"
          className="submit-button-Update"
        >
          Actualizar Usuario
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
