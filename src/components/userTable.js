import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/DataTable.css";
import { API_BASE_URL } from "../config";

function DataTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/dataUser`);
        if (!response.ok) {
          throw new Error("Error al obtener los usuarios");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error:", error);
        setError("No se pudieron cargar los usuarios. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const token = localStorage.getItem("token");

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`${API_BASE_URL}/user/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Asegúrate de que `token` esté disponible
        },
      });
  
      if (response.ok) {
        // Actualizar la lista de usuarios eliminando el que fue borrado
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        alert("Usuario eliminado exitosamente");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      alert("No se pudo eliminar el usuario. Intenta de nuevo más tarde.");
    }
  };
  

  const handleEdit = (user) => {
    navigate("/editProfile", { state: { user } });
  };

  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Departamento</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.rol}</td>
              <td>{user.departamento}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(user)}>
                  Editar
                </button>
                <button className="delete-button" onClick={() => handleDelete(user._id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No hay usuarios disponibles.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default DataTable;
