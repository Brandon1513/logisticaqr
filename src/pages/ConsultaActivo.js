import React from "react";
import ActivosTable from "../components/activosTable";
import "../assets/styles/ManageUser.css";

function ConsultaActivos() {
  return (
    <div className="manage-users">
      <div className="datatable-section">
        <ActivosTable />
      </div>
    </div>
  );
}

export default ConsultaActivos;
