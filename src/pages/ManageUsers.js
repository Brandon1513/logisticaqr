import React from "react";
import { Link } from "react-router-dom";
import DataTable from "../components/userTable";
import "../assets/styles/ManageUser.css";

function ManageUsers() {
  return (
    <div className="manage-users">
      <div className="header-section">
        <Link to="/create-user" className="add-user-button">
          Agregar Usuario
        </Link>
      </div>
      <div className="datatable-section">
        <DataTable />
      </div>
    </div>
  );
}

export default ManageUsers;
