import React from "react";
import ActivosTable from "../components/activosTable";
import "../assets/styles/activosTable.css";

function ConsultaActivos() {
  return (
    <div className="manage-activos">
      <div className="datatable-section">
        <ActivosTable />
      </div>
    </div>
  );
}

export default ConsultaActivos;
