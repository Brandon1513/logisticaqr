import React from "react";
import { Link } from "react-router-dom";
import activosTable from "../components/activosTable";
import "../assets/styles/ManageUser.css";

function ConsultaActivos() {
    return (
        <div className="manage-users">
            <div className="header-section">
                <Link to="/create-user" className="add-user-button">Agregar Usuario</Link>
            </div>
            <div className="datatable-section">
                <activosTable />
            </div>
        </div>
    );
}

export default ConsultaActivos;