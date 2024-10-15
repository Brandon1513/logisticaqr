import React, { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "../assets/styles/activosTable.css";
import {
  tipoMap,
  ubicacionesMap,
  produccionMap,
  almacenMap,
  sanitariosMap,
  oficinasMap,
} from "../assets/Ubicaciones";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

import * as Fa6Icons from "react-icons/fa6";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";

const ActivosTable = () => {
  const [qrData, setQrData] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrString, setQrString] = useState("");
  const qrRef = useRef(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
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

  useEffect(() => {
    const fetchQrData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/qr/qr-data`);
        const data = await response.json();

        console.log("Datos recibidos de la API:", data);
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

  const openModal = (item) => {
    setModalData(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalData(null);
    setIsModalOpen(false);
    setQrString("");
  };

  const generateQrString = (data) => {
    const qrContent = `
      Nombre: ${data.nombre}\n
      No. de Serie: ${data.noSerie}\n
      Proveedor: ${data.proveedor}\n
      Tipo: ${tipoMap[data.tipo] || data.tipo}\n
      Ubicación: ${ubicacionesMap[data.ubicacion] || data.ubicacion}\n
      ${data.propietario ? `Propietario: ${data.propietario}\n` : ""}
      ${
        data.ubicacionProd
          ? `Producción: ${
              produccionMap[data.ubicacionProd] || data.ubicacionProd
            }\n`
          : ""
      }
      ${
        data.ubicacionAlma
          ? `Almacén: ${almacenMap[data.ubicacionAlma] || data.ubicacionAlma}\n`
          : ""
      }
      ${
        data.ubicacionSanita
          ? `Sanitario: ${
              sanitariosMap[data.ubicacionSanita] || data.ubicacionSanita
            }\n`
          : ""
      }
      ${
        data.ubicacionOfi
          ? `Oficina: ${oficinasMap[data.ubicacionOfi] || data.ubicacionOfi}\n`
          : ""
      }
    `;
    setQrString(qrContent.trim());
  };

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");

    // Crear un nuevo canvas para la exportación
    const exportCanvas = document.createElement("canvas");
    const ctx = exportCanvas.getContext("2d");

    // Definir dimensiones de exportación
    const exportWidth = canvas.width + 10;
    const exportHeight = canvas.height + 120;
    exportCanvas.width = exportWidth;
    exportCanvas.height = exportHeight;

    // Fondo blanco
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, exportWidth, exportHeight);

    // Texto del título (ejemplo: "Dasavena")
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";

    const title = "Dasavena"; // Puedes cambiarlo si lo deseas
    const reference = modalData.referencia || "Referencia"; // La referencia que viene de modalData

    const titleYPosition = 30;
    const referenceYPosition = titleYPosition + 30;

    ctx.fillText(title, exportWidth / 2, titleYPosition);
    ctx.font = "20px Arial";
    ctx.fillText(reference, exportWidth / 2, referenceYPosition);

    // Posicionar el QR debajo del texto
    const qrYPosition = referenceYPosition + 20;
    const qrXPosition = (exportWidth - canvas.width) / 2;
    ctx.drawImage(canvas, qrXPosition, qrYPosition);

    // Convertir el canvas a URL de imagen PNG
    const exportPngUrl = exportCanvas.toDataURL("image/png");

    // Crear enlace de descarga
    const downloadLink = document.createElement("a");
    downloadLink.href = exportPngUrl;
    downloadLink.download = `QR_${modalData.nombre}_${modalData.ubicacion}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleEdit = (item) => {
    navigate(`/edit-qr/${item._id}`, { state: { activo: item } });
  };

  const token = localStorage.getItem("token");
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este QR?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/qr/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Activo eliminado correctamente");
        setQrData(qrData.filter((item) => item._id !== id));
      } else {
        alert("Error al eliminar el Activo");
      }
    } catch (error) {
      console.error("Error eliminando QR:", error);
      alert("Hubo un error al intentar eliminar el Activo");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Actualizar el término de búsqueda
  };

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

  const exportToExcel = () => {
    const headers = [
      "Nombre",
      "No. de Serie",
      "Proveedor",
      "Tipo",
      "Ubicación",
      "Estado",
    ];
    const rows = filteredData.map((item) => [
      item.nombre,
      item.noSerie,
      item.proveedor,
      tipoMap[item.tipo] || item.tipo,
      ubicacionesMap[item.ubicacion] || item.ubicacion,
      item.estado,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activos Filtrados");

    XLSX.writeFile(workbook, "activos_filtrados.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Nombre",
      "No. de Serie",
      "Proveedor",
      "Tipo",
      "Ubicación",
      "Estado",
    ];
    const tableRows = [];

    filteredData.forEach((item) => {
      const rowData = [
        item.nombre,
        item.noSerie,
        item.proveedor,
        item.tipo,
        item.ubicacion,
        item.estado,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("activos_filtrados.pdf");
  };

  return (
    <div>
      <h2>Activos Dasavena</h2>

      <input
        type="text"
        placeholder="Buscar"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <div className="export-buttons">
        <button onClick={exportToExcel} className="export-excel">
          <Fa6Icons.FaFileExcel size={30} color="green" />
        </button>

        <button onClick={exportToPDF} className="export-pdf">
          <Fa6Icons.FaFilePdf size={30} color="red" />
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>No. de Serie</th>
            <th>Proveedor</th>
            <th>Tipo</th>
            <th>Ubicación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              <td>{item.nombre}</td>
              <td>{item.noSerie}</td>
              <td>{item.proveedor}</td>
              <td>{tipoMap[item.tipo] || item.tipo}</td>
              <td>{ubicacionesMap[item.ubicacion] || item.ubicacion}</td>
              <td>{item.estado}</td>
              <td>
                <button className="view-button" onClick={() => openModal(item)}>
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

      {isModalOpen && modalData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Detalles del QR</h3>

            <p>
              <strong>ID:</strong> {modalData._id}
            </p>
            <p>
              <strong>Nombre:</strong> {modalData.nombre}
            </p>
            <p>
              <strong>No. de Serie:</strong> {modalData.noSerie}
            </p>
            <p>
              <strong>Proveedor:</strong> {modalData.proveedor}
            </p>
            <p>
              <strong>Tipo:</strong> {tipoMap[modalData.tipo] || modalData.tipo}
            </p>

            {modalData.propietario && (
              <p>
                <strong>Propietario:</strong> {modalData.propietario}
              </p>
            )}
            <p>
              <strong>Ubicación:</strong>{" "}
              {ubicacionesMap[modalData.ubicacion] || modalData.ubicacion}
            </p>

            {modalData.ubicacionProd && (
              <p>
                <strong>Producción:</strong>{" "}
                {produccionMap[modalData.ubicacionProd] ||
                  modalData.ubicacionProd}
              </p>
            )}

            {modalData.ubicacionAlma && (
              <p>
                <strong>Almacén:</strong>{" "}
                {almacenMap[modalData.ubicacionAlma] || modalData.ubicacionAlma}
              </p>
            )}

            {modalData.ubicacionSanita && (
              <p>
                <strong>Sanitario:</strong>{" "}
                {sanitariosMap[modalData.ubicacionSanita] ||
                  modalData.ubicacionSanita}
              </p>
            )}

            {modalData.ubicacionOfi && (
              <p>
                <strong>Oficina:</strong>{" "}
                {oficinasMap[modalData.ubicacionOfi] || modalData.ubicacionOfi}
              </p>
            )}

            <p>
              <strong>Referencia:</strong> {modalData.referencia}
            </p>
            <p>
              <strong>Estado:</strong> {modalData.estado}
            </p>

            <div className="modal-buttons">
              <button
                className="generate-qr-button"
                onClick={() => generateQrString(modalData)}
              >
                Generar QR
              </button>
              <button className="close-button" onClick={closeModal}>
                Cerrar
              </button>
            </div>

            {qrString && (
              <div className="qr-code" ref={qrRef}>
                <QRCodeCanvas value={qrString} size={256} />
              </div>
            )}

            {qrString && (
              <div className="export-qr">
                <button className="export-button" onClick={downloadQR}>
                  Exportar QR a PNG
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivosTable;
