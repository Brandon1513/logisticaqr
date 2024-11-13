import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/activosTable.css";
import { tipoMap, ubicacionesMap } from "../assets/Ubicaciones";
import * as Fa6Icons from "react-icons/fa6";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import {
  generateQrString,
  downloadQR,
} from "../utils/qrFunctions/exportQrFunction";
import {
  exportToExcel,
  exportToPDF,
} from "../utils/qrFunctions/exportTableFunction";
import { deleteQRCode } from "../utils/qrFunctions/qrUtils";
import QrModalData from "./QrModalData";

const ActivosTable = () => {
  const [qrData, setQrData] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrString, setQrString] = useState("");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const [rol, setRole] = useState(null);
  const token = localStorage.getItem("token");

  //Localiza el rol del usuario
  useEffect(() => {
    const currentState = location.state;
    if (currentState && currentState.rol) {
      setRole(currentState.rol);
    } else {
      const storedRole = localStorage.getItem("rol");
      setRole(storedRole);
    }
  }, [location]);

  //Recibe los datos de la base de datos para su organización en la tabla
  useEffect(() => {
    const fetchQrData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/qr/qr-data`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setQrData(data);
        } else {
          console.error("Los datos recibidos no son un array:", data);
          setQrData([]);
        }
      } catch (error) {
        console.error("Error fetching QR data:", error);
      }
    };

    fetchQrData();
  }, []);

  //Abre y cierra el modal donde podemos generar el QR
  const openModal = (item) => {
    setModalData(item);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setModalData(null);
    setIsModalOpen(false);
    setQrString("");
  };

  //Descarga el QR con el diseño en formato png
  const handleDownloadQr = (qrRef, modalData) => {
    if (qrRef.current) {
      downloadQR(qrRef, modalData);
    } else {
      console.error("El QR no está disponible para descargar");
    }
  };

  //Abre la ventana para editar los datos enviando el id
  const handleEdit = (item) => {
    navigate(`/edit-qr/${item._id}`, { state: { activo: item } });
  };

  //Elimina los datos con el parametro id
  const handleDelete = async (id) => {
    const newQrData = await deleteQRCode(id, token, qrData, setQrData);
    if (newQrData) {
      setQrData(newQrData);
    }
  };

  //Funcionamiento de la barra de busqueda para filtrado de datos
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckboxChange = async (item) => {
    const updatedImpreso = !item.impreso; // Alterna el estado de "impreso"

    try {
      const response = await fetch(
        `${API_BASE_URL}/qr/update-checkbox/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ impreso: updatedImpreso }), // Envía el nuevo valor de "impreso"
        }
      );

      if (response.ok) {
        const updatedItem = await response.json();

        // Actualiza el estado local de qrData para reflejar el cambio en el frontend
        setQrData((prevData) =>
          prevData.map((qrItem) =>
            qrItem._id === item._id ? updatedItem : qrItem
          )
        );
      } else {
        console.error("Error al actualizar el estado de impreso");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
  };

  //Creación de objeto de datos filtrados para su exportación
  const filteredData = qrData.filter(
    (item) =>
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.noSerie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tipoMap[item.tipo]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ubicacionesMap[item.ubicacion]
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //Botones de Exportacion Excel y PDF
  const handleExportToExcel = () => {
    exportToExcel(filteredData);
  };
  const handleExportToPDF = () => {
    exportToPDF(filteredData);
  };

  //Constantes y funciones para la paginacion de la tabla
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleFirstPage = () => {
    setCurrentPage(1);
  };
  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };
  return (
    <div className="activosContainer">
      <h2>Activos Dasavena</h2>

      <div className="searchBar-container">
        <input
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>

      <div className="export-buttons">
        <button onClick={handleExportToExcel} className="export-excel">
          <Fa6Icons.FaFileExcel size={30} color="green" />
        </button>

        <button onClick={handleExportToPDF} className="export-pdf">
          <Fa6Icons.FaFilePdf size={30} color="red" />
        </button>
      </div>

      <div className="table-container">
        <table className="activos-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>No. de Serie</th>
              <th>Proveedor</th>
              <th>Tipo</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Impreso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item) => (
              <tr key={item._id}>
                <td>{item.nombre}</td>
                <td>{item.noSerie}</td>
                <td>{item.proveedor}</td>
                <td>{tipoMap[item.tipo] || item.tipo}</td>
                <td>{ubicacionesMap[item.ubicacion] || item.ubicacion}</td>
                <td>{item.estado}</td>
                <td>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id={`checkbox-${item._id}`}
                      checked={item.impreso}
                      onChange={() => handleCheckboxChange(item)}
                    />
                    <label
                      htmlFor={`checkbox-${item._id}`}
                      className="custom-checkbox"
                    ></label>
                  </div>
                </td>
                <td>
                  <button
                    className="view-button"
                    onClick={() => openModal(item)}
                  >
                    <FaIcons.FaRegEye size={20} />
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(item)}
                  >
                    <FaIcons.FaRegEdit size={20} />
                  </button>
                  {rol === "Administrador" && (
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(item._id)}
                    >
                      <MdIcons.MdDeleteOutline size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button
          className="button-pages"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
        >
          <FaIcons.FaAngleDoubleLeft size={20} color="#FFF" />
        </button>
        <button
          className="button-pages"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <FaIcons.FaAngleLeft size={23} color="#FFF" />
        </button>
        <span>
          {currentPage} de {totalPages}
        </span>
        <button
          className="button-pages"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <FaIcons.FaAngleRight size={23} color="#FFF" />
        </button>
        <button
          className="button-pages"
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
        >
          <FaIcons.FaAngleDoubleRight size={20} color="#FFF" />
        </button>
      </div>

      <QrModalData
        isOpen={isModalOpen}
        modalData={modalData}
        qrString={qrString}
        setQrString={setQrString}
        generateQrString={generateQrString}
        closeModal={closeModal}
        handleDownloadQr={handleDownloadQr}
      />
    </div>
  );
};

export default ActivosTable;
