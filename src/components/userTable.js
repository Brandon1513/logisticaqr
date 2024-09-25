import React from "react";
import "../assets/styles/DataTable.css";

function DataTable() {
    // Datos simulados
    const users = [
        { 
            name: "Brandon Javier Devora Lucio", 
            email: "brandon.devora@dasavena.com", 
            role: "Administrador", 
            department: "TI" 
        },
        { 
            name: "Omar Guadalupe Arellano", 
            email: "omar@dasavena.com", 
            role: "Empleado", 
            department: "Ventas" 
        },
        { 
            name: "Denisse Álvarez", 
            email: "denisse@dasavena.com", 
            role: "Empleado", 
            department: "Marketing" 
        },
        { 
            name: "Karen Apolinar", 
            email: "karen.apolinar@dasavena.com", 
            role: "Empleado", 
            department: "Recursos Humanos" 
        },
        { 
            name: "Lorena López", 
            email: "rhumanos@dasavena.com", 
            role: "Empleado", 
            department: "Recursos Humanos" 
        },
        { 
            name: "Hector Aguilera", 
            email: "hector.aguilera@dasavena.com", 
            role: "Empleado", 
            department: "Logística" 
        },
        { 
            name: "Sarai Gutierrez", 
            email: "sarai.gutierrez@dasavena.com", 
            role: "Empleado", 
            department: "Finanzas" 
        },
    ];

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
                {users.map((user, index) => (
                    <tr key={index}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.department}</td>
                        <td>
                            <button className="edit-button">Editar</button>
                            <button className="delete-button">Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default DataTable;
