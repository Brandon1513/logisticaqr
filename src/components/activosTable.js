import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { Link } from "react-router-dom";
import "../assets/styles/activosTable.css";
import {
  tipoMap,
  ubicacionesMap,
  produccionMap,
  almacenMap,
  sanitariosMap,
  oficinasMap,
} from "../assets/Ubicaciones";

const ActivosTable = () => {
  const [qrData, setQrData] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  };

  const handleDelete = (id) => {
    // Aquí debes implementar la lógica para eliminar el elemento
    console.log(`Eliminar elemento con ID: ${id}`);
  };

  return (
    <div>
      <h2>Datos de los Códigos QR</h2>
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
          {qrData.map((item) => (
            <tr key={item._id}>
              <td>{item.nombre}</td>
              <td>{item.noSerie}</td>
              <td>{item.proveedor}</td>
              <td>{tipoMap[item.tipo] || item.tipo}</td>
              <td>{ubicacionesMap[item.ubicacion] || item.ubicacion}</td>
              <td>{item.estado}</td>
              <td>
                <button className="view-button" onClick={() => openModal(item)}>
                  Ver
                </button>

                <Link to={`/edit/${item._id}`}>
                  <button className="edit-button">Editar</button>
                </Link>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(item._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && modalData && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Título centrado */}
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
                <strong>Sub-Ubicación:</strong>{" "}
                {produccionMap[modalData.ubicacionProd] ||
                  modalData.ubicacionProd}
              </p>
            )}

            {modalData.ubicacionAlma && (
              <p>
                <strong>Sub-Ubicación:</strong>{" "}
                {almacenMap[modalData.ubicacionAlma] || modalData.ubicacionAlma}
              </p>
            )}

            {modalData.ubicacionSanita && (
              <p>
                <strong>Sub-Ubicación:</strong>{" "}
                {sanitariosMap[modalData.ubicacionSanita] ||
                  modalData.ubicacionSanita}
              </p>
            )}

            {modalData.ubicacionOfi && (
              <p>
                <strong>Sub-Ubicación:</strong>{" "}
                {oficinasMap[modalData.ubicacionOfi] || modalData.ubicacionOfi}
              </p>
            )}

            <p>
              <strong>Referencia:</strong> {modalData.referencia}
            </p>
            <p>
              <strong>Estado:</strong> {modalData.estado}
            </p>

            {/* Botones centrados */}
            <div className="modal-buttons">
              <button className="generate-qr-button">Generar QR</button>
              <button className="close-button" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivosTable;
