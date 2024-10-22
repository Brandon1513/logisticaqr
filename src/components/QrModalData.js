import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import DasavenaLogo from "../assets/images/DasavenaLogo.png";
import {
  tipoMap,
  ubicacionesMap,
  produccionMap,
  almacenMap,
  sanitariosMap,
  oficinasMap,
} from "../assets/Ubicaciones";

const QrModalData = ({
  isOpen,
  modalData,
  qrString,
  setQrString,
  generateQrString,
  handleDownloadQr,
  closeModal,
}) => {
  const qrRef = useRef(null);
  if (!isOpen || !modalData) return null;
  return (
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
            {produccionMap[modalData.ubicacionProd] || modalData.ubicacionProd}
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
            onClick={() => {
              const qrContent = generateQrString(modalData);
              setQrString(qrContent);
            }}
          >
            Generar QR
          </button>
          <button className="close-button" onClick={closeModal}>
            Cerrar
          </button>
        </div>

        {qrString && (
          <div className="qr-code" ref={qrRef}>
            <QRCodeCanvas
              value={qrString}
              size={256}
              level="Q"
              marginSize={0}
              imageSettings={{
                src: DasavenaLogo,
                height: 150,
                width: 150,
                opacity: 1,
                excavate: false,
              }}
            />
          </div>
        )}

        {qrString && (
          <div className="export-qr">
            <button
              className="export-button"
              onClick={() => handleDownloadQr(qrRef, modalData)}
            >
              Exportar QR a PNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrModalData;
