import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/editProfile.css";

function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [rol, setRole] = useState(null);

  useEffect(() => {
    const currentState = location.state;
    if (currentState && currentState.rol) {
      setRole(currentState.rol);
    } else {
      const storedRole = localStorage.getItem("rol");
      setRole(storedRole);
    }
  }, [location]); 

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rol: "",
    departamento: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            username: data.username,
            email: data.email,
            password: "",
            rol: data.rol,
            departamento: data.departamento,
          });
        } else {
          console.error("Error al obtener el perfil del usuario");
          alert("Error al obtener el perfil del usuario");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error en la conexión con el servidor");
      }
    };

    
    if (token) {
      fetchUserData();
    } else {
      alert("Por favor inicia sesión.");
      navigate("/login"); 
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const updatedData = { ...formData };
    if (!updatedData.password) {
      delete updatedData.password; 
    }

    console.log("Datos que se envían:", updatedData); 

    try {
      const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData), 
      });

      if (response.ok) {
        alert("Perfil actualizado exitosamente");
        navigate("/profile");
      } else {
        const errorData = await response.json();
        console.error("Error al actualizar el perfil:", errorData);
        alert(errorData.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="edit-user">
      <h2>Perfil</h2>
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
          <label htmlFor="password">Contraseña *Opcional</label>
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
            disabled={rol !== "Administrador"}
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

        <button type="submit" className="submit-button-Update">
          Actualizar Perfil
        </button>
      </form>
    </div>
  );
}

export default Profile;
